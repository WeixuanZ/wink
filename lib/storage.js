import { useState, useEffect, useReducer } from 'react'
import AsyncStorage from '@react-native-community/async-storage'

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

const updateFromStorage = (key, setter) =>
  useEffect(() => {
    (async () => {
      try {
        const storedValue = JSON.parse(await AsyncStorage.getItem(key))
        if (storedValue !== null) {
          setter(storedValue)
        }
      } catch (e) {
        console.error(e)
        removeItem(key)
      }
    })()
  }, [])

export const useStoredState = (key, initialState) => {
  const [value, setValue] = useState(initialState)
  updateFromStorage(key, setValue)

  const setItem = (val) => {
    setValue(val)
    try {
      AsyncStorage.setItem(key, JSON.stringify(val))
    } catch (e) {
      console.error(e)
    }
  }

  return [value, setItem]
}

export const useStoredReducer = (key, reducer, initialState) => {
  const [value, dispatch] = useReducer(reducer, initialState)
  updateFromStorage(key, (storedValue) => dispatch({ payload: storedValue }))

  const setItem = (action) => {
    dispatch(action)
    try {
      AsyncStorage.setItem(key, JSON.stringify(reducer(value, action))) // work because of closure
    } catch (e) {
      console.error(e)
    }
  }

  return [value, setItem]
}
