import Ionicons from '@expo/vector-icons/Ionicons'
import { Tabs } from 'expo-router'

import { useTheme } from '@/hooks/useTheme'

import { i18n } from '@/translations/i18n'

export const TabsLayout = () => {
  const { colorsTheme } = useTheme()

  const getName = (n: keyof typeof Ionicons.glyphMap, focused?: boolean): any => (focused ? `${n}` : `${n}-outline`)

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: i18n.t('map'),
          tabBarIcon: ({ focused }) => (
            <Ionicons name={getName('map', focused)} size={24} color={colorsTheme.color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarLabel: i18n.t('search'),
          tabBarIcon: ({ focused }) => (
            <Ionicons name={getName('search', focused)} size={24} color={colorsTheme.color} />
          ),
        }}
      />
      <Tabs.Screen
        name="timetable"
        options={{
          tabBarLabel: i18n.t('timetable'),
          tabBarIcon: ({ focused }) => (
            <Ionicons name={getName('time', focused)} size={24} color={colorsTheme.color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: i18n.t('settings'),
          tabBarIcon: ({ focused }) => (
            <Ionicons name={getName('settings', focused)} size={24} color={colorsTheme.color} />
          ),
        }}
      />
    </Tabs>
  )
}

export default TabsLayout
