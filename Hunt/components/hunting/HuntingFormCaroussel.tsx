import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { animationStyle } from "../../utils/Animation";
import WeatherForm from "../weather/weatherForm";
import ParticipantForm from "../participant/ParticipantForm";
import DuckTeamForm from "../duckTeams/DuckTeamForm";
import { useEffect, useRef, useState } from "react";
import { WeatherFormModel } from "../../model/form/WeatherFormModel";
import { ParticipantFormModel } from "../../model/ParticipantFormModel";
import { IDuckTeamsModel } from "../../model/DuckTeamsModel";
import { IHuntingParticipanModel } from "../../model/HuntingParticipantModel";

interface IHuntingFormCarousselProps {
  weather: WeatherFormModel;
  setWeather: React.Dispatch<React.SetStateAction<WeatherFormModel>>;
  participants: IHuntingParticipanModel[];
  setParticipants: React.Dispatch<
    React.SetStateAction<IHuntingParticipanModel[]>
  >;
  duckTeam: IDuckTeamsModel[];
  setDuckTeam: React.Dispatch<React.SetStateAction<IDuckTeamsModel[]>>;
  carouselData: number[];
  carouselRef: React.MutableRefObject<null>;
}

export default function HuntingFormCaroussel({
  duckTeam,
  participants,
  setDuckTeam,
  setParticipants,
  setWeather,
  weather,
  carouselData,
  carouselRef,
}: IHuntingFormCarousselProps) {
  const { height, width } = useWindowDimensions();

  return (
    <Carousel
      ref={carouselRef}
      data={carouselData}
      loop={false}
      width={width}
      autoPlay={false}
      enabled={false}
      renderItem={({ index }) => (
        <View
          style={{
            flex: 1,
            paddingHorizontal: 15,
          }}
        >
          {index === 0 && <WeatherForm form={weather} setForm={setWeather} />}
          {index === 1 && (
            <ParticipantForm form={participants} setForm={setParticipants} />
          )}
          {index === 2 && (
            <DuckTeamForm form={duckTeam} setForm={setDuckTeam} />
          )}
        </View>
      )}
    />
  );
}
