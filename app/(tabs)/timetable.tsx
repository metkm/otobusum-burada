import { RouteTimetable } from "@/components/RouteTimetable";
import { SelectedRoutes } from "@/components/SelectedRoutes";
import { TheFocusAwareStatusBar } from "@/components/TheFocusAwareStatusbar";
import { UiText } from "@/components/ui/UiText";
import { useTheme } from "@/hooks/useTheme";
import { useRoutes } from "@/stores/routes";
import { i18n } from "@/translations/i18n";
import { useCallback, useState } from "react";
import { LayoutChangeEvent, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TimetableScreen() {
  const theme = useTheme()
  const insets = useSafeAreaInsets();
  const [routesHeight, setRoutesHeight] = useState(0)

  const routes = useRoutes((state) => state.routes);
  const keys = Object.keys(routes);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setRoutesHeight(event.nativeEvent.layout.height)
  }, [])

  const contentStyle: StyleProp<ViewStyle> = {
    paddingTop: routesHeight,
  }

  const timetableRouteStyle: StyleProp<ViewStyle> = {
    position: "absolute",
    paddingTop: insets.top - 4,
    zIndex: 10,
    left: 0,
    right: 0,
    backgroundColor: theme.surfaceContainerLow
  };

  if (keys.length < 1) {
    return (
      <View style={{ flex: 1 }}>
        <TheFocusAwareStatusBar />

        <UiText info style={{ textAlign: "center", textAlignVertical: "center", flex: 1 }}>
          {i18n.t('timetableEmpty')}
        </UiText>
      </View>
    );
  }

  return (
    <View>
      <SelectedRoutes style={timetableRouteStyle} onLayout={onLayout} />

      <ScrollView contentContainerStyle={[styles.content, contentStyle]}>
        <View style={{ flex: 1, flexDirection: "column", gap: 8 }}>
          {keys.map((cd) => (
            <RouteTimetable key={cd} code={cd} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 8,
    padding: 8,
  },
});
