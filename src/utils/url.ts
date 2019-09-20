export function getUrlParams(): { [key: string]: string } {
  const url = new URL(location.href)
  const obj: { [key: string]: string } = {}

  for (const key of url.searchParams.keys()) {
    obj[key] = url.searchParams.get(key) as string
  }
  return obj
}
