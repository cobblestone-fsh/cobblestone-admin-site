
require('dotenv').config();

const fs = require('fs-extra');

let whiteListFile = fs.readFileSync('./.whitelist').toString();
const ADMIN_WHITELIST = whiteListFile.split(/\s/);

module.exports = {
  ADMIN_WHITELIST
};