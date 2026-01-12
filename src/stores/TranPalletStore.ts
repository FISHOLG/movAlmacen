import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GroupItemPalletsTransP, Infoarticulo } from "../types";

type store = {
  infoPalletO: string;
  infoPalletD: string;
  infoDet: GroupItemPalletsTransP[] | null;
  infoArt: Infoarticulo | null;
  setInfoPalletO: (numPallet: string) => void;
  setInfoPalletD: (numPallet: string) => void;
  setInfoArt: (data: Infoarticulo) => void;
  setInfoDet: (data: GroupItemPalletsTransP[]) => void;
  dropAll: () => void;
};

export const TransferPStore = create<store>()(
  persist(
    (set) => ({
      infoPalletO: "",
      infoPalletD: "",
      infoDet: [],
      infoArt: null,
      setInfoPalletO: (numPallet) => set({ infoPalletO: numPallet }),
      setInfoPalletD: (numPallet) => set({ infoPalletD: numPallet }),
      setInfoArt: (data) => set({ infoArt: data }),
      setInfoDet: (data) => set({ infoDet: data }),

      dropAll: () =>
        set({
          infoPalletO: "",
          infoPalletD: "",
          infoDet: [],
          infoArt: null,
        }),
    }),
    {
      name: "movAlmacenTPStore",
    }
  )
);
