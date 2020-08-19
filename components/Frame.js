import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview';

export default function Frame () {
  const [currentURI, updateURI] = useState('https://google.co.uk')

  return (
    <View style={styles.container}>
      <WebView source={{ uri: currentURI }} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})
