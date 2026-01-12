import { create } from "zustand";
import { persist } from "zustand/middleware";
import { almBD, detallePallet, Infoarticulo } from "../types";

type store = {
  almOrg: almBD | null;
  almDest: almBD | null;
  infoArt: Infoarticulo | null;
  infoPallet: string;
  infoDet: detallePallet[] | null;
  setOrg: (alm: almBD) => void;
  setInfoPallet: (numPallet: string) => void;
  setInfoDet: (data: detallePallet[]) => void;
  setInfoArt: (data: Infoarticulo) => void;
  setDest: (alm: almBD) => void;
  dropDet: (item: string) => void;
  dropAll: () => void;
};

export const TransferStore = create<store>()(
  persist(
    (set) => ({
      almOrg: null,
      almDest: null,
      infoArt: null,
      infoPallet: "",
      infoDet: [],
      setOrg: (alm) => set({ almOrg: alm }),
      setDest: (alm) => set({ almDest: alm }),
      setInfoPallet: (numPallet) => set({ infoPallet: numPallet }),
      setInfoArt: (data) => set({ infoArt: data }),
      setInfoDet: (data) => set({ infoDet: data }),
      dropDet: (item) =>
        /*  set((state) => {
          const det = state.infoDet?.filter((inf) => inf.item != item);
          const pallet = det?.length === 0 ? "" : state.infoPallet;

          return { infoDet: det, infoPallet: pallet };
        }), */
        set((state) => {
          const det = state.infoDet?.map((inf) => {
            if (inf.item === item) {
              return { ...inf, visible: !inf.visible };
            }

            return inf;
          });

          return { infoDet: det };
        }),
      dropAll: () =>
        set({
          almOrg: null,
          almDest: null,
          infoArt: null,
          infoPallet: "",
          infoDet: [],
        }),
    }),
    {
      name: "movAlmacenTStore",
    }
  )
);
