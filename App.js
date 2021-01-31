import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, BackHandler, View, Share, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import * as Haptics from 'expo-haptics'

import Toolbar from './components/Toolbar.js'
import Bookmarks from './components/Bookmarks.js'
import Frame from './components/Frame.js'
import Nav from './components/Nav.js'

import { smoothScroll } from './lib/scroll.js'
import { useStoredState } from './lib/storage.js'
import { formatQuery, getBaseUrl, getDisplayStr } from './lib/url.js'
import { bookmarkExists, useBookmarks } from './lib/bookmark.js'

import colors from './config/colors.js'

export default function App() {
  // App
  const [isFirstLaunch, setIsFirstLaunch] = useStoredState(
    '@isFirstLaunch',
    'true'
  )
  const launched = () => {
    if (isFirstLaunch === 'true') {
      setIsFirstLaunch('false')
    }
  }
  // WebView
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('https://www.google.com')
  // Searchbar
  const [currentSearchbar, setCurrentSearchbar] = useState('')
  const [seachbarFocused, setSeachbarFocused] = useState(true)
  // Bookmarks
  const [bookmarked, setBookmarked] = useState(false)
  const [bookmarks, dispatchBookmarks] = useBookmarks()

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
            launched()
            setCurrentUrl(formatQuery(text))
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          }}
          handleFocus={() => {
            setSeachbarFocused(true)
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          }}
          handleBlur={() => {
            setSeachbarFocused(false)
            setCurrentSearchbar(
              isFirstLaunch === 'true' ? '' : getDisplayStr(currentUrl)
            ) // restore currentUrl if not submitted, but keep blank if displaying into page
          }}
        />
        <Frame
          {...{ currentUrl, webviewRef, isFirstLaunch }}
          handleStateChange={(navState) => {
            setCanGoBack(navState.canGoBack)
            setCanGoForward(navState.canGoForward)
            if (navState.url === 'about:blank') {
              setCurrentSearchbar('How to use')
              return  // do not chnage currentUrl to about:blank
            }
            setCurrentUrl(navState.url) // prevent text update when textinput is in focus
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
              launched()
              searchbarRef.current.blur()
              setCurrentUrl(url)
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              )
            }}
            handleDelete={(url) => {
              dispatchBookmarks({ type: 'REMOVE', payload: url })
              // update bookmark button state if current page is removed from bookmarks
              if (getBaseUrl(currentUrl) == url.slice(8)) {
                setBookmarked(false)
              }
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            }}
            handleReset={() => {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Warning
              )
              Alert.alert(
                'Reset Bookmarks',
                'Are you sure that you want to reset the bookmarks to default ones?',
                [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                  },
                  {
                    text: 'OK',
                    onPress: () => dispatchBookmarks({ type: 'RESET' })
                  }
                ]
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
                message: `I'm browsing the web using Wink: ${currentUrl}`,
                url: currentUrl
              })
            } catch (error) {
              Alert.alert(error.message)
            }
          }}
          handleReload={() => {
            if (isFirstLaunch) return
            webviewRef.current.reload()
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          }}
          handleBookmark={() => {
            if (bookmarked) {
              dispatchBookmarks({ type: 'REMOVE', payload: currentUrl })
              setBookmarked(false)
            } else {
              dispatchBookmarks({ type: 'ADD', payload: currentUrl })
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
