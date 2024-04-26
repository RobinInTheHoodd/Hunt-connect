import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
  useDrawerProgress,
} from "@react-navigation/drawer";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPortrait } from "@fortawesome/free-solid-svg-icons";
import AuthService from "../../../service/authService";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { Picker } from "@react-native-picker/picker";
import useHutListener from "../../../redux/listener/useHutListener";
import { UserContext } from "../../../model/UserContext";
import { useHuntSession } from "../../../redux/middleware/huntSessionMiddleware";
import { useUser } from "../../../redux/middleware/userMiddleware";
import { useObservation } from "../../../redux/middleware/observationMiddleware";

import {
  setLoadingFalse,
  setLoadingTrue,
} from "../../../redux/reducers/loadingSlice";
import { removeHuntSession } from "../../../redux/reducers/huntSessionSlice";
import { removeHut } from "../../../redux/reducers/hutSlice";

const DrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const window = useWindowDimensions();
  const rowWidth = (window.width * 0.75 * 80) / 100;
  const progress = useDrawerProgress();
  const authService = new AuthService();
  const user: UserContext = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();

  const [selectedHut, setSelectedHut] = useState<number>(user.personnalHutID);

  useUser();
  useHutListener(selectedHut);
  useHuntSession();
  useObservation();

  useEffect(() => {
    if (user) {
      setSelectedHut(user.personnalHutID);
    }
  }, [user]);

  useEffect(() => {}, [selectedHut]);

  const hut = useAppSelector((state) => state.hut);

  const handleLogout = async () => {
    props.navigation.closeDrawer();

    setTimeout(async () => {
      dispatch(removeHut());
      await authService.signOut();
    }, 500);
  };

  const changeHut = (hutID: number) => {
    setSelectedHut(hutID);
    dispatch(setLoadingTrue());
    dispatch(removeHuntSession());
    setTimeout(() => setLoadingFalse(), 1500);
  };

  return (
    <SafeAreaView edges={["right", "bottom", "left"]} style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <Text style={styles.displayName}>{user.displayName}</Text>

        <Picker
          selectedValue={selectedHut}
          onValueChange={(itemValue, itemIndex) => changeHut(itemValue)}
          style={styles.pickerStyle}
        >
          {user.hut
            .concat({ hutName: "Personnelle", hutID: user.personnalHutID })
            .map((hut) => (
              <Picker.Item
                label={hut.hutName}
                value={hut.hutID}
                key={hut.hutID}
              />
            ))}
        </Picker>
      </View>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ flexGrow: 1, paddingTop: 0 }}
      >
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <TouchableOpacity
        style={styles.signOutBtnStyle}
        onPress={() => handleLogout()}
      >
        <Text style={styles.signOutText}>Déconnection</Text>
        <FontAwesomeIcon icon={faPortrait} size={20} color="red" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  userName: {
    fontSize: 18,
    color: "#3A5160",
    fontFamily: "WorkSans-SemiBold",
    paddingTop: 8,
    paddingLeft: 4,
  },
  drawerRowStyle: {
    marginHorizontal: 0,
    paddingVertical: 8,
    justifyContent: "center",
    overflow: "hidden",
  },
  drawerRowbackViewStyle: {
    opacity: 0.3,
    height: 48,
    borderRadius: 24,
    borderTopStartRadius: 0,
    borderBottomStartRadius: 0,
  },
  drawerRowTextStyle: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "500",
  },
  drawerRowContentContainer: {
    flexDirection: "row",
    padding: 8,
    paddingHorizontal: 16,
    position: "absolute",
  },
  drawerAvatarStyle: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarShadow: {
    backgroundColor: "white",
    elevation: 24,
    shadowColor: "#3A5160",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  divider: {
    backgroundColor: "darkgrey",
    height: StyleSheet.hairlineWidth,
  },
  signOutBtnStyle: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "darkgrey",
  },
  signOutText: {
    flex: 1,
    color: "black",
    fontSize: 16,
    fontFamily: "WorkSans-SemiBold",
  },
  headerContainer: {
    padding: 20,
    backgroundColor: "#eee",
  },
  displayName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  pickerStyle: {
    width: "100%",
    height: 44,
  },
});

export default DrawerContent;
