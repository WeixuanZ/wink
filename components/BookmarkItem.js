import React from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Entypo } from '@expo/vector-icons'

import colors from '../config/colors.js'

export default function BookmarkItem({
  title,
  url,
  editing,
  handleBookmarkPress,
  handleBookmarkLongPress,
  handleDelete
}) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        if (editing) return // prevent bookmark triggering when editing
        handleBookmarkPress(url)
      }}
      onLongPress={handleBookmarkLongPress}
    >
      <Text
        // eslint-disable-next-line react-native/no-inline-styles
        style={[styles.text, { opacity: editing ? 0.6 : 1 }]}
        numberOfLines={1}
      >
        {title}
      </Text>
      {editing && (
        <TouchableOpacity
          style={styles.cross}
          onPress={() => handleDelete(url)}
        >
          <Entypo name="cross" size={24} color="black" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: colors.bg_white,
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    paddingHorizontal: 20
  },
  text: {
    fontWeight: 'bold'
  },
  cross: {
    marginLeft: 'auto'
  }
})
