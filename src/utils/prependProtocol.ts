export function prependProtocol(url?: string): string | undefined {
  if (url && !/^https?:\/\//i.test(url)) return `http://${url}`;
  return url;
}
