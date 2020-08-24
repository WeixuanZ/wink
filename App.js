import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, BackHandler, SafeAreaView } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import * as Haptics from 'expo-haptics'

import Frame from './components/Frame.js'
import Nav from './components/Nav.js'
import Toolbar from './components/Toolbar.js'

import { formatQuery, getDisplayStr } from './lib/urlHelper.js'

import colors from './config/colors.js'

export default function App() {
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('https://www.google.com')
  const [currentSearchbar, setCurrentSearchbar] = useState('')

  const webviewRef = useRef(null)
  const searchbarRef = useRef(null)

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (canGoBack && !searchbarRef.current.isFocused()) {
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
        currentUrl={currentUrl}
        handleSubmit={({ nativeEvent: { text } }) => {
          setCurrentUrl(formatQuery(text))
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        }}
        currentSearchbar={currentSearchbar}
        setCurrentSearchbar={setCurrentSearchbar}
        searchbarRef={searchbarRef}
        webviewRef={webviewRef}
      />
      <Frame
        currentUrl={currentUrl}
        setCurrentUrl={setCurrentUrl}
        webviewRef={webviewRef}
        handleStateChange={(navState) => {
          setCanGoBack(navState.canGoBack)
          setCanGoForward(navState.canGoForward)
          setCurrentUrl(navState.url)
          // prevent text update when textinput is in focus
          if (!searchbarRef.current.isFocused()) {
            setCurrentSearchbar(getDisplayStr(navState.url))
          }
        }}
      />
      <Nav
        handleGoBack={() => {
          if (webviewRef.current) webviewRef.current.goBack()
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }}
        handleGoForward={() => {
          if (webviewRef.current) webviewRef.current.goForward()
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
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
