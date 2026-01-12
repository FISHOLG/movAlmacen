import { useEffect, useState } from "react";
import MdlPreData from "../components/Generar/MdlPreData";
import ScanQr from "../components/Generar/ScanQr";
import { ValeStore } from "../stores/ValeStore";
import FormGenerar from "../components/Generar/FormGenerar";
import { AsigStore } from "../stores/AsigStore";

export default function Generar() {
  const infoArt = ValeStore((state) => state.infoArt);
  const dropAll = ValeStore((state) => state.dropAll);
  const clearAsig = AsigStore((state) => state.clearAsig);

  const [visibilityMdl, setVisibilityMdl] = useState(false);

  const changeVisibility = (valor: boolean) => {
    setVisibilityMdl(valor);
  };

  useEffect(() => {
    dropAll();
    clearAsig();
  }, []);

  return (
    <>
      {infoArt === null && <ScanQr changeVisibility={changeVisibility} />}
      {visibilityMdl && <MdlPreData changeVisibility={changeVisibility} />}
      {infoArt !== null && !visibilityMdl && <FormGenerar />}
    </>
  );
}
