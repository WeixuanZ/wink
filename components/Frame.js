import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview';

export default function Frame ({currentUrl, webviewRef, handleStateChange}) {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: currentUrl }}
        ref={webviewRef}
        onNavigationStateChange={handleStateChange}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator
            color='black'
            size='large'
            style={styles.container}
          />
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
