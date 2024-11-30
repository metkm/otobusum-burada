import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react'
import { FlatList, ListRenderItem, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View, ViewProps } from 'react-native'
import Animated, { FlatListPropsWithLayout } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { LineGroupsSelect } from './groups/LineGroupsSelect'
import { SelectedLine } from './SelectedLine'

import { SelectedLineWidth } from '@/constants/width'
import { useFilters } from '@/stores/filters'
import { findGroupFromId, useLines } from '@/stores/lines'
import { useMisc } from '@/stores/misc'

interface SelectedLinesProps {
  viewProps?: ViewProps
  listProps?: Omit<FlatListPropsWithLayout<string>, 'data' | 'renderItem'>
}

// TODO: Some rerender issues are here.
export const SelectedLines = forwardRef<FlatList, SelectedLinesProps>(function SelectedLines(
  props,
  outerRef,
) {
  const innerRef = useRef<FlatList>(null)
  useImperativeHandle(outerRef, () => innerRef.current!, [])

  const defaultLines = useLines(state => state.lines)
  const selectedGroup = useFilters(useShallow(state => state.selectedGroup ? findGroupFromId(state.selectedGroup.id) : undefined))
  const lineGroups = useLines(state => state.lineGroups)

  const items = useMemo(
    () => selectedGroup ? selectedGroup.lineCodes : defaultLines,
    [defaultLines, selectedGroup],
  )

  const groupCount = Object.keys(lineGroups).length

  const renderItem: ListRenderItem<string> = useCallback(
    ({ item: code }) => {
      return <SelectedLine code={code} />
    },
    [],
  )

  const handleMomentumScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.ceil(event.nativeEvent.contentOffset.x / SelectedLineWidth)
    useMisc.setState(() => ({ selectedLineScrollIndex: index }))
  }, [])

  const keyExtractor = useCallback((item: string) => item, [])

  return (
    <View style={[props.viewProps?.style]}>
      {groupCount > 0 && <LineGroupsSelect />}

      <Animated.FlatList
        {...props.listProps}
        ref={innerRef}
        data={items}
        renderItem={renderItem}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        contentContainerStyle={styles.codes}
        keyExtractor={keyExtractor}
        snapToAlignment="center"
        pagingEnabled
        horizontal
      />
    </View>
  )
})

const styles = StyleSheet.create({
  codes: {
    padding: 8,
    gap: 8,
    alignItems: 'flex-end',
  },
})
