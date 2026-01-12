import { loginType } from "../types";
import Cliente from "./Cliente";

const IniciarSesion = async (datos: loginType) => {
  try {
    const url = `/api/usuario`;
    const peticion = await Cliente.post(url, datos);
    if (peticion.data.result && peticion.data.result === "error")
      throw new Error(peticion.data.message);
    return peticion.data;
  } catch (error: any) {
    let message = "";

    if (error.response) {
      message = error.response.data;
    } else if (error.request) {
      message = error.message;
    } else {
      message = error;
    }

    return { result: "error", message: message.toString() };
  }
};

export { IniciarSesion };
