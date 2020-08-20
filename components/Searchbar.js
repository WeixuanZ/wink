import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import colors from '../config/colors.js'

const submitURL = ({nativeEvent}) => {
  console.log(nativeEvent.text)
}

export default function SearchBar ({style}) {
  const [value, onChangeText] = useState('');
  const textInputRef = useRef(null);

  return (
    <View style={[styles.container, style]}>
      <Ionicons name="ios-search" size={26} color={colors.text_gray} style={styles.searchIcon} />
      <TextInput
        style={styles.textField}
        value={value}
        onChangeText={text => onChangeText(text)}
        onSubmitEditing={submitURL}
        placeholder="Search or enter URL"
        clearTextOnFocus={true}
        keyboardAppearance='light'
        keyboardType='web-search'
        textContentType='URL'
        autoFocus={true}
        enablesReturnKeyAutomatically={true}
        autoCapitalize='none'
        autoCompleteType='off'
        autoCorrect={false}
        ref={textInputRef}
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
