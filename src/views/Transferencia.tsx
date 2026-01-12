import { useEffect, useState } from "react";
import MdlTarnsfer from "../components/Transferencia/MdlTarnsfer";
import FormTransfer from "../components/Transferencia/FormTransfer";
import { TransferStore } from "../stores/TransferStore";
import MdlAsigRack from "../components/Transferencia/MdlAsigRack";
import { AsigStore } from "../stores/AsigStore";

export default function Transferencia() {
  const dropAll = TransferStore((state) => state.dropAll);
  const clearAsig = AsigStore((state) => state.clearAsig);

  const [visibilityMdl, setVisibilityMdl] = useState(true);
  const [visibilityMdlAsig, setVisibilityMdlAsig] = useState(false);

  const changeVisibility = (valor: boolean) => {
    setVisibilityMdl(valor);
  };
  const changeVisibilityAsig = () => {
    setVisibilityMdlAsig(!visibilityMdlAsig);
  };

  useEffect(() => {
    dropAll();
    clearAsig();
  }, []);
  return (
    <>
      {visibilityMdl && <MdlTarnsfer changeVisibility={changeVisibility} />}
      {visibilityMdlAsig && (
        <MdlAsigRack changeVisibilityAsig={changeVisibilityAsig} />
      )}
      {!visibilityMdl && (
        <FormTransfer changeVisibilityAsig={changeVisibilityAsig} />
      )}
    </>
  );
}
