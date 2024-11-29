import { getStop } from '@/api/getStop'
import { UiActivityIndicator } from '@/components/ui/UiActivityIndicator'
import { LineBusStopMarkersItem } from '@/components/markers/LineBusStopMarkers'
import { TheMap } from '@/components/TheMap'
import { UiText } from '@/components/ui/UiText'
import { useTheme } from '@/hooks/useTheme'
import { useQuery } from '@tanstack/react-query'

import MapView from 'react-native-maps'
import { useLocalSearchParams } from 'expo-router'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { useEffect, useRef } from 'react'

export default function StopDetails() {
  const { stopId } = useLocalSearchParams<{ stopId: string }>()
  const { colorsTheme } = useTheme()
  const map = useRef<MapView>(null)

  const query = useQuery({
    queryKey: ['stop', stopId],
    queryFn: () => getStop(stopId),
    staleTime: 60_000 * 30,
  })

  useEffect(() => {
    if (!query.data) return

    map.current?.animateCamera({
      center: {
        latitude: query.data.stop.y_coord,
        longitude: query.data.stop.x_coord,
      },
      zoom: 16,
    })
  }, [query.data])

  const lineCodeStyle: StyleProp<ViewStyle> = {
    backgroundColor: colorsTheme.surfaceContainer,
  }

  return (
    <View style={styles.container}>
      <TheMap ref={map}>
        {query.data?.stop && (
          <LineBusStopMarkersItem stop={query.data?.stop} />
        )}
      </TheMap>

      <View style={styles.content}>
        {query.isPending
          ? (
              <UiActivityIndicator />
            )
          : (
              <>
                <View style={styles.titleContainer}>
                  <UiText>{query.data?.stop.stop_code}</UiText>
                  <UiText size="lg" style={styles.title}>{query.data?.stop.stop_name}</UiText>
                  <UiText>{query.data?.stop.province}</UiText>
                </View>

                <View style={styles.linesContainer}>
                  <UiText info>Lines that use this stop</UiText>

                  <View style={styles.codeOuter}>
                    {query.data?.buses.map(lineCode => (
                      <View key={lineCode} style={[styles.code, lineCodeStyle]}>
                        <UiText>{lineCode}</UiText>
                      </View>
                    ))}
                  </View>
                </View>
              </>
            )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 14,
    gap: 8,
  },
  title: {
    fontWeight: 'bold',
  },
  titleContainer: {
    padding: 4,
    paddingTop: 0,
  },
  linesContainer: {
    gap: 8,
  },
  codeOuter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  code: {
    padding: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
})
