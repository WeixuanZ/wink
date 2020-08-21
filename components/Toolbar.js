import React, { useState, useEffect, useRef } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { Camera } from 'expo-camera'
import * as FaceDetector from 'expo-face-detector'
import * as Haptics from 'expo-haptics';

import Searchbar from './Searchbar.js'

import colors, { faceRecBtnColors } from '../config/colors.js'
import injectJS, { scrollUp, scrollDown } from '../lib/scroll.js'

export default function Toolbar({ webviewRef, ...props }) {
  // true|false: whether face detection is enabled
  const [faceTrackState, setFaceTrackState] = useState(true)
  // 'noPermission'|'noFace'|'normal': the state of face detection
  const [faceState, setFaceState] = useState('noFace')

  const cameraRef = useRef(null)

  // check camera permission
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync()
      setFaceState(status === 'granted' ? 'noFace' : 'noPermission')
    })()
  }, [])

  let debounce = false
  const handleFacesDetected = ({ faces }) => {
    if (!faceTrackState) { // face detection is off
      return
    }

    if (faces[0] === undefined) { // no face detected
      setFaceState('noFace')
      return
    }

    setFaceState('normal')
    const {leftEyeOpenProbability, rightEyeOpenProbability} = faces[0]
    // console.log(`L: ${leftEyeOpenProbability}, R: ${rightEyeOpenProbability}`)

    if (rightEyeOpenProbability - leftEyeOpenProbability > 0.6 && debounce === false) {
      injectJS(webviewRef, scrollUp)
      debounce = true
      setTimeout(() => { debounce = false }, 1000)
      Haptics.selectionAsync()
    } else if (leftEyeOpenProbability - rightEyeOpenProbability > 0.6 && debounce === false) {
      injectJS(webviewRef, scrollDown)
      debounce = true
      setTimeout(() => { debounce = false }, 1000)
      Haptics.selectionAsync()
    }
  }

  return (
    <View style={styles.container}>
      <Searchbar {...props} />
      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          setFaceTrackState(!faceTrackState)
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          faceTrackState ? cameraRef.current.pausePreview() : cameraRef.current.resumePreview()
        }} // toggle face detection
      >
        <MaterialCommunityIcons
          name="face-recognition"
          size={22}
          color={
            faceTrackState
              ? faceRecBtnColors[faceState] || faceRecBtnColors.noPermission
              : colors.black
          } // black if not enabled, otherwise color depends on face detection state
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn}>
        <Ionicons name="ios-menu" size={28} color="black" />
      </TouchableOpacity>
      <Camera
        type={Camera.Constants.Type.front}
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.Constants.Mode.fast,
          detectLandmarks: FaceDetector.Constants.Landmarks.none,
          runClassifications: FaceDetector.Constants.Classifications.all,
          minDetectionInterval: 200,
          tracking: true
        }}
        ref={cameraRef}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg_white,
    height: 60,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: colors.separator
  },
  btn: {
    padding: 10
  }
})
