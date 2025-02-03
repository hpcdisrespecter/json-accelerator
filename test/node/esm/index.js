if ('Bun' in globalThis) {
  throw new Error('❌ Use Node.js to run this test!');
}

import { createAccelerator } from 'json-accelerator';

if (typeof createAccelerator !== 'function') {
  throw new Error('❌ ESM Node.js failed');
}

console.log('✅ ESM Node.js works!');
