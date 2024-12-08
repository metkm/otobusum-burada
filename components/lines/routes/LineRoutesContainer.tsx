import { Ionicons } from '@expo/vector-icons'
import { Pressable, StyleProp, StyleSheet, TextStyle, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { UiActivityIndicator } from '@/components/ui/UiActivityIndicator'
import { UiButton } from '@/components/ui/UiButton'
import { UiText } from '@/components/ui/UiText'

import { useRoutes } from '@/hooks/queries/useRoutes'
import { useTheme } from '@/hooks/useTheme'

import { LineRoutes } from './LineRoutes'

import { changeRouteDirection } from '@/stores/filters'
import { useLinesStore } from '@/stores/lines'

interface Props {
  lineCode: string
}

export const LineRoutesContainer = (props: Props) => {
  const { query, getRouteFromCode } = useRoutes(props.lineCode)

  const lineTheme = useLinesStore(useShallow(state => state.lineTheme[props.lineCode]))
  const { getSchemeColorHex } = useTheme(lineTheme)

  if (query.isPending) {
    return <UiActivityIndicator size="small" />
  }

  const route = getRouteFromCode()
  const [leftTitle, rightTitle] = route?.route_long_name?.trim().split('-') ?? ['', ''] ?? ['', '']

  const textStyle: StyleProp<TextStyle> = {
    color: getSchemeColorHex('onPrimary'),
  }

  const handleSwitchRoute = () => {
    changeRouteDirection(props.lineCode)
  }

  return (
    <View style={styles.routeContainer}>
      <View style={styles.lineButtonsContainer}>
        <UiButton onPress={handleSwitchRoute} icon="repeat" theme={lineTheme} />

        <LineRoutes code={props.lineCode} />
      </View>

      <Pressable onPress={handleSwitchRoute} style={styles.lineButtonsContainer}>
        <UiText size="sm" style={[styles.directionText, textStyle]} numberOfLines={1}>
          {leftTitle}
        </UiText>
        <Ionicons name="arrow-forward" size={18} color={textStyle.color} />
        <UiText size="sm" style={[styles.directionText, textStyle]} numberOfLines={1}>
          {rightTitle}
        </UiText>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  routeContainer: {
    gap: 8,
    flexShrink: 0,
  },
  lineButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexGrow: 1,
  },
  directionText: {
    flexBasis: 0,
    flexGrow: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  grow: {
    flexGrow: 1,
  },
})
