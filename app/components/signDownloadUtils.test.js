const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeDownloadAsset } = require('./signDownloadUtils.js');

const origin = 'https://roadsignfactory.hk';

test('normalizeDownloadAsset unwraps a nested same-origin proxy URL', () => {
  const proxyUrl = 'https://roadsignfactory.hk/api/proxy?url=' + encodeURIComponent('https://roadsignfactory.hk/api/proxy?asset=%2Fdata%2Fsvgs%2FTS_107.svg');
  const normalized = normalizeDownloadAsset(proxyUrl, 'TS_107.svg', origin);
  assert.equal(normalized, '/api/proxy?asset=%2Fdata%2Fsvgs%2FTS_107.svg');
});

test('normalizeDownloadAsset falls back to the direct asset path when the URL is already a local asset', () => {
  const normalized = normalizeDownloadAsset('/data/svgs/TS_107.svg', 'TS_107.svg', origin);
  assert.equal(normalized, '/api/proxy?asset=%2Fdata%2Fsvgs%2FTS_107.svg');
});

test('normalizeDownloadAsset keeps non-proxy URLs unchanged when no asset path is available', () => {
  const url = 'https://example.com/image.svg';
  const normalized = normalizeDownloadAsset(url, 'TS_107.svg', origin);
  assert.equal(normalized, url);
});
