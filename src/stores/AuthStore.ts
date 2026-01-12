import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authStoreType } from "../types/index";

type authType = {
  stateAuth: boolean;
  auth: authStoreType;
  logIn: (data: authStoreType) => void;
  logOuth: () => void;
};

export const AuthStore = create<authType>()(
  persist(
    (set) => ({
      stateAuth: false,
      auth: { usuario: "", nombre: "" },
      logIn: (data) => set({ auth: data, stateAuth: true }),
      logOuth: () =>
        set({ stateAuth: false, auth: { usuario: "", nombre: "" } }),
    }),
    {
      name: "authMovAlmacen",
    }
  )
);
