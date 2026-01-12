import { useEffect } from "react";
import AsigForm from "../components/Asignacion/AsigForm";
import ScanPallet from "../components/Asignacion/ScanPallet";
import { AsigStore } from "../stores/AsigStore";

export default function Ubicacion() {
  const info = AsigStore((state) => state.info);
  const clearAsig = AsigStore((state) => state.clearAsig);

  useEffect(() => {
    clearAsig();
  }, []);

  return <>{!info ? <ScanPallet /> : <AsigForm />}</>;
}
