import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, Keyboard, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Camera } from 'expo-camera'
import * as Haptics from 'expo-haptics'

import Searchbar from './Searchbar.js'
import FaceDetector from './FaceDetector.js'
import Slider from './Slider.js'

import { useStoredState } from '../lib/storage.js'
import faceAction from '../lib/face.js'
import colors, { faceRecBtnColors } from '../config/colors.js'

export default function Toolbar({
  seachbarFocused,
  searchbarRef,
  webviewRef,
  ...props
}) {
  // true|false: whether face detection is enabled
  const [faceTrackState, setFaceTrackState] = useStoredState(
    '@facetrack_state',
    true
  )
  // true|false: whether have camera permission
  const [permissionGranted, setPermissionGranted] = useState(false)
  // 'noPermission'|'noFace'|'normal': the state of face detection
  const [faceState, setFaceState] = useState('noFace')
  const [keyboardVisible, setKeyboardVisible] = useState(false)
  const [sliderMounted, setSliderMounted] = useState(false)
  // 0|1|2: sensitivity level
  const [sensitivityLevel, setSensitivityLevel] = useStoredState(
    '@facetrack_sensitivity',
    1
  )

  useEffect(() => {
    (async () => {
      // check camera permission
      const { status } = await Camera.requestPermissionsAsync()
      setPermissionGranted(status === 'granted')
      setFaceState(status === 'granted' ? 'noFace' : 'noPermission')
      searchbarRef.current.focus() // prevent focusing searchbar from affecting permission requests
    })()
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    )
    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  return (
    <>
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
            onLongPress={() => {
              setSliderMounted(true)
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
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
      </View>

      <FaceDetector
        {...{ faceTrackState, permissionGranted }}
        handleMountError={() => setFaceState('noPermission')}
        handleFacesDetected={({ faces }) => {
          if (faces[0] === undefined) {
            // no face detected
            setFaceState('noFace')
            return
          }
          if (seachbarFocused || keyboardVisible) {
            // disable when the searchbar is focused or keyboard is visible
            return
          }
          faceAction(
            faces[0],
            setFaceState,
            sensitivityLevel,
            webviewRef,
            searchbarRef
          )
        }}
      />

      {sliderMounted && !seachbarFocused && (
        <Slider
          value={sensitivityLevel}
          handleMount={setSliderMounted}
          handleSetValue={(value) => setSensitivityLevel(value)}
        />
      )}
    </>
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
    borderColor: colors.separator,
    zIndex: 2
  },
  btn: {
    padding: 10
  }
})
