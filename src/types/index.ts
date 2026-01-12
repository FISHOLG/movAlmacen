export type usrDataType = {
  nombre: string;
  usuario: string;
  pass: string;
};

export type loginType = Omit<usrDataType, "nombre"> & {
  operacion: string;
};

export type authStoreType = Omit<usrDataType, "pass">;

export type Infoarticulo = {
  codigo: string;
  desc: string;
  und: string;
  sldoTotal: string;
  pesoUnd: string;
};

export type formHistorial = {
  usuario: string;
  fechIni: string;
  fechFin: string;
  operacion: string;
};

export type detVale = {
  nroVale: string;
  estado: string;
  fechReg: string;
  tMov: string;
  tRefer: string;
  nroRefer: string;
  fechIng: string;
  almacen: string;
};

export type formQr = {
  codigo: string;
  operacion: string;
};

export type referencia = {
  tipo: string;
  nro: string;
  desc: string;
  nroMov: string;
  almacen: string;
  restante: string;
  ot_tipo?: string; // --- agregue aqui
};

export type detallePallet = {
  visible: boolean;
  codArt: string;
  item: string;
  bultos: string;
  peso: string;
  fecha?: string;
  lote: string;
  traza: string;
  adicional: string;
  referencia?: referencia;
  numPallet?: string;
  pesoUnd?: string;
};

export type detallePalletForm = Omit<
  detallePallet,
  "bultos" | "adicional" | "visible"
> & {
  matriz: string;
};

export type referenciaForm = Omit<referencia, "desc" | "restante">;

export type dataFormVale = {
  detalles: detallePalletForm[];
  fechaReg: string;
  tMov: string;
  idForm: string;
  codParte: string; //--- agregue aqui
};

export type referUnidas = Omit<referenciaForm, "nroMov"> & {
  detalles: detallePalletForm[];
};

export type dataSaveValeMultiple = {
  fechaReg: string;
  tMov: string;
  idForm: string;
  observaciones?: string;
  recepcionado?: string;
  referencias: referUnidas[];
  operacion: string;
  usuario: string;
  numPallet: string;
  codParte?: string; 
};

export type detalleTransfer = Omit<detallePalletForm, "lote"> & {
  loteOrg: string;
  loteDest: string;
};

export type dataFormTransfer = {
  detalles: detalleTransfer[];
  fechaReg: string;
  almOrg: string;
  almDest: string;
  observaciones: string;
  idFormI: string;
  idFormS: string;
};

export type searchLote = {
  operacion: string;
  tMov: string;
  articulo?: string;
  almacen?: string;
  lote?: string;
};

/* ASIGNACION DE UBICACION */

export type InfoPallet = {
  codArt: string;
  numPallet: string;
  bultos: string;
  peso: string;
  estado: string;
  ubicacion?: string;
};

//************************* TRANS P *************************/

// ---------------   TRANS P ---------------
export interface DataItemTransPByKey {
  [clave: string]: dataItemTransP[];
}

// ---------------  TRANS P ---------------
export interface DataItemTransPList {
  grupo: string;
  items: dataItemTransP[];
}

//************************* FIN TRANS P *************************/

export type searchFormPallet = {
  numPallet: string;
  operacion: string;
};

export type almBD = {
  codigo: string;
  desc: string;
  almacen: string;
};

export type dataFormTransP = {
  detalles: detallePalletForm[];
  /* numPalletO: string;
  numPallletD: string; */
};

// --- CAMBIAR Y/O CONSERVAR
export type dataItemTransP = {
  codArt: string;
  lote: string;
  traza: string;
  fecha: string;
  peso: string;
  ot: string;
  adicional: string;
  pesoUnd: string;
};

export type anularTransForm = {
  numVale: string;
  numPallet: string;
  ubicacion: string;
};

export type tMovType = {
  codigo: string;
  desc: string;
  clase: string;
  referencia: string;
  contabiliza: string;
};

export interface ItemPalletsMap {
  codArt: string;
  adicional: string;
  lote: string;
  traza: string;
  fecha: string;
  peso: string;
  ot: string;
  bultos: string;
  pesoUnd: string;
}

export interface GroupItemPallets {
  [key: string]: ItemPalletsMap[];
}

export interface GroupItemPalletsTransP {
  [key: string]: dataItemTransP[];
}
