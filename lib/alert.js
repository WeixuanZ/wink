import { Alert } from 'react-native'
import * as Haptics from 'expo-haptics'

export const alert = (header, body, onPress) => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
  Alert.alert(header, body, [
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel'
    },
    {
      text: 'OK',
      onPress: onPress
    }
  ])
}

export const lightHaptics = () =>
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
export const mediumHaptics = () =>
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
export const successHaptics = () =>
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
