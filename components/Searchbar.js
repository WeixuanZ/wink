import React, { useEffect } from 'react'
import { View, TextInput, BackHandler, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

import colors from '../config/colors.js'
import { getDisplayStr } from '../lib/urlHelper.js'

export default function SearchBar({
  currentUrl,
  handleSubmit,
  currentSearchbar,
  setCurrentSearchbar,
  searchbarRef
}) {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (searchbarRef.current.isFocused()) {
          searchbarRef.current.blur()
          return true
        }
        return false
      }
    )
    return () => backHandler.remove()
  }, [])

  return (
    <View style={styles.container}>
      <Ionicons
        name="ios-search"
        size={22}
        color={colors.text_gray}
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.textField}
        value={currentSearchbar}
        onChangeText={setCurrentSearchbar}
        onSubmitEditing={handleSubmit}
        onFocus={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        onBlur={() => setCurrentSearchbar(getDisplayStr(currentUrl))}
        placeholder="Search or enter URL"
        keyboardAppearance="light"
        keyboardType="web-search"
        textContentType="URL"
        autoFocus={true}
        clearTextOnFocus={true} // iOS only
        selectTextOnFocus={true} // for Android
        enablesReturnKeyAutomatically={true}
        autoCapitalize="none"
        autoCompleteType="off"
        autoCorrect={false}
        ref={searchbarRef}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg_gray,
    height: 40,
    borderRadius: 10,
    marginHorizontal: 10
  },
  searchIcon: {
    marginHorizontal: 10
  },
  textField: {
    flex: 1,
    fontSize: 18,
    color: colors.text_gray
  }
})
