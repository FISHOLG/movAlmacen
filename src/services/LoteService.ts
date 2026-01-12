import { searchLote } from "../types";
import Cliente from "./Cliente";
import { SetErrorLog } from "./ErrorService";

const GetLotes = async (datos: searchLote) => {
  try {
    const url = `/api/lote`;
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
    SetErrorLog(message.toString(), "BUSCAR LOTE");
    return { result: "error", message: message.toString() };
  }
};

export { GetLotes };
