import Cliente from "./Cliente";

type getData = {
  operacion: string;
  codigo: string;
  tMov: string;
  nroDoc: string;
};

const GetOtDisp = async (datos: getData) => {
  try {
    const url = `/api/ot`;
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

export { GetOtDisp };
