import { create } from "zustand";
import { InfoPallet } from "../types";
import { persist } from "zustand/middleware";

type ubicacionType = {
  codigo: string;
  almacen: string;
  lado: string;
  columna: string;
  fila: string;
  profundidad: string;
  estado: string;
};

type asigType = {
  info: InfoPallet | null;
  ubicacion: ubicacionType;

  // setUbicacion: (ubic: ubicacionType) => void;
  setAlm: (dato: string) => void;
  /*setLado: (dato: string) => void;
  setColumna: (dato: string) => void;
  setNivel: (dato: string) => void;
  setProfundidad: (dato: string) => void;*/
  setEstado: (dato: string) => void;
  setUbicacion: (codigo: string) => void;
  setUbicacionD: (codigo: string) => void;
  setInfo: (data: InfoPallet) => void;
  clearAsig: () => void;
};

export const AsigStore = create<asigType>()(
  persist(
    (set) => ({
      info: null,
      ubicacion: {
        codigo: "",
        almacen: "",
        lado: "",
        columna: "",
        fila: "",
        profundidad: "",
        estado: "",
      },
      setUbicacion: (codigo) =>
        set((state) => {
          //const almacen = codigo.length >= 2 ? codigo.substring(0, 2) : "";
          if (codigo.includes(state.ubicacion.almacen))
            return { ubicacion: state.ubicacion };
          const lado = codigo.length >= 3 ? codigo.substring(2, 3) : "";
          const columna = codigo.length >= 5 ? codigo.substring(3, 5) : "";
          const fila = codigo.length >= 6 ? codigo.substring(5, 6) : "";
          const profundidad = codigo.length >= 7 ? codigo.substring(6) : "";

          const newUbic = {
            ...state.ubicacion,
            //almacen,
            lado,
            columna,
            fila,
            profundidad,
            codigo,
          };

          return { ubicacion: newUbic };
        }),
      setUbicacionD: (codigo) =>
        set((state) => {
          //const almacen = codigo.length >= 2 ? codigo.substring(0, 2) : "";

          const newUbic = {
            ...state.ubicacion,
            //almacen,

            codigo,
          };

          return { ubicacion: newUbic };
        }),
      setAlm: (alm) =>
        set((state) => {
          const newUbic = { ...state.ubicacion, almacen: alm };
          return { ubicacion: newUbic };
        }),
      /*setLado: (lado) =>
        set((state) => {
          const codigo =
            state.ubicacion.almacen +
            lado +
            state.ubicacion.columna +
            state.ubicacion.fila +
            state.ubicacion.profundidad;

          const newUbic = { ...state.ubicacion, lado: lado, codigo };
          return { ubicacion: newUbic };
        }),
      setColumna: (columna) =>
        set((state) => {
          const codigo =
            state.ubicacion.almacen +
            state.ubicacion.lado +
            columna +
            state.ubicacion.fila +
            state.ubicacion.profundidad;

          const newUbic = { ...state.ubicacion, columna: columna, codigo };
          return { ubicacion: newUbic };
        }),
      setNivel: (nivel) =>
        set((state) => {
          const codigo =
            state.ubicacion.almacen +
            state.ubicacion.lado +
            state.ubicacion.columna +
            nivel +
            state.ubicacion.profundidad;

          const newUbic = { ...state.ubicacion, fila: nivel, codigo };
          return { ubicacion: newUbic };
        }),
      setProfundidad: (profundidad) =>
        set((state) => {
          const codigo =
            state.ubicacion.almacen +
            state.ubicacion.lado +
            state.ubicacion.columna +
            state.ubicacion.fila +
            profundidad;

          const newUbic = {
            ...state.ubicacion,
            profundidad: profundidad,
            codigo,
          };
          return { ubicacion: newUbic };
        }), */
      setEstado: (estado) =>
        set((state) => ({ ubicacion: { ...state.ubicacion, estado: estado } })),
      setInfo: (data) => set({ info: data }),
      clearAsig: () =>
        set({
          info: null,
          ubicacion: {
            codigo: "",
            almacen: "",
            lado: "",
            columna: "",
            fila: "",
            profundidad: "",
            estado: "",
          },
        }),
    }),
    {
      name: "asigMovAlmacen",
    }
  )
);
