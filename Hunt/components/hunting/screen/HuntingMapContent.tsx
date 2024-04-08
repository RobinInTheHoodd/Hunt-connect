import { useCallback, useEffect, useState } from "react";
import { useWindowDimensions, View } from "react-native";

import DuckTeamFormMap from "../../duckTeams/DuckTeamFormMap";
import SexeStatutModal from "../../duckTeams/DuckTeamFormModal";
import { IDuckTeamsModel } from "../../../model/DuckTeamsModel";
import { Skeleton } from "moti/skeleton";
import DuckTeamFormButton from "../../duckTeams/DuckTeamFormButton";
import { useAppSelector } from "../../../redux/hook";

export interface IDuckTeamFormContentProps {
  form: IDuckTeamsModel[];
  setForm: React.Dispatch<React.SetStateAction<IDuckTeamsModel[]>>;
  isFinish: boolean;
}
interface IMarker {
  latitude: number;
  longitude: number;
}

export default function HuntingMapContent({
  form,
  setForm,
  isFinish,
}: IDuckTeamFormContentProps) {
  const { height, width } = useWindowDimensions();

  const [tempMarker, setTempMarker] = useState<IMarker | null>(null);
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [isDeleteMarker, setIsDeleteMarker] = useState(false);
  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {}, [form]);

  const handleValidateModal = useCallback(
    (sexe: string, statut: string, species: string) => {
      if (tempMarker) {
        const newMarker = {
          latitude: tempMarker.latitude,
          longitude: tempMarker.longitude,
          sex: sexe,
          type: statut,
          specimen: species,
          id: form.length + 1,
          huntingID: undefined,
        };
        setForm((currentMarkers) => [...currentMarkers, newMarker]);
      }
      setModalVisible(false);
      setTempMarker(null);
    },
    []
  );

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        //marginHorizontal: 10,
        overflow: "hidden",
        borderRadius: width * 0.07,
        borderBottomWidth: 5,
        borderRightWidth: 5,
        flex: 1,
      }}
    >
      <>
        <DuckTeamFormMap
          form={form}
          setForm={setForm}
          setModalVisible={setModalVisible}
          isAddingMarker={isAddingMarker}
          setIsAddingMarker={setIsAddingMarker}
          isDeleteMarker={isDeleteMarker}
          setIsDeleteMarker={setIsDeleteMarker}
          setTempMarker={setTempMarker}
          setSelectedMarkerId={setSelectedMarkerId}
        />
        {isFinish ? (
          <></>
        ) : (
          <>
            <SexeStatutModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onValidate={handleValidateModal}
            />

            <DuckTeamFormButton
              isDeleteMarker={isAddingMarker}
              isAddingMarker={isDeleteMarker}
              setIsAddingMarker={setIsAddingMarker}
              setIsDeleteMarker={setIsDeleteMarker}
              setForm={setForm}
              selectedMarkerId={selectedMarkerId}
              setSelectedMarkerId={setSelectedMarkerId}
            />
          </>
        )}
      </>
    </View>
  );
}
