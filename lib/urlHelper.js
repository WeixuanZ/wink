// eslint-disable-next-line no-useless-escape
const urlRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/
// eslint-disable-next-line no-useless-escape
const baseUrlRegex = /^.+?[^\/:](?=[?\/]|$)/

const validateUrl = (str) => urlRegex.test(str)

export const formatQuery = (str) =>
  validateUrl(str)
    ? `https://${str}`
    : `https://www.google.com/search?q=${encodeURIComponent(str)}`

const getBaseUrl = (url) => url.slice(8).match(baseUrlRegex)[0]

export const getDisplayStr = (url) =>
  url.slice(0, 32) === 'https://www.google.com/search?q=' ? decodeURI(url.slice(32)) : getBaseUrl(url)
