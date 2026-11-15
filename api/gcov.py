import json
from http.server import BaseHTTPRequestHandler
from threading import BoundedSemaphore

from science.gcov import run

slots = BoundedSemaphore(1)


class handler(BaseHTTPRequestHandler):
    def respond(self, status, body):
        payload = json.dumps(body, allow_nan=False).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if not 0 < length <= 2048:
                return self.respond(400, {"error": "Invalid GCOV request size."})
            payload = json.loads(self.rfile.read(length))
        except (ValueError, UnicodeError):
            return self.respond(400, {"error": "Invalid JSON request."})
        if not slots.acquire(blocking=False):
            return self.respond(429, {"error": "Another radar window is being processed. Try again shortly."})
        try:
            self.respond(*run(payload))
        finally:
            slots.release()
