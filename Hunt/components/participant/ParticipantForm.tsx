import { IHutHunterModel } from "../../model/HutHunterModel";

import ParticipantFormContent from "./ParticipantFormContent";
import ParticipantFormHeader from "./ParticipantFormHeader";

export interface IParticipantFormProps {
  form: IHutHunterModel[];
  setForm: React.Dispatch<React.SetStateAction<IHutHunterModel[]>>;
}

export default function ParticipantForm({
  form,
  setForm,
}: IParticipantFormProps) {
  return (
    <>
      <ParticipantFormHeader />

      <ParticipantFormContent form={form} setForm={setForm} />
    </>
  );
}
