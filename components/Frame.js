import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import ProgressWebView from 'react-native-progress-webview'

import colors from '../config/colors.js'
import { smoothScroll } from '../lib/scroll.js'

export default function Frame({
  currentUrl,
  setCurrentUrl,
  webviewRef,
  handleStateChange
}) {
  const handleRequest = (request) => {
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
  }

  return (
    <View style={styles.container}>
      <ProgressWebView
        source={{ uri: currentUrl }}
        ref={webviewRef}
        onNavigationStateChange={handleStateChange}
        onShouldStartLoadWithRequest={handleRequest}
        onLoad={() => webviewRef.current.injectJavaScript(smoothScroll)}
        allowsFullscreenVideo={true}
        allowsInlineMediaPlayback={true}
        allowsBackForwardNavigationGestures={true}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator
            color="black"
            size="large"
            style={styles.container}
          />
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg_white // makes sure the camera preview is hidden
  }
})
