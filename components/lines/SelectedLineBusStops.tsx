import { useLineBusStops } from '@/hooks/useLineBusStops'
import { BusStopLocation } from '@/api/getLineBusStopLocations'
import { useTheme } from '@/hooks/useTheme'
import { useLines } from '@/stores/lines'
import { Ionicons } from '@expo/vector-icons'
import { getRouteDirection } from '@/utils/getRouteDirection'

import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { useShallow } from 'zustand/react/shallow'
import { useEffect, useMemo, useRef } from 'react'
import { UiText } from '../ui/UiText'
import { UiActivityIndicator } from '../ui/UiActivityIndicator'
import Animated, {
  interpolate,
  runOnJS,
  runOnUI,
  ScrollHandlerProcessed,
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import { FlashList, FlashListProps, ListRenderItem, ViewToken } from '@shopify/flash-list'

interface Props {
  code: string
  routeCode?: string
}

const AnimatedFlashList = Animated.createAnimatedComponent<FlashListProps<BusStopLocation>>(FlashList)

const ITEM_SIZE = 46
const COLLAPSED = (ITEM_SIZE * 3) - (ITEM_SIZE / 2) * 2
const EXPANDED = COLLAPSED * 2

export function SelectedLineBusStops(props: Props) {
  const flashlistRef = useAnimatedRef<FlashList<BusStopLocation>>()
  const containerHeight = useSharedValue(100)
  const scrollY = useSharedValue(0)
  const scrollYStart = useSharedValue(0)
  const scrollSnapped = useSharedValue(false)
  const isScrollAtEnd = useSharedValue(false)

  const isScrollingWithMomentum = useSharedValue(false)
  const isScrolling = useSharedValue(false)

  const viewableItems = useRef<ViewToken[]>([])
  const currentTrackedItem = useRef<BusStopLocation>()

  const line = useLines(useShallow(state => state.lines[props.code]))
  const lineTheme = useLines(useShallow(state => state.lineTheme[props.code]))
  const { query } = useLineBusStops(props.code)
  const { getSchemeColorHex } = useTheme(lineTheme)

  const busses = line?.filter(bus => bus.guzergahkodu === props.routeCode)
  const direction = props.routeCode ? getRouteDirection(props.routeCode) : 'G'
  const filtered = query.data?.filter(stop => stop.yon === direction)

  useEffect(() => {
    const newIndex = filtered?.findIndex(stop => stop.durakKodu === currentTrackedItem.current?.durakKodu)
    if (!newIndex || newIndex === -1) return

    setTimeout(() => {
      runOnUI(scrollTo)(flashlistRef, 0, newIndex * ITEM_SIZE - (ITEM_SIZE / 2), true)
    }, 500)
  }, [filtered, flashlistRef, line])

  const textStyle: StyleProp<TextStyle> = useMemo(
    () => ({
      color: getSchemeColorHex('onPrimary'),
    }),
    [getSchemeColorHex],
  )

  const circleStyle: StyleProp<ViewStyle> = useMemo(
    () => ({
      borderColor: getSchemeColorHex('primaryContainer'),
      borderWidth: 2,
    }),
    [getSchemeColorHex],
  )

  const renderItem: ListRenderItem<BusStopLocation> = ({ item }) => {
    const closestBusses = busses?.find(bus => bus.yakinDurakKodu === item.durakKodu)

    const fillStyle: ViewStyle | undefined = closestBusses
      ? {
          backgroundColor: getSchemeColorHex('primaryContainer'),
        }
      : undefined

    return (
      <View style={styles.item}>
        <View style={[styles.itemCircle, circleStyle, fillStyle]}>
          {closestBusses && (
            <Ionicons
              name="bus-outline"
              color={getSchemeColorHex('onPrimaryContainer')}
              size={20}
            />
          )}
        </View>

        <UiText style={textStyle} numberOfLines={1}>
          {item.durakAdi}
        </UiText>
      </View>
    )
  }

  const animatedContainerStyle = useAnimatedStyle(() => ({
    height: containerHeight.value,
  }))

  const checkIfThereIsAStopWithBus = () => {
    const stopWithBus = viewableItems.current.find(stop =>
      busses?.find(bus => bus.yakinDurakKodu === stop.item.durakKodu),
    )

    if (!stopWithBus) return
    currentTrackedItem.current = stopWithBus.item

    const indx = (stopWithBus.index || 0) - 1
    return (indx * ITEM_SIZE) + (ITEM_SIZE / 2)
  }

  const handleViewableItemsChanged = (info: {
    viewableItems: ViewToken[]
    changed: ViewToken[]
  }) => {
    viewableItems.current = info.viewableItems
  }

  const handleOnScroll: ScrollHandlerProcessed<Record<string, unknown>> = useAnimatedScrollHandler(
    ({ contentOffset, contentSize, layoutMeasurement }) => {
      scrollY.value = contentOffset.y

      const scrollEnd = layoutMeasurement.height + contentOffset.y
      isScrollAtEnd.value = (scrollEnd <= contentSize.height) ? false : true
    },
  )

  const scrollToSnap = () => {
    const targetPosition = checkIfThereIsAStopWithBus()

    if (targetPosition) {
      scrollSnapped.value = true
      runOnUI(scrollTo)(flashlistRef, 0, targetPosition, true)

      containerHeight.value = withTiming(COLLAPSED)
    }
    else {
      scrollSnapped.value = false
      containerHeight.value = withDelay(1000, withTiming(COLLAPSED))
    }
  }

  const isScrollContinue = useDerivedValue(() => isScrolling.value || isScrollingWithMomentum.value)

  useAnimatedReaction(
    () => containerHeight.value,
    () => {
      if (scrollSnapped.value && !isScrollAtEnd.value) return

      const targetEnd = isScrollAtEnd.value
        ? (EXPANDED - COLLAPSED)
        : (EXPANDED - COLLAPSED) / 2

      const offset = interpolate(
        containerHeight.value,
        [EXPANDED, COLLAPSED],
        [0, targetEnd],
      )

      scrollTo(flashlistRef, 0, scrollYStart.value + offset, true)
    },
  )

  useAnimatedReaction(
    () => isScrollContinue.value,
    (val) => {
      if (val) {
        containerHeight.value = withTiming(EXPANDED)
      }
      else {
        scrollYStart.value = scrollY.value
        runOnJS(scrollToSnap)()
      }
    },
  )

  const handleScrollDragEnd = () => {
    isScrolling.value = false
  }

  const handleScrollDragStart = () => {
    isScrolling.value = true
    isScrollingWithMomentum.value = true
  }

  const handleScrollMomentumEnd = () => {
    isScrollingWithMomentum.value = false
  }

  const handleScrollMomentumStart = () => {
    isScrollingWithMomentum.value = true
  }

  if (query.isPending) {
    return <UiActivityIndicator />
  }

  if (!filtered) {
    return null
  }

  return (
    <Animated.View style={animatedContainerStyle}>
      <AnimatedFlashList
        ref={flashlistRef}
        data={filtered}
        renderItem={renderItem}
        estimatedItemSize={ITEM_SIZE}
        fadingEdgeLength={40}
        onScrollBeginDrag={handleScrollDragStart}
        onScrollEndDrag={handleScrollDragEnd}
        onMomentumScrollBegin={handleScrollMomentumStart}
        onMomentumScrollEnd={handleScrollMomentumEnd}
        onViewableItemsChanged={handleViewableItemsChanged}
        onScroll={handleOnScroll}
        viewabilityConfig={{
          minimumViewTime: 200,
          waitForInteraction: true,
          itemVisiblePercentThreshold: 100,
        }}
        snapToInterval={ITEM_SIZE}
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
  },
  itemCircle: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
