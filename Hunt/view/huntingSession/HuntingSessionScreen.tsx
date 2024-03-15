import { useCallback, useEffect, useState } from "react";
import HuntingSessionService from "../../service/huntingSessionService";
import { IHuntingSessionModel } from "../../model/HuntingSession";
import WeatherCard from "../../components/WeatherCard";
import AddindHuntingSession from "../../components/AddingHuntingSession";
import { useAppSelector } from "../../redux/hook";
import { useFocusEffect } from "@react-navigation/native";

export default function HuntingSessionScreen({ navigation }: any) {
  const [huntSession, setHuntSession] = useState<IHuntingSessionModel>();
  const [isLoading, setIsLoading] = useState(true);
  const user = useAppSelector((state) => state.users);
  const huntingSessionService = new HuntingSessionService();

  useFocusEffect(
    useCallback(() => {
      const fetch = async () => {
        setIsLoading(true);

        const huntSession =
          await huntingSessionService.getCurrentHuntingSession(user.UIID);
        setHuntSession(huntSession);
        setIsLoading(false);
      };

      fetch();
    }, [])
  );

  useEffect(() => {}, [huntSession, user]);

  return (
    <>
      {isLoading ? (
        <></>
      ) : (
        <>
          {huntSession ? (
            <WeatherCard HuntSession={huntSession} navigation={navigation} />
          ) : (
            <AddindHuntingSession SetHunting={setHuntSession} />
          )}
        </>
      )}
    </>
  );
}
