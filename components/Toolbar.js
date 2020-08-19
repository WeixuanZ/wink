import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Searchbar from './Searchbar.js'
import colors from '../config/colors.js'

export default function Toolbar () {
  return (
    <View style={styles.container}>
      <Searchbar />
      <TouchableOpacity style={styles.btn}>
        <MaterialCommunityIcons name="face-recognition" size={22} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn}>
        <Ionicons name="ios-menu" size={28} color="black" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg_white,
    height: 60,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: colors.separator
  },
  btn: {
    padding: 10
  }
})
