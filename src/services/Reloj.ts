import Cliente from "./Cliente";

const DateServer = async () => {
  try {
    const url = `/api/reloj`;
    const peticion = await Cliente.get(url);

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

    return { result: "error", message: message };
  }
};

export { DateServer };
