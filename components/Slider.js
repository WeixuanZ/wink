import React, { useEffect, useRef } from 'react'
import { View, Text, Animated, StyleSheet } from 'react-native'
import Slider from '@react-native-community/slider'
import { BlurView } from 'expo-blur'

import { lightHaptics } from '../lib/alert.js'
import colors from '../config/colors.js'

export default function CustomSlider({ value, handleMount, handleSetValue }) {
  const timeoutRef = useRef(null)
  const yAnim = useRef(new Animated.Value(-60)).current

  const unmountTimeout = (timeout, duration = 200) =>
    setTimeout(() => {
      Animated.timing(yAnim, {
        toValue: -60,
        duration: duration,
        useNativeDriver: true
      }).start()
      setTimeout(() => handleMount(false), duration)
    }, timeout)

  useEffect(() => {
    timeoutRef.current = unmountTimeout(3000)
    Animated.timing(yAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true
    }).start()
  }, [])

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: yAnim }] }]}
    >
      <BlurView tint="light" intensity={100} style={styles.box}>
        <Slider
          style={styles.slider}
          value={value}
          onSlidingStart={() => clearTimeout(timeoutRef.current)}
          onSlidingComplete={(value) => {
            handleSetValue(value)
            timeoutRef.current = unmountTimeout(2000)
          }}
          onValueChange={lightHaptics}
          minimumValue={0}
          maximumValue={2}
          step={1}
        />
        <View style={styles.scale}>
          {['Low', 'Medium', 'High'].map((el, index) => (
            <Text
              style={[
                styles.scaleText,
                // eslint-disable-next-line react-native/no-inline-styles
                { fontWeight: value === index ? 'bold' : 'normal' }
              ]}
              key={index}
            >
              {el}
            </Text>
          ))}
        </View>
      </BlurView>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 0,
    width: '100%',
    zIndex: 1
  },
  box: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    margin: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  slider: {
    width: '90%',
    margin: 10
  },
  scale: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  scaleText: {
    color: colors.text_gray
  }
})
