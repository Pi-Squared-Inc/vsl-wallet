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
  environment: {
    VSL_ENDPOINT: 'http://144.76.7.152:44444',
  },
};

export default config;
