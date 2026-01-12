import { dataFormTransfer } from "../types";
import Cliente from "./Cliente";
import { SetErrorLog } from "./ErrorService";

type Transfer = dataFormTransfer & {
  operacion: string;
  usuario: string;
};

const GuardarOtr = async (datos: Transfer) => {
  try {
    const url = `/api/transferencia`;
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
    SetErrorLog(message.toString(), "GUARDAR OTR", datos.usuario);
    return { result: "error", message: message.toString() };
  }
};

export { GuardarOtr };
