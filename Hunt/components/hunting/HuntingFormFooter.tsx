import { View, TouchableOpacity, Text } from "react-native";
import HuntingFormPagination from "./HuntingFormPagination";

interface IHuntingFormFooterProps {
  goToNextSlide: () => void;
  goToPrevSlide: () => void;
  activeIndex: number;
  carouselleLength: number;
}

export default function HuntingFormFooter({
  goToNextSlide,
  goToPrevSlide,
  activeIndex,
  carouselleLength,
}: IHuntingFormFooterProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: "#EEEEEE",
      }}
    >
      <TouchableOpacity
        onPress={goToPrevSlide}
        style={{
          borderWidth: 1,
          borderRadius: 10,
          borderBottomWidth: 4,
          borderRightWidth: 4,
          alignItems: "center",
          justifyContent: "center",
          width: 120,
          height: 40,
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "800" }}>Précédent</Text>
      </TouchableOpacity>

      <HuntingFormPagination
        totalCount={carouselleLength}
        activeIndex={activeIndex}
      />

      <TouchableOpacity
        onPress={goToNextSlide}
        style={{
          borderWidth: 1,
          borderBottomWidth: 4,
          borderRightWidth: 4,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          width: 120,
          height: 40,
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "800" }}>Suivant</Text>
      </TouchableOpacity>
    </View>
  );
}
