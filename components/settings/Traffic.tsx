import { Switch } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { SettingContainer } from './Container'

import { colors } from '@/constants/colors'
import { useSettings } from '@/stores/settings'
import { i18n } from '@/translations/i18n'

export function SettingsTraffic() {
  const showTraffic = useSettings(useShallow(state => state.showTraffic))

  const handleTrafficInformation = () => {
    useSettings.setState(state => ({
      showTraffic: !state.showTraffic,
    }))
  }

  return (
    <SettingContainer title={i18n.t('showTraffic')}>
      <Switch
        onValueChange={handleTrafficInformation}
        value={showTraffic}
        thumbColor={colors.primary}
        trackColor={{ true: colors.primaryDarker }}
      />
    </SettingContainer>
  )
}