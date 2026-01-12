import {
  dataItemTransP,
  DataItemTransPByKey,
  DataItemTransPList,
  ItemPalletsMap,
  GroupItemPallets,
} from "../types";

export function agruparPorArticulo(items: ItemPalletsMap[]) {
  const grupos: GroupItemPallets = {};

  items.forEach((item) => {
    const cod = item.codArt.trim();

    if (!grupos[cod]) {
      grupos[cod] = [];
    }

    grupos[cod].push(item);
  });

  return Object.entries(grupos).map(([codArt, items]) => ({
    codArt,
    pesoUnd: items[0].pesoUnd,
    items,
  }));
}

// ------------- AGRUPAMIENTO  ---------------
export function agruparDataItemTransP(
  items: dataItemTransP[],
  campo: keyof dataItemTransP
): DataItemTransPByKey {
  const grupos: DataItemTransPByKey = {};

  items.forEach((item) => {
    const clave = item[campo];

    if (!grupos[clave]) grupos[clave] = [];
    grupos[clave].push(item);
  });

  return grupos;
}

export function mapearAgrupado(
  grupos: DataItemTransPByKey
): DataItemTransPList[] {
  return Object.keys(grupos).map((clave) => ({
    grupo: clave,
    items: grupos[clave],
  }));
}

export function debugDataItemTransP(lista: DataItemTransPList[]) {
  lista.forEach((entry) => {
    console.log("ARTICULO:", entry.grupo);
    entry.items.forEach((item) => {
      console.log("   → ITEM:", item);
    });
  });
}
