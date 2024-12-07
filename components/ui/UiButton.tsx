import { Ionicons } from '@expo/vector-icons'
import { IconProps } from '@expo/vector-icons/build/createIconSet'
import { Theme } from '@material/material-color-utilities'
import { useMemo } from 'react'
import { StyleProp, StyleSheet, TextStyle, TouchableOpacity, ViewStyle } from 'react-native'
import Animated from 'react-native-reanimated'

import { useTheme } from '@/hooks/useTheme'

import { UiActivityIndicator } from './UiActivityIndicator'
import { UiText } from './UiText'

import { IconSize, iconSizes } from '@/constants/uiSizes'

interface UiButtonPropsBase {
  theme?: Theme
  isLoading?: boolean
  square?: boolean
  onPress?: () => void
  iconSize?: IconSize
  disabled?: boolean
  containerStyle?: StyleProp<ViewStyle>
  iconColor?: string
  textStyle?: StyleProp<TextStyle>
  animatedIconProps?: Partial<IconProps<keyof typeof Ionicons.glyphMap>>
}

interface UiButtonPropsWithIcon extends UiButtonPropsBase {
  icon: keyof typeof Ionicons.glyphMap
  title?: string
}

interface UiButtonPropsWithTitle extends UiButtonPropsBase {
  icon?: keyof typeof Ionicons.glyphMap
  title: string
}

type UiButtonProps = UiButtonPropsWithTitle | UiButtonPropsWithIcon

const AnimatedIonIcons = Animated.createAnimatedComponent(Ionicons)

export const UiButton = ({ iconSize = 'md', ...props }: UiButtonProps) => {
  const { getSchemeColorHex, colorsTheme } = useTheme(props.theme)

  const dynamicContainer: StyleProp<ViewStyle> = {
    backgroundColor: getSchemeColorHex('secondaryContainer'),
    opacity: props.disabled ? 0.4 : 1,
  }

  const dynamicText: StyleProp<TextStyle> = {
    color: getSchemeColorHex('onSecondaryContainer') || colorsTheme.color,
  }

  const iconColor = dynamicText.color ?? props.iconColor

  const Icon = useMemo(() => {
    if (props.isLoading) {
      return (
        <UiActivityIndicator
          size="small"
          color={iconColor}
        />
      )
    }

    if (!props.icon) return null

    if (props.animatedIconProps) {
      return (
        <AnimatedIonIcons
          name={props.icon}
          size={iconSizes[iconSize]}
          animatedProps={props.animatedIconProps}
        />
      )
    }

    return (
      <Ionicons
        name={props.icon}
        size={iconSizes[iconSize]}
        color={iconColor}
      />
    )
  }, [iconColor, iconSize, props.animatedIconProps, props.icon, props.isLoading])

  return (
    <TouchableOpacity
      style={[styles.container, dynamicContainer, props.containerStyle, props.square ? styles.square : undefined]}
      onPress={props.onPress}
    >
      {Icon}

      {props.title && (
        <UiText
          style={[styles.title, dynamicText, props.textStyle]}
          numberOfLines={1}
        >
          {props.title}
        </UiText>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    minWidth: 48,
    flexShrink: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  title: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  square: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
})
