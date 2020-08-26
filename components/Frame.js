import React from 'react'
import { View, StyleSheet } from 'react-native'
import ProgressWebView from 'react-native-progress-webview'

import colors from '../config/colors.js'
import { smoothScroll } from '../lib/scroll.js'

export default function Frame({
  currentUrl,
  webviewRef,
  handleStateChange,
  handleRequest
}) {
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
