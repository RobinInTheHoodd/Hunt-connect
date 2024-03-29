import { View, Text } from "react-native";
import ObservationFormTimeDatePicker from "./ObservationFormModalTimeDatePicker";
import ObservationFormTimeDateModel from "../../../model/observation/ObservationFormTimeDateModel";
import ObservationForm from "../../../model/observation/ObservationForm";

interface IObservationFormTimeDateProps {
  form: ObservationFormTimeDateModel;
  setForm: React.Dispatch<React.SetStateAction<ObservationForm>>;
}

export default function ObservationFormTimeDate({
  form,
  setForm,
}: IObservationFormTimeDateProps) {
  let rs: ObservationFormTimeDateModel;
  const setDate = (type: string, date: Date) => {
    if (type == "Tué ") {
      rs = ObservationFormTimeDateModel.validateKillDate(date, form);
      rs = ObservationFormTimeDateModel.validateViewDate(rs.viewDate!, rs);
      setForm((prev) => {
        return {
          ...prev,
          date: rs,
        };
      });
    } else {
      rs = ObservationFormTimeDateModel.validateViewDate(date, form);
      rs = ObservationFormTimeDateModel.validateKillDate(rs.killDate!, rs);
      setForm((prev) => {
        return {
          ...prev,
          date: rs,
        };
      });
    }
  };

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          gap: 30,
          flex: 1,
        }}
      >
        <ObservationFormTimeDatePicker
          date={form.viewDate!}
          setDate={setDate}
          text={"Vue "}
        />
        <ObservationFormTimeDatePicker
          date={form.killDate!}
          setDate={setDate}
          text={"Tué "}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
          flex: 1,
        }}
      >
        <View style={{ flex: 1 }}>
          {form.viewDateIsValid == false && form.viewDateErrorMessage != "" ? (
            <Text style={{ color: "red", paddingBottom: 5 }}>
              {form.viewDateErrorMessage}
            </Text>
          ) : null}
        </View>
        <View style={{ flex: 1 }}>
          {form.killDateIsValid == false && form.killDateErrorMessage != "" ? (
            <Text style={{ color: "red", paddingBottom: 5 }}>
              {form.killDateErrorMessage}
            </Text>
          ) : null}
        </View>
      </View>
    </>
  );
}
