import { anularTransForm, dataSaveValeMultiple, formHistorial } from "../types";
import Cliente from "./Cliente";
import { SetErrorLog } from "./ErrorService";

type detailHistory = {
  numVale: string;
  operacion: string;
};

const HistorialVale = async (datos: formHistorial) => {
  try {
    const url = `/api/vale`;
    const peticion = await Cliente.post(url, datos);

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
    SetErrorLog(message.toString(), "HISTORIAL VALE", datos.usuario);
    return { result: "error", message: message.toString() };
  }
};

const GuardarVale = async (datos: dataSaveValeMultiple) => {
  try {
    const url = `/api/vale`;
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
    SetErrorLog(message.toString(), "GUARDAR VALE", datos.usuario);
    return { result: "error", message: message.toString() };
  }
};

const DetalleHistorial = async (datos: detailHistory) => {
  try {
    const url = `/api/vale`;
    const peticion = await Cliente.post(url, datos);

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
    SetErrorLog(message.toString(), "DETALLE VALE");
    return { result: "error", message: message.toString() };
  }
};

const HistorialTrans = async () => {
  try {
    const url = `/api/vale`;
    const datos = {
      operacion: "historialTrans",
    };
    const peticion = await Cliente.post(url, datos);

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
    SetErrorLog(message.toString(), "HISTORIAL TRANSFERENCIA");
    return { result: "error", message: message.toString() };
  }
};

const AnularTrans = async (datos: anularTransForm) => {
  try {
    const url = `/api/vale`;
    const data = {
      ...datos,
      operacion: "anularVale",
    };
    const peticion = await Cliente.post(url, data);

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
    SetErrorLog(message.toString(), "ANULAR TRANSFERENCIA");
    return { result: "error", message: message.toString() };
  }
};

export {
  HistorialVale,
  GuardarVale,
  DetalleHistorial,
  HistorialTrans,
  AnularTrans,
};
