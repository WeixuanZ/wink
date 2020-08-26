import React, { useState, useRef, useEffect } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Camera } from 'expo-camera'
import * as Haptics from 'expo-haptics'

import Searchbar from './Searchbar.js'
import FaceDetector from './FaceDetector.js'

import colors, { faceRecBtnColors } from '../config/colors.js'
import faceAction from '../lib/face.js'

export default function Toolbar({
  seachbarFocused,
  webviewRef,
  ...props
}) {
  // true|false: whether face detection is enabled
  const [faceTrackState, setFaceTrackState] = useState(false)
  // 'noPermission'|'noFace'|'normal': the state of face detection
  const [faceState, setFaceState] = useState('noFace')

  const searchbarRef = useRef(null)

  // check camera permission
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync()
      setFaceTrackState(status === 'granted')
      setFaceState(status === 'granted' ? 'noFace' : 'noPermission')
    })()
  }, [])

  return (
    <View style={styles.container}>
      <Searchbar searchbarRef={searchbarRef} {...props} />
      {seachbarFocused ? (
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            searchbarRef.current.blur()
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          }}
        >
          <MaterialCommunityIcons
            name="close-circle-outline"
            size={24}
            color="black"
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            setFaceTrackState(!faceTrackState) // toggle face detection
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          }}
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
      )}
      <FaceDetector
        faceTrackState={faceTrackState}
        handleMountError={() => setFaceState('noPermission')}
        handleFacesDetected={({ faces }) => {
          if (faces[0] === undefined) {
            // no face detected
            setFaceState('noFace')
            return
          }
          faceAction(faces[0], setFaceState, webviewRef, searchbarRef)
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
