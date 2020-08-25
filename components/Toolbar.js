import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { Camera } from 'expo-camera'
import * as Haptics from 'expo-haptics'

import Searchbar from './Searchbar.js'
import FaceDetector from './FaceDetector.js'

import colors, { faceRecBtnColors } from '../config/colors.js'
import faceAction from '../lib/face.js'

export default function Toolbar({ webviewRef, ...props }) {
  // true|false: whether face detection is enabled
  const [faceTrackState, setFaceTrackState] = useState(false)
  // 'noPermission'|'noFace'|'normal': the state of face detection
  const [faceState, setFaceState] = useState('noFace')

  // check camera permission
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync()
      setFaceTrackState(status === 'granted')
      setFaceState(status === 'granted' ? 'noFace' : 'noPermission')
    })()
  }, [])

  const handleFacesDetected = ({ faces }) => {
    if (faces[0] === undefined) { // no face detected
      setFaceState('noFace')
      return
    }

    faceAction(faces[0], setFaceState, webviewRef)
  }

  return (
    <View style={styles.container}>
      <Searchbar {...props} />
      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          setFaceTrackState(!faceTrackState)
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
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
      {/* <TouchableOpacity style={styles.btn}>
        <Ionicons name="ios-menu" size={28} color="black" />
      </TouchableOpacity> */}
      <FaceDetector
        setFaceState={setFaceState}
        handleFacesDetected={handleFacesDetected}
        faceTrackState={faceTrackState}
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
