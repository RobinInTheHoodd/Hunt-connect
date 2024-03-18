import { View } from "react-native";
import { IDuckTeamsModel } from "../../model/DuckTeamsModel";
import DuckTeamFormContent from "./DuckTeamFormContent";
import DuckTeamFormHeader from "./DuckTeamFormHeader";

interface IDuckTeamFormProps {
  form: IDuckTeamsModel[];
  setForm: React.Dispatch<React.SetStateAction<IDuckTeamsModel[]>>;
}
export default function DuckTeamForm({ form, setForm }: IDuckTeamFormProps) {
  return (
    <>
      <DuckTeamFormHeader />
      <View style={{ flex: 1, marginBottom: 80 }}>
        <DuckTeamFormContent form={form} setForm={setForm} />
      </View>
    </>
  );
}
