import React from "react";
import { useWindowDimensions } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export const animationStyle: any = React.useCallback((value: number) => {
  "worklet";
  const { height, width } = useWindowDimensions();
  const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 30]);
  const rotateZ = `${interpolate(value, [-1, 0, 1], [-45, 0, 45])}deg`;
  const translateX = interpolate(value, [-1, 0, 1], [-width * 2, 0, width * 2]);

  return {
    transform: [{ rotateZ }, { translateX }],
    zIndex,
  };
}, []);
