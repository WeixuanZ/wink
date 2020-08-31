import { getBaseUrl, getBaseName } from './url.js'
import { useStoredReducer } from './storage.js'

import defaultBookmarks from '../config/defaultBookmarks.js'

export const bookmarkExists = (url, bookmarks) =>
  bookmarks.reduce(
    (acc, val) => val.url === `https://${getBaseUrl(url)}` || acc,
    false
  )

const formatTitle = (url) => {
  const baseName = getBaseName(getBaseUrl(url))
  return (baseName.match(/[.]/g) || []).length > 1
    ? getBaseUrl(url)
    : `${baseName[0].toUpperCase()}${baseName.slice(1)}`
}

const addBookmark = (url, bookmarks) => {
  const baseUrl = `https://${getBaseUrl(url)}`
  return [...bookmarks, { title: formatTitle(url), url: baseUrl, id: baseUrl }]
}

const removeBookmark = (url, bookmarks) =>
  bookmarks.filter((el) => el.url !== `https://${getBaseUrl(url)}`)

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return addBookmark(action.payload, state)
    case 'REMOVE':
      return removeBookmark(action.payload, state)
    case 'RESET':
      return defaultBookmarks
    default:
      return action.payload
  }
}

export const useBookmarks = () => {
  return useStoredReducer('@bookmarks', reducer, defaultBookmarks)
}
