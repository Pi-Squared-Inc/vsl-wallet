import type { SnapConfig } from '@metamask/snaps-cli';
import { resolve } from 'path';

const config: SnapConfig = {
  input: resolve(__dirname, 'src/index.ts'),
  server: {
    port: 8080,
  },
  polyfills: {
    process: true,
    buffer: true,
    events: true,
  },
  // You must use 127.0.0.1 instead of localhost as node by default try ipv6 first
  environment: {
    VSL_ENDPOINT: 'http://127.0.0.1:44444',
  },
};

export default config;
