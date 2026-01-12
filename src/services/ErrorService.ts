import { UAParser } from "ua-parser-js";
import Cliente from "./Cliente";

const SetErrorLog = async (
  mensaje: string,
  accion: string,
  usuario?: string
) => {
  try {
    const parser = new UAParser();
    const agent = parser.getResult();
    const device = agent.device;
    const datos = {
      error: mensaje,
      accion: accion,
      device: device.model,
      operacion: "saveError",
      usuario: usuario,
      app: "MOVALMACEN",
    };

    const url = `/api/error`;
    const peticion = await Cliente.post(url, datos);

    return peticion.data;
  } catch (error: any) {}
};

export { SetErrorLog };
