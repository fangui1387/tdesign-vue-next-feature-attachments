const Module = require('module');
const path = require('path');

const originalResolveFilename = Module._resolveFilename;
const vue2Dir = path.join(__dirname, '..', 'node_modules', 'vue');
const vue2Entry = require.resolve(vue2Dir);

Module._resolveFilename = function (request, parent, isMain, options) {
  if (request === 'vue') {
    return vue2Entry;
  }
  if (request.startsWith('vue/')) {
    return path.join(vue2Dir, request.slice('vue/'.length));
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};
