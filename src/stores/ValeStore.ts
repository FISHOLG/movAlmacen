import { create } from "zustand";
import { persist } from "zustand/middleware";
import { detallePallet, Infoarticulo, referencia, tMovType } from "../types";

type store = {
  infoPallet: string[];
  infoArt: Infoarticulo | null;
  infoRefer?: referencia | null;
  infoDet: detallePallet[] | null;
  tipoMov: tMovType | null;
  matriz: string;
  setDet: (det: detallePallet) => void;
  setInfoPallet: (numPallet: string) => void;
  setInfoArt: (data: Infoarticulo) => void;
  setInfoDet: (data: detallePallet[]) => void;
  setTipoMov: (tmov: tMovType) => void;
  setMtz: (mtz: string) => void;
  setRefer: (refer: referencia | null) => void;
  // setVisible:(index:string)=>void;
  changeVDet: (item: string, pallet: string) => void;
  dropAll: () => void;
};

export const ValeStore = create<store>()(
  persist(
    (set) => ({
      infoPallet: [],
      infoArt: null,
      infoRefer: null,
      infoDet: [],
      tipoMov: null as tMovType | null,
      matriz: "",
      setDet: (det) =>
        set((state) => {
          state.infoDet?.push(det);
          return { infoDet: state.infoDet };
        }),
      setInfoPallet: (numPallet) =>
        set((state) => ({
          infoPallet: [...state.infoPallet, numPallet],
        })),
      setInfoArt: (data) => set({ infoArt: data }),
      setInfoDet: (data) => set({ infoDet: data }),
      setTipoMov: (tmov: tMovType) => set({ tipoMov: tmov }),
      setMtz: (tmov) => set({ matriz: tmov }),
      setRefer: (refer) => set({ infoRefer: refer }), //--- alamcen xd
      changeVDet: (item, pallet) =>
        set((state) => {
          const det = state.infoDet?.map((inf) => {
            if (inf.item === item && inf.numPallet === pallet) {
              return { ...inf, visible: !inf.visible };
            }

            return inf;
          });

          return { infoDet: det };
        }),
      dropAll: () =>
        set({
          infoPallet: [],
          infoArt: null,
          infoRefer: null,
          infoDet: [],
          tipoMov: null,
          matriz: "",
        }),
    }),
    {
      name: "movAlmacenVStore",
    }
  )
);
