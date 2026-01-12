import Cliente from "./Cliente";

export const getParteProduccionActiva = async () => {
  const url = "/api/parteProd";
  const data = { operacion: "getParteProduccionActiva" };

  const resp = await Cliente.post(url, data);
  return resp.data;
};
