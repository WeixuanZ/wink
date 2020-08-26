import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, BackHandler, SafeAreaView } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import * as Haptics from 'expo-haptics'

import Toolbar from './components/Toolbar.js'
import Frame from './components/Frame.js'
import Nav from './components/Nav.js'

import { formatQuery, getDisplayStr } from './lib/urlHelper.js'
import colors from './config/colors.js'

export default function App() {
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('https://www.google.com')
  const [currentSearchbar, setCurrentSearchbar] = useState('')
  const [seachbarFocused, setSeachbarFocused] = useState(true)

  const webviewRef = useRef(null)

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (canGoBack && !seachbarFocused) {
          webviewRef.current.goBack()
          return true
        }
        return false
      }
    )
    return () => backHandler.remove()
  }, [canGoBack])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        style="dark"
        translucent={false} // Android
        backgroundColor={colors.bg_white}
      />
      <Toolbar
        currentSearchbar={currentSearchbar}
        seachbarFocused={seachbarFocused}
        webviewRef={webviewRef}
        handleChangeText={setCurrentSearchbar}
        handleSubmit={({ nativeEvent: { text } }) => {
          setCurrentUrl(formatQuery(text))
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        }}
        handleFocus={() => {
          setSeachbarFocused(true)
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }}
        handleBlur={() => {
          setSeachbarFocused(false)
          setCurrentSearchbar(getDisplayStr(currentUrl)) // restore if not submitted
        }}
      />
      <Frame
        currentUrl={currentUrl}
        webviewRef={webviewRef}
        handleStateChange={(navState) => {
          setCanGoBack(navState.canGoBack)
          setCanGoForward(navState.canGoForward)
          setCurrentUrl(navState.url)
          // prevent text update when textinput is in focus
          if (!seachbarFocused) {
            setCurrentSearchbar(getDisplayStr(navState.url))
          }
        }}
        handleRequest={(request) => {
          // prevent links from opening apps
          if (
            ['instagram', 'twitter', 'facebook', 'youtube', 'linkedin'].reduce(
              (acc, val) => request.url.includes(val) || acc,
              false
            ) &&
            request.navigationType === 'click'
          ) {
            setCurrentUrl(request.url)
            return false
          }
          return true
        }}
      />
      <Nav
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        handleGoBack={() => {
          if (webviewRef.current) webviewRef.current.goBack()
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }}
        handleGoForward={() => {
          if (webviewRef.current) webviewRef.current.goForward()
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg_white
  }
})
