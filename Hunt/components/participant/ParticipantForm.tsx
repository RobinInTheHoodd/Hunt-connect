import { IHuntingParticipanModel } from "../../model/HuntingParticipantModel";
import { ParticipantFormModel } from "../../model/ParticipantFormModel";
import DuckTeamFormContent from "../duckTeams/DuckTeamFormContent";
import DuckTeamFormHeader from "../duckTeams/DuckTeamFormHeader";
import ParticipantFormContent from "./ParticipantFormContent";
import ParticipantFormHeader from "./ParticipantFormHeader";

export interface IParticipantFormProps {
  form: IHuntingParticipanModel[];
  setForm: React.Dispatch<React.SetStateAction<IHuntingParticipanModel[]>>;
}

export default function ParticipantForm({
  form,
  setForm,
}: IParticipantFormProps) {
  return (
    <>
      <ParticipantFormHeader />
      {/* DES PROPS A PAASER */}
      <ParticipantFormContent form={form} setForm={setForm} />
    </>
  );
}
