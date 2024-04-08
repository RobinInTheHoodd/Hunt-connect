import { useEffect } from "react";
import { View, StyleSheet } from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
const HuntingFormPagination = ({ totalCount, activeIndex }: any) => {
  const widthValues = Array.from({ length: totalCount }).map(() =>
    useSharedValue(styles.paginationDot.width)
  );

  useEffect(() => {
    widthValues.forEach((widthValue, index) => {
      widthValue.value = withTiming(
        index === activeIndex
          ? styles.activeDot.width
          : styles.paginationDot.width,
        { duration: 300 }
      );
    });
  }, [activeIndex, widthValues]);

  return (
    <View style={styles.paginationContainer}>
      {widthValues.map((widthValue, index) => {
        const animatedStyle = useAnimatedStyle(() => {
          return {
            width: widthValue.value,
          };
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex ? styles.activeDot : null,
              animatedStyle,
            ]}
          />
        );
      })}
    </View>
  );
};

export default HuntingFormPagination;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 6,
    backgroundColor: "gray",
  },
  activeDot: {
    width: 35,
    height: 16,
    borderRadius: 8,
    backgroundColor: "gray",
  },
});
