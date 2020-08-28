import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-community/async-storage'

export const useStoredState = (key, initialState) => {
  const [value, setValue] = useState(initialState)

  const getItem = async (key) => {
    try {
      const storedValue = JSON.parse(await AsyncStorage.getItem(key))
      if (storedValue !== null) {
        setValue(storedValue)
      }
    } catch (e) {
      console.error(e)
    }
  }
  const setItem = (key, value) => {
    setValue(value)
    try {
      AsyncStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    getItem(key)
  }, [])

  return [value, (val) => setItem(key, val)]
}

export const removeItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key)
  } catch (e) {
    console.error(e)
  }
  console.log('Done.')
}

export const clearAll = async () => {
  try {
    await AsyncStorage.clear()
  } catch (e) {
    console.error(e)
  }
  console.log('Done.')
}
