export const scrollDown = `window.scrollBy({
  top: window.innerHeight * 0.9,
  behavior: 'smooth'
});`

export const scrollUp = `window.scrollBy({
  top: -window.innerHeight * 0.9,
  behavior: 'smooth'
});`

export default function injectJS (webviewRef, js) {
  webviewRef.current.injectJavaScript(js)
}
