const path = require('path');

const hookPath = path.resolve(__dirname, 'force-vue2.js');
const existing = process.env.NODE_OPTIONS ? `${process.env.NODE_OPTIONS} ` : '';
process.env.NODE_OPTIONS = `${existing}--require ${hookPath}`;

require('../node_modules/jest/bin/jest');

