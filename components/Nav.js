import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import colors from '../config/colors.js'

export default function Nav ({handleGoBack, handleGoForward, canGoBack, canGoForward}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.btn, {opacity: (canGoBack) ? 1 : 0.2}]}
        onPress={handleGoBack}
        disabled={!canGoBack}
      >
        <Ionicons name="ios-arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, {opacity: (canGoForward) ? 1 : 0.2}]}
        onPress={handleGoForward}
        disabled={!canGoForward}
      >
        <Ionicons name="ios-arrow-forward" size={24} color="black" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'flex-end',
    alignItems: 'center',
    height: 50,
    width: '100%',
    backgroundColor: colors.bg_white,
    borderTopWidth: 1,
    borderColor: colors.separator
  },
  btn: {
    paddingHorizontal: '20%',
    paddingVertical: 10
  }
})
