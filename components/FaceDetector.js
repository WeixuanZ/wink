import React from 'react'
import { View } from 'react-native'
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
      type={Camera.Constants.Type.front}
      onMountError={() => setFaceState('noPermission')}
      onFacesDetected={handleFacesDetected}
      faceDetectorSettings={{
        mode: FaceDetector.Constants.Mode.fast,
        detectLandmarks: FaceDetector.Constants.Landmarks.none,
        runClassifications: FaceDetector.Constants.Classifications.all,
        minDetectionInterval: 200,
        tracking: true
      }}
    />
  )
}
