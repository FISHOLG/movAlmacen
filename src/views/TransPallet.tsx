import { useEffect, useState } from "react";
import MdlPallets from "../components/TransPallet/MdlPallets";
import { TransferPStore } from "../stores/TranPalletStore";
import FormTranserP from "../components/TransPallet/FormTranserP";

export default function TransPallet() {
  const dropAll = TransferPStore((state) => state.dropAll);

  const [visibilityMdl, setVisibilityMdl] = useState(true);

  const changeVisibility = (valor: boolean) => {
    setVisibilityMdl(valor);
  };

  useEffect(() => {
    dropAll();
  }, []);
  return (
    <>
      {visibilityMdl && <MdlPallets changeVisibility={changeVisibility} />}
      {!visibilityMdl && <FormTranserP />}
    </>
  );
}
