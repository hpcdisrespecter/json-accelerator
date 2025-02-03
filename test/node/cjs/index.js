if ('Bun' in globalThis) {
  throw new Error('❌ Use Node.js to run this test!');
}

const { createAccelerator } = require('json-accelerator');

if (typeof createAccelerator !== 'function') {
  throw new Error('❌ CommonJS Node.js failed');
}

console.log('✅ CommonJS Node.js works!');
