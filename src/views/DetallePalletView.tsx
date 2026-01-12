import { useEffect, useState } from "react";
import ScanQr from "../components/Generar/ScanQr";


import { ValeStore } from "../stores/ValeStore";

import DetallePallet, { DetallePalletData } from "../components/DetallePallet";
import { ObtenerDetallePallet } from "../services/PalletService";

export default function DetallePalletView() {
  const [data, setData] = useState<DetallePalletData | null>(null);
  const [loading, setLoading] = useState(false);

  const palletList = ValeStore((state) => state.infoPallet); 
  const dropAll = ValeStore((state) => state.dropAll);

  useEffect(() => {
    const numPallet = palletList?.[0];
    if (!numPallet) return;

    const fetch = async () => {
      setLoading(true);

      const resp = await ObtenerDetallePallet({ numPallet });

     
      if (resp?.result === "success" && resp?.data?.cabecera) {
        setData(resp.data as DetallePalletData);
      } else {
        setData(null);
      }

      setLoading(false);
    };

    fetch();
  }, [palletList]);

  const cancelar = () => {
    dropAll();
    setData(null);
  };

  return (
    <>
      {!data && <ScanQr changeVisibility={() => {}} />}

      {loading && <p className="text-center mt-4">Cargando pallet...</p>}

      {data && <DetallePallet data={data} />}

      {data && (
        <div className="absolute bottom-3 w-full px-2">
          <button
            className="w-full py-2 bg-red-600 text-white font-bold"
            onClick={cancelar}
          >
            CANCELAR ESCANEO
          </button>
        </div>
      )}
    </>
  );
}
