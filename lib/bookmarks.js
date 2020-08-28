import { getBaseUrl, getBaseName } from './urlHelper.js'

export const bookmarkExists = (url, bookmarks) =>
  bookmarks.reduce((acc, val) => val.url === `https://${getBaseUrl(url)}` || acc, false)

const formatTitle = (url) => {
  const baseName = getBaseName(getBaseUrl(url))
  return (baseName.match(/[.]/g) || []).length > 1
    ? getBaseUrl(url)
    : `${baseName[0].toUpperCase()}${baseName.slice(1)}`
}

export const addBookmark = (url, bookmarks) => {
  const baseUrl = `https://${getBaseUrl(url)}`
  return [...bookmarks, { title: formatTitle(url), url: baseUrl, id: baseUrl }]
}

export const removeBookmark = (url, bookmarks) =>
  bookmarks.filter((el) => el.url !== `https://${getBaseUrl(url)}`)
