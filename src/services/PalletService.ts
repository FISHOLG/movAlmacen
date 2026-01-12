import { searchFormPallet } from "../types";
import Cliente from "./Cliente";
import { SetErrorLog } from "./ErrorService";

type getData = {
  operacion: string;
  numPallet: string;
  iTmov: string;
  articulo: string;
};

type getDataTrans = {
  numPallet: string;
  almacen: string;
  tipo: string;
};

type getArticles = {
  numPallet: string;
};
// type getDetallePallet = {
//   numPallet: string;
// };

type detTrasPallet = {
  ot: string;
  traza: string;
  peso: string;
  articulo: string;
};

type trasPallet = {
  palletO: string;
  palletD: string;
  usuario: string;
  // articulo: string;
  detalle: detTrasPallet[];
  operacion: string;
};

type verify = Omit<getData, "iTmov" | "articulo">;

const GetDataPallet = async (datos: getData) => {
  try {
    const url = `/api/pallet`;
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

const SearchPallet = async (datos: searchFormPallet) => {
  try {
    const url = `/api/pallet`;
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

const VerificarPallet = async (datos: verify) => {
  try {
    const url = `/api/pallet`;
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

const TrasladarPallet = async (datos: trasPallet) => {
  try {
    const url = `/api/pallet`;
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
    SetErrorLog(message.toString(), "TRASLADAR PALLET", datos.usuario);
    return { result: "error", message: message.toString() };
  }
};

const ObtenerCantArticulos = async (datos: getArticles) => {
  try {
    const data = { ...datos, operacion: "listItems" };

    const url = `/api/pallet`;
    const peticion = await Cliente.post(url, data);
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

const GetDataPalletTrans = async (datos: getDataTrans) => {
  try {
    const url = `/api/pallet`;
    const data = { ...datos, operacion: "dataTrans" };
    const peticion = await Cliente.post(url, data);
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

// =============== DET PALLET ===================

const ObtenerDetallePallet = async (datos: { numPallet: string }) => {
  try {
    const payload = {
      operacion: "detalle",
      numPallet: datos.numPallet,
    };

    const resp = await Cliente.post("/api/pallet", payload);
    return resp.data;
  } catch (error: any) {
    return {
      result: "error",
      message: error.message,
    };
  }
};

export {
  GetDataPallet,
  SearchPallet,
  VerificarPallet,
  TrasladarPallet,
  ObtenerCantArticulos,
  GetDataPalletTrans,
  ObtenerDetallePallet,
};
