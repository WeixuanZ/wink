import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, BackHandler, View, Share, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import * as Haptics from 'expo-haptics'

import Toolbar from './components/Toolbar.js'
import Bookmarks from './components/Bookmarks.js'
import Frame from './components/Frame.js'
import Nav from './components/Nav.js'

import { useStoredState } from './lib/storage.js'
import { smoothScroll } from './lib/scroll.js'
import { formatQuery, getDisplayStr } from './lib/urlHelper.js'
import { bookmarkExists, addBookmark, removeBookmark } from './lib/bookmarks.js'

import colors from './config/colors.js'
import defaultBookmarks from './config/defaultBookmarks.js'

export default function App() {
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('https://www.google.com')
  const [currentSearchbar, setCurrentSearchbar] = useState('')
  const [seachbarFocused, setSeachbarFocused] = useState(true)
  const [bookmarked, setBookmarked] = useState(false)
  const [bookmarks, setBookmarks] = useStoredState(
    '@bookmarks',
    defaultBookmarks
  )

  const webviewRef = useRef(null)
  const searchbarRef = useRef(null)

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
      <View style={styles.container}>
        <StatusBar
          style="dark"
          translucent={false} // Android
          backgroundColor={colors.bg_white}
        />
        <Toolbar
          {...{
            currentSearchbar,
            seachbarFocused,
            searchbarRef,
            webviewRef
          }}
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
          {...{ currentUrl, webviewRef }}
          handleStateChange={(navState) => {
            setCanGoBack(navState.canGoBack)
            setCanGoForward(navState.canGoForward)
            setCurrentUrl(navState.url)
            // prevent text update when textinput is in focus
            if (!seachbarFocused) {
              setCurrentSearchbar(getDisplayStr(navState.url))
            }
          }}
          handleLoad={() => {
            webviewRef.current.injectJavaScript(smoothScroll)
            setBookmarked(bookmarkExists(currentUrl, bookmarks))
          }}
          handleRequest={(request) => {
            // prevent links from opening apps
            if (
              [
                'instagram',
                'twitter',
                'facebook',
                'youtube',
                'linkedin'
              ].reduce((acc, val) => request.url.includes(val) || acc, false) &&
              request.navigationType === 'click'
            ) {
              setCurrentUrl(request.url)
              return false
            }
            return true
          }}
        />
        {seachbarFocused && (
          <Bookmarks
            bookmarks={bookmarks}
            handleSpacePress={() => searchbarRef.current.blur()}
            handleBookmarkPress={(url) => {
              searchbarRef.current.blur()
              setCurrentUrl(url)
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              )
            }}
          />
        )}
        <Nav
          {...{ canGoBack, canGoForward, bookmarked }}
          handleGoBack={() => {
            if (webviewRef.current) webviewRef.current.goBack()
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          }}
          handleGoForward={() => {
            if (webviewRef.current) webviewRef.current.goForward()
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          }}
          handleShare={async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            try {
              await Share.share({
                message: `I'm using Wink to browse the web: ${currentUrl}`,
                url: currentUrl
              })
            } catch (error) {
              Alert.alert(error.message)
            }
          }}
          handleReload={() => {
            webviewRef.current.reload()
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          }}
          handleBookmark={() => {
            if (bookmarked) {
              setBookmarks(removeBookmark(currentUrl, bookmarks))
              setBookmarked(false)
            } else {
              setBookmarks(addBookmark(currentUrl, bookmarks))
              setBookmarked(true)
            }
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          }}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg_white
  }
})
