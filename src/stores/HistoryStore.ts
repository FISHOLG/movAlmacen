import { create } from "zustand";
import { persist } from "zustand/middleware";

type detail = {
  codigo: string;
  desc: string;
  cant: string;
  und: string;
  matriz: string;
  obs: string;
};

type historyType = {
  numVale: string;
  detalles: detail[];
  setNumVale: (numvale: string) => void;
  setDetalles: (detalles: detail[]) => void;
  clearAll: () => void;
};

export const HistoryStore = create<historyType>()(
  persist(
    (set) => ({
      numVale: "",
      detalles: [],
      setNumVale: (numVale) => set({ numVale: numVale }),
      setDetalles: (detalles) => set({ detalles: detalles }),
      clearAll: () =>
        set({
          numVale: "",
          detalles: [],
        }),
    }),
    {
      name: "historyValeMovAlmacen",
    }
  )
);
