import { colors } from '@/constants/colors'
import { useTheme } from '@/hooks/useTheme'
import { useLines } from '@/stores/lines'
import { StyleProp, StyleSheet, TextStyle } from 'react-native'
import { useShallow } from 'zustand/react/shallow'
import { UiActivityIndicator } from './UiActivityIndicator'
import { UiText } from './UiText'

interface Props {
  isLoading?: boolean
  code: string
}

export function UiLineCode(props: Props) {
  const lineTheme = useLines(useShallow(state => state.lineTheme[props.code]))
  const { getSchemeColorHex } = useTheme(lineTheme)

  const renderCodeContainer: StyleProp<TextStyle> = {
    backgroundColor: getSchemeColorHex('primary') || colors.primary,
    color: getSchemeColorHex('onPrimary') || 'white',
  }

  return (
    <UiText style={[styles.renderCode, renderCodeContainer]}>
      {props.isLoading ? <UiActivityIndicator /> : props.code}
    </UiText>
  )
}

const styles = StyleSheet.create({
  renderCode: {
    borderRadius: 999,
    padding: 9,
    minWidth: 70,
    textAlign: 'center',
  },
})
