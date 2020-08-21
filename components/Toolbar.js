import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { Camera } from 'expo-camera'
import * as FaceDetector from 'expo-face-detector'

import Searchbar from './Searchbar.js'

import colors, { faceRecBtnColors } from '../config/colors.js'

export default function Toolbar({ webviewRef, ...props }) {
  // true|false: whether face detection is enabled
  const [faceTrackState, setFaceTrackState] = useState(true)
  // 'noPermission'|'noFace'|'normal': the state of face detection
  const [faceState, setFaceState] = useState('noFace')

  // check camera permission
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync()
      setFaceState(status === 'granted' ? 'noFace' : 'noPermission')
    })()
  }, [])

  const handleFacesDetected = ({ faces }) => {
    console.log(faces[0])
    if (faces[0] === undefined) {
      setFaceState('noFace')
    } else {
      setFaceState('normal')
    }
  }

  return (
    <View style={styles.container}>
      <Searchbar {...props} />
      <TouchableOpacity
        style={styles.btn}
        onPress={() => setFaceTrackState(!faceTrackState)} // toggle face detection
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
          minDetectionInterval: 100,
          tracking: true
        }}
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
