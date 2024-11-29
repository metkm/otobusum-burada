import { BottomSheetFlashList, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { createNewGroup, useLines } from '@/stores/lines'
import { ListRenderItem } from '@shopify/flash-list'
import { LineGroupsItem } from './LineGroupsItem'

import { LineGroup } from '@/types/lineGroup'
import { UiButton } from '@/components/ui/UiButton'
import { useTheme } from '@/hooks/useTheme'
import { colors } from '@/constants/colors'

import { useShallow } from 'zustand/react/shallow'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'
import { forwardRef, useCallback, useMemo } from 'react'
import { i18n } from '@/translations/i18n'
import { UiSheetModal } from '@/components/ui/sheet/UiSheetModal'

interface LineGroupsProps extends ViewProps {
  onPressGroup?: (group: LineGroup) => void
}

export const LineGroups = forwardRef<BottomSheetModal, LineGroupsProps>(function LineGroups(
  { onPressGroup, ...props },
  ref,
) {
  const groups = useLines(useShallow(state => state.lineGroups))
  const { getSchemeColorHex } = useTheme()

  const buttonBackground: StyleProp<ViewStyle> = useMemo(
    () => ({
      backgroundColor: getSchemeColorHex('primary') || colors.primary,
      margin: 14,
    }),
    [getSchemeColorHex],
  )

  const handlePressNewGroup = useCallback(() => {
    createNewGroup()
  }, [])

  const renderItem: ListRenderItem<LineGroup> = useCallback(
    ({ item }) => (
      <LineGroupsItem group={item} onPress={() => onPressGroup?.(item)} />
    ),
    [onPressGroup],
  )

  return (
    <>
      {props.children}

      <UiSheetModal
        ref={ref}
        snapPoints={['50%']}
        enableDynamicSizing={false}
      >
        <BottomSheetView style={styles.container}>
          <View style={styles.listContainer}>
            <BottomSheetFlashList
              data={groups}
              renderItem={renderItem}
              estimatedItemSize={80}
              fadingEdgeLength={40}
            />
          </View>

          <UiButton
            title={i18n.t('createNewGroup')}
            icon="add"
            style={buttonBackground}
            onPress={handlePressNewGroup}
            textStyle={{ color: 'white' }}
          />
        </BottomSheetView>
      </UiSheetModal>
    </>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
})
