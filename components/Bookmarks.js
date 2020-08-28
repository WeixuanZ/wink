import React from 'react'
import {
  View,
  TouchableWithoutFeedback,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import BookmarkItem from './BookmarkItem.js'
import { removeItem } from '../lib/storage.js'

import colors from '../config/colors.js'

export default function Bookmarks({
  bookmarks,
  handleSpacePress,
  handleBookmarkPress
}) {
  const renderItem = ({ item }) => (
    <BookmarkItem handleBookmarkPress={handleBookmarkPress} {...item} />
  )

  return (
    <TouchableWithoutFeedback onPress={handleSpacePress}>
      <View style={styles.container}>
        <FlatList
          style={styles.box}
          data={bookmarks}
          renderItem={renderItem}
          keyExtractor={(item) => item.url}
          numColumns={2}
          pagingEnabled={true}
          pinchGestureEnabled={false}
          keyboardShouldPersistTaps="always"
        ></FlatList>
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={() => removeItem('@bookmarks')}
        >
          <Ionicons name="ios-nuclear" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 0,
    width: '100%',
    height: '50%'
  },
  box: {
    flexGrow: 0,
    backgroundColor: colors.bg_gray,
    borderRadius: 10,
    margin: 10,
    padding: 10
  },
  resetBtn: {
    marginRight: 20,
    marginLeft: 'auto',
    marginTop: 10,
    backgroundColor: colors.bg_gray,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
