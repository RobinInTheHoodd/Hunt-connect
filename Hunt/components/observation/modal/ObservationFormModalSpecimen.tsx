import { View, Text, useWindowDimensions } from "react-native";
import ObservationFormPicker from "./ObservationFormModalPicker";
import { faCrow } from "@fortawesome/free-solid-svg-icons";
import ObservationFormSpecimenModel from "../../../model/observation/ObservationFormSpecimenModel";
import ObservationForm from "../../../model/observation/ObservationForm";
import { useEffect } from "react";

interface IObservationFormSpecimenProps {
  form: ObservationFormSpecimenModel;
  setForm: React.Dispatch<React.SetStateAction<ObservationForm>>;
  openPickerId: boolean;
  setOpenPickerId: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ObservationFormSpecimen({
  form,
  setForm,
  openPickerId,
  setOpenPickerId,
}: IObservationFormSpecimenProps) {
  const { height, width } = useWindowDimensions();

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          flex: 1,
        }}
      >
        <View style={{ flex: 1, height: 100 }}>
          <Text
            style={{
              color: "#38761d",
              fontWeight: "bold",
              fontSize: width * 0.05,
              paddingBottom: 5,
            }}
          >
            Espèces
          </Text>
          <ObservationFormPicker
            items={[
              { id: 1, displayName: "Canard" },
              { id: 2, displayName: "Siffleur" },
              { id: 3, displayName: "Oie" },
              { id: 4, displayName: "Oie égypte" },
            ]}
            onItemSelect={(e: any) => {
              let result = ObservationFormSpecimenModel.validateForm(
                e.id,
                e.displayName,
                form
              );

              setForm((prevSate) => {
                return { ...prevSate, specimen: result };
              });
              setOpenPickerId(!openPickerId);
            }}
            title={form.specimen === undefined ? "Espèces" : form.specimen}
            iconLeft={faCrow}
            toggleOpen={() => {
              setOpenPickerId(!openPickerId);
            }}
            isOpen={openPickerId}
            removePicker={() => {}}
          />
        </View>
      </View>
      {form.isValid == false ? (
        form.errorMessage != "" ? (
          <Text style={{ color: "red", paddingBottom: 5 }}>
            {form.errorMessage}
          </Text>
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
    </>
  );
}
