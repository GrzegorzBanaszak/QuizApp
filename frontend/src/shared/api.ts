const configuredBackendUrl = import.meta.env.VITE_BACKEND_URL?.trim();

const normalizedBackendUrl = configuredBackendUrl
  ? configuredBackendUrl.replace(/\/+$/, "")
  : "";

export function buildApiUrl(path: string): string {
  if (!normalizedBackendUrl) {
    return path;
  }

  return `${normalizedBackendUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function resolveBackendAssetUrl(url: string | null | undefined): string {
  if (!url) {
    return "";
  }

  if (/^(?:[a-z]+:)?\/\//i.test(url) || url.startsWith("data:")) {
    return url;
  }

  return buildApiUrl(url);
}
