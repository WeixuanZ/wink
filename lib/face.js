import * as Haptics from 'expo-haptics'

import { previewSize } from '../components/FaceDetector.js'
import { scrollUp, scrollDown } from './scroll.js'

let debounce = false

export default function (
  {
    leftEyePosition,
    leftEyeOpenProbability,
    rightEyePosition,
    rightEyeOpenProbability,
    yawAngle
  },
  setFaceState,
  webviewRef
) {
  if (
    leftEyePosition.x < 0 ||
    rightEyePosition.x > previewSize.width ||
    leftEyePosition.y < 0 ||
    leftEyePosition.y > previewSize.height ||
    Math.abs(yawAngle) > 40
  ) {
    setFaceState('noFace')
    return
  }

  setFaceState('normal')

  if (
    rightEyeOpenProbability - leftEyeOpenProbability > 0.6 &&
    debounce === false
  ) {
    webviewRef.current.injectJavaScript(scrollUp)
    debounce = true
    setTimeout(() => {
      debounce = false
    }, 1000)
    Haptics.selectionAsync()
  } else if (
    leftEyeOpenProbability - rightEyeOpenProbability > 0.6 &&
    debounce === false
  ) {
    webviewRef.current.injectJavaScript(scrollDown)
    debounce = true
    setTimeout(() => {
      debounce = false
    }, 1000)
    Haptics.selectionAsync()
  }
}
