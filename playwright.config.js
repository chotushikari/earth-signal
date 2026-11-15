import {defineConfig} from '@playwright/test';
import {existsSync} from 'node:fs';
const executablePath=['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
export default defineConfig({testDir:'tests/ui',timeout:75000,workers:1,reporter:'list',use:{baseURL:process.env.TEST_BASE_URL||'http://127.0.0.1:5174',headless:true,launchOptions:executablePath?{executablePath}:{}},webServer:process.env.TEST_BASE_URL?undefined:{command:'npm run dev -- --host 127.0.0.1 --port 5174',url:'http://127.0.0.1:5174',reuseExistingServer:true,timeout:60000}});
