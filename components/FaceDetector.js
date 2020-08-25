import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Camera } from 'expo-camera'
import * as FaceDetector from 'expo-face-detector'

export default function Face({
  faceTrackState,
  setFaceState,
  handleFacesDetected
}) {
  if (!faceTrackState) {
    return <View />
  }

  return (
    <Camera
      style={styles.preview}
      type={Camera.Constants.Type.front}
      onMountError={() => setFaceState('noPermission')}
      onFacesDetected={handleFacesDetected}
      faceDetectorSettings={{
        mode: FaceDetector.Constants.Mode.fast,
        detectLandmarks: FaceDetector.Constants.Landmarks.all,
        runClassifications: FaceDetector.Constants.Classifications.all,
        minDetectionInterval: 200,
        tracking: true
      }}
    />
  )
}

export const previewSize = {
  width: 300,
  height: 400
}

const styles = StyleSheet.create({
  preview: {
    // camera preview must have a size for face landmark positions to be returned
    width: previewSize.width,
    height: previewSize.height,
    // hide the camera preview
    position: 'absolute',
    top: 70
  }
})
