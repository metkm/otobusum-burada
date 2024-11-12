import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";
import { LayoutChangeEvent, StyleSheet } from "react-native";
import { SelectedLines } from "./SelectedLines";
import { useCallback, useState } from "react";

export function TheFilters({
  animatedPosition,
  animatedIndex,
}: {
  animatedPosition: SharedValue<number>;
  animatedIndex: SharedValue<number>;
}) {
  const [height, setHeight] = useState(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: animatedPosition.value - height - 0,
        },
      ],
      opacity: 1 - animatedIndex.value,
    };
  });

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setHeight(event.nativeEvent.layout.height);
  }, []);

  return (
    <Animated.View onLayout={onLayout} style={[animatedStyle, styles.filters]}>
      <SelectedLines />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  filters: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 50,
    marginTop: 0,
  },
});
