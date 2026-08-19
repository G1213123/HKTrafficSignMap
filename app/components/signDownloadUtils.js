export function normalizeDownloadAsset(imageUrl, fallbackFilename, origin = 'http://localhost') {
  const resolveAssetPath = (value) => {
    if (!value) return null;

    try {
      const parsed = new URL(value, origin);

      if (parsed.pathname === '/api/proxy') {
        const nestedAsset = parsed.searchParams.get('asset');
        if (nestedAsset) return decodeURIComponent(nestedAsset);

        const nestedUrl = parsed.searchParams.get('url');
        if (nestedUrl) return resolveAssetPath(nestedUrl);
      }

      if (parsed.pathname.startsWith('/data/svgs/')) {
        return parsed.pathname;
      }
    } catch (error) {
      // Ignore invalid URLs; fall through to raw string checks below.
    }

    if (typeof value === 'string' && value.startsWith('/data/svgs/')) {
      return value;
    }

    return null;
  };

  const assetPath = resolveAssetPath(imageUrl);
  if (assetPath) {
    return `/api/proxy?asset=${encodeURIComponent(assetPath)}`;
  }

  if (typeof imageUrl === 'string' && /^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  if (fallbackFilename) {
    return `/api/proxy?asset=${encodeURIComponent(`/data/svgs/${fallbackFilename}`)}`;
  }

  return imageUrl;
}
