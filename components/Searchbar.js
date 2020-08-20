import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import colors from '../config/colors.js'
import { getDisplayStr } from '../lib/urlHelper.js'

export default function SearchBar ({style, currentUrl, handleSubmit}) {
  const [value, setValue] = useState('');

  return (
    <View style={[styles.container, style]}>
      <Ionicons name='ios-search' size={22} color={colors.text_gray} style={styles.searchIcon} />
      <TextInput
        style={styles.textField}
        value={value}
        onChangeText={(text) => setValue(text)}
        onSubmitEditing={handleSubmit}
        onBlur={() => setValue(getDisplayStr(currentUrl))}
        placeholder='Search or enter URL'
        clearTextOnFocus={true}
        keyboardAppearance='light'
        keyboardType='web-search'
        textContentType='URL'
        autoFocus={true}
        enablesReturnKeyAutomatically={true}
        autoCapitalize='none'
        autoCompleteType='off'
        autoCorrect={false}
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
    width: '100%',
    fontSize: 18,
    color: colors.text_gray
  }
})
