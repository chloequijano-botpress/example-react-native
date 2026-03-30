const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Avoid Watchman when it hits "Operation not permitted" (e.g. Desktop, privacy, sandbox).
// Metro falls back to Node crawling; slightly slower but reliable.
config.resolver.useWatchman = false;

module.exports = config;
