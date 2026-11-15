import { defineConfig, loadEnv } from 'vite';
import { execFile } from 'node:child_process';
import react from '@vitejs/plugin-react';
import cesium from 'vite-plugin-cesium';
import asfSearchHandler from './api/asf-search.js';
import earthdataAssetHandler from './api/earthdata-asset.js';
import watchpointsHandler from './api/watchpoints.js';
import healthHandler from './api/health.js';

let processing = false;
async function gcovDevHandler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  const send = (status, body) => {
    res.statusCode = status;
    res.end(JSON.stringify(body));
  };
  if (req.method !== 'POST') return send(405, {error: 'Use POST to process observations.'});
  const chunks = [];
  let bytes = 0;
  for await (const chunk of req) {
    bytes += chunk.length;
    if (bytes > 2048) return send(413, {error: 'GCOV request is too large.'});
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  try { JSON.parse(raw); } catch { return send(400, {error: 'Invalid JSON request.'}); }
  if (processing) return send(429, {error: 'Another radar window is being processed. Try again shortly.'});
  processing = true;
  const env = {...process.env, PYTHONDONTWRITEBYTECODE: '1'};
  const child = execFile(process.env.EARTH_SIGNAL_PYTHON || 'python', ['-m', 'science.gcov'],
    {env, timeout: 105_000, maxBuffer: 1024 * 1024, windowsHide: true}, (error, stdout) => {
      processing = false;
      if (res.destroyed) return;
      if (error?.killed) return send(504, {error: 'Radar processing timed out. Try again.'});
      if (error) return send(503, {error: 'The local radar processor is unavailable. Install requirements.txt first.'});
      try {
        const {status, body} = JSON.parse(stdout);
        send(status, body);
      } catch {
        send(502, {error: 'The radar processor returned an invalid response.'});
      }
    });
  child.stdin.on('error', () => {});
  child.stdin.end(raw);
  res.on('close', () => { if (!res.writableEnded) child.kill(); });
}

function wrapVercelHandler(handler) {
  return async (req, res) => {
    const parsedUrl = new URL(req.url, 'http://localhost');
    req.query = Object.fromEntries(parsedUrl.searchParams.entries());

    if (req.method === 'POST' || req.method === 'PUT') {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(Buffer.from(chunk));
      }
      const rawBody = Buffer.concat(chunks).toString('utf8');
      try {
        req.body = rawBody ? JSON.parse(rawBody) : {};
      } catch {
        req.body = rawBody;
      }
    }

    const vercelRes = {
      statusCode: 200,
      setHeader: (k, v) => res.setHeader(k, v),
      status(code) {
        this.statusCode = code;
        res.statusCode = code;
        return this;
      },
      json(obj) {
        if (!res.getHeader('Content-Type')) {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
        }
        res.statusCode = this.statusCode;
        res.end(JSON.stringify(obj));
        return this;
      },
      send(body) {
        res.statusCode = this.statusCode;
        res.end(body);
        return this;
      },
      end(body) {
        res.statusCode = this.statusCode;
        res.end(body);
        return this;
      },
    };

    return handler(req, vercelRes);
  };
}

function earthdataAndSupabaseDevProxy(env) {
  return {
    name: 'earthdata-and-supabase-dev-proxy',
    configureServer(server) {
      Object.assign(process.env, env);
      server.middlewares.use('/api/health', wrapVercelHandler(healthHandler));
      server.middlewares.use('/api/gcov', gcovDevHandler);
      server.middlewares.use(
        '/api/asf-search',
        wrapVercelHandler(asfSearchHandler)
      );
      server.middlewares.use(
        '/api/earthdata-asset',
        wrapVercelHandler(earthdataAssetHandler)
      );
      server.middlewares.use(
        '/api/watchpoints',
        wrapVercelHandler(watchpointsHandler)
      );
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), cesium(), earthdataAndSupabaseDevProxy(env)],
  };
});
