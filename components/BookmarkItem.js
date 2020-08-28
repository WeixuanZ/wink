import React from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'

import colors from '../config/colors.js'

export default function BookmarkItem({ title, url, handleBookmarkPress }) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => handleBookmarkPress(url)}
    >
      <Text style={styles.text} numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 50,
    backgroundColor: colors.bg_white,
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    paddingHorizontal: 20,
    justifyContent: 'center'
  },
  text: {
    fontWeight: 'bold'
  }
})
