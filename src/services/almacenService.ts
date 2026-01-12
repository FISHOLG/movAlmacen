import Cliente from "./Cliente";

type searchTMov = {
  tmov: string;
  operacion: string;
};

type listArt = {
  almacen: string;
  operacion: string;
};

type rackDisp = {
  filtro: string;
  nivel: number;
  operacion: string;
};

type AsigRack = {
  codigo: string;
  pallet: string;
  operacion: string;
  valeI: string;
  valeS: string;
  multi: string;
};

type AlmUbic = {
  almacen: string;
  condicion: string;
};

type racks = Omit<rackDisp, "nivel">;

type liberar = {
  pallet: string;
};
type searcMtz = searchTMov & { articulo: string };

const ListarMovimientos = async (datos: searchTMov) => {
  try {
    const url = `/api/almacen`;
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

    return { result: "error", message: message.toString() };
  }
};

const ListarMatrices = async (datos: searcMtz) => {
  try {
    const url = `/api/almacen`;
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

    return { result: "error", message: message.toString() };
  }
};

const ListarItemsDisp = async (datos: listArt) => {
  try {
    const url = `/api/almacen`;
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

    return { result: "error", message: message.toString() };
  }
};

const obtenerDataRack = async (datos: rackDisp) => {
  try {
    const url = `/api/almacen`;
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

    return { result: "error", message: message.toString() };
  }
};

const obtenerUbicaciones = async (datos: racks) => {
  try {
    const url = `/api/almacen`;
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

    return { result: "error", message: message.toString() };
  }
};

const AsignarRack = async (datos: AsigRack) => {
  try {
    const url = `/api/almacen`;
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

const listarAlmacenes = async () => {
  try {
    const url = `/api/almacen`;
    const peticion = await Cliente.post(url, { operacion: "listarAlmacen" });

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

const AlmacenesUbic = async (data: AlmUbic) => {
  try {
    const url = `/api/almacen`;
    const peticion = await Cliente.post(url, { ...data, operacion: "AlmUbic" });

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

const LiberarPallet = async (datos: liberar) => {
  try {
    const data = { ...datos, operacion: "desasignarRack" };

    const url = `/api/almacen`;
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

export {
  ListarMovimientos,
  ListarMatrices,
  ListarItemsDisp,
  obtenerDataRack,
  obtenerUbicaciones,
  AsignarRack,
  listarAlmacenes,
  LiberarPallet,
  AlmacenesUbic,
};
