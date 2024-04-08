import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HuntingHeader from "../../components/hunting/screen/HuntingHeader";
import { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import { useEffect } from "react";
import { useFocusEffect } from "expo-router";
import { useAppSelector } from "../../redux/hook";
import MapView from "react-native-map-clustering";

const INITIAL_REGION = {
  latitude: 45.5086699,
  longitude: -73.5539925,
  latitudeDelta: 5,
  longitudeDelta: 5,
};

export default function MigTrackingScreen({ navigation }: any) {
  const migTracking = useAppSelector((state) => state.migTracking);

  useEffect(() => {
    console.log(migTracking);
  }, []);
  return (
    <SafeAreaView
      style={{ backgroundColor: "#EEEEEE", height: "100%", flex: 1 }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            padding: 15,
            marginBottom: 50,
            flexGrow: 1,
            alignItems: "center",
            backgroundColor: "#EEEEEE",
          }}
        >
          <HuntingHeader
            title={"Live Tracking"}
            openModal={() => console.log("BONJOUR")}
            navigation={navigation}
          />
          <View
            style={{
              borderRadius: 8,
              marginBottom: 10,
              width: 350,

              backgroundColor: "#EEEEEE",

              borderWidth: 1,
              borderBottomWidth: 4,
              borderRightWidth: 4,

              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.22,
              shadowRadius: 2.22,
              elevation: 3,
              overflow: "hidden",
            }}
          >
            <MapView
              style={[
                {
                  width: "100%",
                  height: "100%",
                },
              ]}
              initialRegion={INITIAL_REGION}
              provider={PROVIDER_GOOGLE}
              paddingAdjustmentBehavior="automatic"
            >
              {migTracking !== null &&
                migTracking.map((marker: any) => (
                  <Marker
                    key={marker.id}
                    coordinate={{
                      latitude: marker.latitude,
                      longitude: marker.longitude,
                    }}
                    title={marker.title}
                    description={marker.description}
                  >
                    <Callout>
                      <View
                        style={{
                          flex: 1,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ fontWeight: "bold" }}>
                          {marker.specimen}
                        </Text>
                        <Text>
                          {marker.quantityKill}/{marker.quantityView}
                        </Text>
                      </View>
                    </Callout>
                  </Marker>
                ))}
            </MapView>
          </View>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
