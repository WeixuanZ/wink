import React, { useState, useRef } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import Frame from './components/Frame.js'
import Nav from './components/Nav.js'
import Toolbar from './components/Toolbar.js'

export default function App() {
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('https://google.com')

  const webviewRef = useRef(null)

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Toolbar />
      <Frame
        currentUrl={currentUrl}
        webviewRef={webviewRef}
        handleStateChange={navState => {
          setCanGoBack(navState.canGoBack)
          setCanGoForward(navState.canGoForward)
          setCurrentUrl(navState.url)
        }}
      />
      <Nav
        handleGoBack={()=>{if (webviewRef.current) webviewRef.current.goBack()}}
        handleGoForward={() => {if (webviewRef.current) webviewRef.current.goForward()}}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
});
