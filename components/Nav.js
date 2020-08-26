import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome } from '@expo/vector-icons'

import colors from '../config/colors.js'

export default function Nav({
  canGoBack,
  canGoForward,
  handleGoBack,
  handleGoForward,
  handleShare,
  handleReload
}) {
  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <TouchableOpacity
          // eslint-disable-next-line react-native/no-inline-styles
          style={[styles.btn, { opacity: canGoBack ? 1 : 0.2 }]}
          onPress={handleGoBack}
          disabled={!canGoBack}
        >
          <Ionicons name="ios-arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          // eslint-disable-next-line react-native/no-inline-styles
          style={[styles.btn, { opacity: canGoForward ? 1 : 0.2 }]}
          onPress={handleGoForward}
          disabled={!canGoForward}
        >
          <Ionicons name="ios-arrow-forward" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.btns}>
        <TouchableOpacity
          style={styles.btn}
          onPress={handleShare}
        >
          <Feather name="share" size={24} color="black" />
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.btn}
        >
          <FontAwesome name="bookmark" size={24} color="black" />
          <FontAwesome name="bookmark-o" size={24} color="black" />
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.btn}
          onPress={handleReload}
        >
          <MaterialCommunityIcons name="reload" size={24} color="black" />
        </TouchableOpacity>
      </View>
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
  nav: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  btns: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  btn: {
    paddingHorizontal: 20,
    paddingVertical: 10
  }
})
