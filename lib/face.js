import * as Haptics from 'expo-haptics'

import { previewSize } from '../components/FaceDetector.js'
import { scrollUp, scrollDown } from './scroll.js'

let debounce = false

const setDebounce = (wait = 1000) => {
  debounce = true
  setTimeout(() => {
    debounce = false
  }, wait)
}

let blinkedOnce = false
let eyesClosed = false

export default function (
  {
    leftEyePosition,
    leftEyeOpenProbability,
    rightEyePosition,
    rightEyeOpenProbability,
    yawAngle
  },
  setFaceState,
  webviewRef,
  searchbarRef
) {
  if (
    leftEyePosition.x < 10 ||
    rightEyePosition.x > previewSize.width - 10 ||
    Math.min(leftEyePosition.y, rightEyePosition.y) < 10 ||
    Math.max(leftEyePosition.y, rightEyePosition.y) > previewSize.height - 10 ||
    Math.abs(yawAngle) > 40
  ) {
    setFaceState('noFace')
    return
  }

  setFaceState('normal')

  if (!debounce) {
    if (rightEyeOpenProbability - leftEyeOpenProbability > 0.6) {
      webviewRef.current.injectJavaScript(scrollUp)
      setDebounce()
      Haptics.selectionAsync()
    } else if (leftEyeOpenProbability - rightEyeOpenProbability > 0.6) {
      webviewRef.current.injectJavaScript(scrollDown)
      setDebounce()
      Haptics.selectionAsync()
    } else if (leftEyeOpenProbability < 0.3 && rightEyeOpenProbability < 0.3) {
      if (blinkedOnce) {
        searchbarRef.current.focus()
        blinkedOnce = false
        setDebounce()
      } else {
        eyesClosed = true
      }
    } else {
      if (eyesClosed) {
        eyesClosed = false
        blinkedOnce = true
        setTimeout(() => {
          blinkedOnce = false
        }, 250)
      }
    }
  }
}
