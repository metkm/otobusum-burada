import { useShallow } from 'zustand/react/shallow'
import { LatLng } from 'react-native-maps'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { memo, useEffect, useMemo } from 'react'
import { router } from 'expo-router'

import { UiText } from '../ui/UiText'
import { MarkerLazyCallout } from './MarkerLazyCallout'

import { useLineBusStops } from '@/hooks/useLineBusStops'
import { useTheme } from '@/hooks/useTheme'
import { useLines } from '@/stores/lines'
import { BusLineStop } from '@/types/bus'
import { useRouteFilter } from '@/hooks/useRouteFilter'
import { useMap } from '@/hooks/useMap'

interface Props {
  code: string
}

interface LineBusStopMarkersItemProps {
  stop: BusLineStop
  code: string
}

export function LineBusStopMarkersItem({ stop, code }: LineBusStopMarkersItemProps) {
  const lineTheme = useLines(useShallow(state => state.lineTheme[code]))
  const { colorsTheme, getSchemeColorHex } = useTheme(lineTheme)

  const backgroundColor = getSchemeColorHex('primary')

  const handleOnCalloutPress = () => {
    router.navigate({
      pathname: '/(tabs)/(home)/stop/[stopId]',
      params: {
        stopId: stop.stop_code,
      },
    })
  }

  const busStopStyle: StyleProp<ViewStyle> = {
    borderColor: getSchemeColorHex('outlineVariant'),
  }

  const calloutContainerBackground: StyleProp<ViewStyle> = {
    backgroundColor: colorsTheme.surfaceContainerLow,
  }

  const coordinate = useMemo(() => ({
    latitude: stop.y_coord,
    longitude: stop.x_coord,
  }), [stop.x_coord, stop.y_coord])
  return (
    <MarkerLazyCallout
      coordinate={coordinate}
      tracksInfoWindowChanges={false}
      tracksViewChanges={false}
      calloutProps={{
        onPress: handleOnCalloutPress,
        children: (
          <View style={[styles.calloutContainer, calloutContainerBackground]}>
            <UiText style={{ textAlign: 'center' }}>
              {stop.stop_code}
              {' '}
              -
              {stop.stop_name}
            </UiText>
          </View>
        ),
      }}
    >
      <View style={[styles.busStop, busStopStyle, { backgroundColor }]} />
    </MarkerLazyCallout>
  )
}

export const LineBusStopMarkers = memo(function LineBusStopMarkers(props: Props) {
  const { getCurrentOrDefaultRouteCode, getRouteDirection } = useRouteFilter(props.code)

  const map = useMap()
  const { query } = useLineBusStops(props.code)

  useEffect(() => {
    if (!query.data || query.data.length < 1) {
      return
    }

    const locs: LatLng[] = query.data?.map(stop => ({
      latitude: stop.y_coord,
      longitude: stop.x_coord,
    }))

    map?.current?.fitToCoordinates(locs, {
      edgePadding: {
        top: 20,
        bottom: 200,
        left: 20,
        right: 20,
      },
    })
  }, [query.data, map])

  if (!query.data) {
    return null
  }

  const direction = getRouteDirection(getCurrentOrDefaultRouteCode())
  const busStops = direction ? query.data.filter(stop => stop.direction === direction) : query.data

  return (
    <>
      {busStops.map(stop => (
        <LineBusStopMarkersItem
          key={`${stop.x_coord}-${stop.y_coord}-${stop.direction}`}
          stop={stop}
          code={props.code}
        />
      ))}
    </>
  )
})

const styles = StyleSheet.create({
  calloutContainer: {
    width: 250,
    padding: 8,
    borderRadius: 8,
  },
  busStop: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderRadius: 1000,
  },
})
