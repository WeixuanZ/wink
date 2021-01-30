// eslint-disable-next-line no-useless-escape
const urlRegex = /^((https|http):\/\/)?(?<url>[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?)$/
// eslint-disable-next-line no-useless-escape
const baseUrlRegex = /^.+?[^\/:](?=[?\/]|$)/

const matchValidUrl = (str) => str.match(urlRegex)

export const formatQuery = (str) => {
  const match = matchValidUrl(str)
  return match
    ? `https://${match.groups.url}`
    : `https://www.google.com/search?q=${encodeURIComponent(str)}`
}

const getUrlVars = (url) =>
  url
    .slice(url.indexOf('?') + 1)
    .split('&')
    .reduce((acc, val) => {
      acc[val.split('=')[0]] = val.split('=')[1].replace(/[+]/g, '%20')
      return acc
    }, {})

export const getBaseUrl = (url) => url.slice(8).match(baseUrlRegex)[0]

export const getBaseName = (baseUrl) =>
  baseUrl
    .replace(/^.*?(www|m|mobile)\./, '')
    .replace(/\.(com|net|org|info|coop|int|co|org|ac|edu).*$/, '')

export const getDisplayStr = (url) =>
  url.slice(0, 30) === 'https://www.google.com/search?'
    ? decodeURIComponent(getUrlVars(url).q)
    : getBaseUrl(url)
