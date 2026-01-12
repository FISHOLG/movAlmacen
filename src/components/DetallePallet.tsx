import { faEye, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo, useState } from "react";

type Cabecera = {
  num_pallet?: string;
  num_bulto?: number | string;
  peso?: number | string;
  cod_usuario?: string;
  fech_registro?: any;
  flag_estado?: number | string;
  estado_texto?: string;
  observacion?: string;
};

export type DetItem = {
  item?: number | string;
  num_bulto?: number | string;
  peso?: number | string;
  fech_produ?: any;
  cod_templa?: string;
  cod_traza?: string;
  cod_articuli?: string;
  descripcion?: string;
  peso_origina?: number | string;

  cod_parte?: string;
  desc_parte?: string;
  nro_vale?: string;
  tipo_mov?: string;
  ot?: string;
};

export interface DetallePalletData {
  cabecera?: Cabecera;
  detalle?: DetItem[];
}

type Props = {
  data: DetallePalletData;

  onClose?: () => void; // X rojo
  onAgregar?: (items: DetItem[]) => void; // + (selección modal)
};

export default function DetallePallet({ data, onClose }: Props) {
  const cab = data?.cabecera ?? {};
  const det = Array.isArray(data?.detalle) ? data.detalle : [];

  const pesoCab = Number(cab?.peso ?? 0);
  const bultosCab = Number(cab?.num_bulto ?? 0);
  const flag = Number(cab?.flag_estado ?? -1);

  // =============== MODAL ===============
  const [open, setOpen] = useState(false);

  const [sel, setSel] = useState<Record<number, boolean>>({});

  // lista con idx estable
  const detConIdx = useMemo(() => {
    return det.map((d, idx) => ({ ...d, __idx: idx }));
  }, [det]);

  //

  const limpiarSel = () => setSel({});

  const cerrarModal = () => {
    setOpen(false);
    limpiarSel();
  };

  const countSel = useMemo(() => {
    return Object.values(sel).filter(Boolean).length;
  }, [sel]);

  return (
    <div className="w-full">
      {/* ======================== HEADER AZUL ======================== */}
      <div className="w-full bg-blue-500 text-white text-center font-bold py-2 uppercase tracking-wider">
        {String(cab?.num_pallet ?? "--")}
      </div>

      {/* ======================== CABECERA ======================== */}
      <div className="w-full border border-gray-300">
        <div className="grid grid-cols-2">
          <CabItem
            label="#BULTOS :"
            value={String(Number.isFinite(bultosCab) ? bultosCab : 0)}
          />
          <CabItem
            label="#PESO(KG) :"
            value={Number.isFinite(pesoCab) ? pesoCab.toFixed(4) : "0.0000"}
          />

          <CabItem
            label="#USUARIO :"
            value={String(cab?.cod_usuario ?? "--")}
          />
          <CabItem
            label="#FECHA REGISTRO :"
            value={String(cab?.fech_registro ?? "--")}
          />

          <CabItem
            label="#ESTADO :"
            value={`${Number.isFinite(flag) ? flag : "--"} - ${String(
              cab?.estado_texto ?? "--"
            )}`}
          />

          {/* celda vacía como tu diseño */}
          <div className="border-l border-t border-gray-300" />

          {/* OBSERVACIÓN full width */}
          <div className="col-span-2 border-t border-gray-300">
            <div className="px-2 py-2 font-bold uppercase text-sm">
              OBSERVACIÓN :
            </div>
            <div className="px-2 py-2 text-center font-sans">
              {String(cab?.observacion ?? "-")}
            </div>
          </div>
        </div>
      </div>

      {/* ======================== ITEMS HEADER= ======================= */}
      <div className="w-full border border-gray-300 border-t-0 bg-gray-50 flex justify-between items-center px-2 py-2">
        <span className="font-bold uppercase text-sm">ITEMS</span>
        <span className="bg-black text-white rounded-full px-2 text-xs font-bold">
          {det.length}
        </span>
      </div>

      {/* ======================== BOTONERA CENTRADA ======================== */}
      <div className="w-full flex justify-center gap-6 mt-6">
        <button
          type="button"
          className="bg-red-600 text-white font-bold px-8 py-3 rounded-md"
          onClick={onClose}
        >
          SALIR <FontAwesomeIcon icon={faTimes} />
        </button>

        <button
          type="button"
          className="bg-orange-600 text-white font-bold px-8 py-3 rounded-md"
          onClick={() => {
            if (det.length === 0) return;
            setOpen(true);
          }}
        >
          DETALLE ITEMS <FontAwesomeIcon icon={faEye} />
        </button>
      </div>

      {/* ======================== MODAL ITEMS ======================== */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-2">
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={cerrarModal} />

          {/* card */}
          <div className="relative w-[95%] md:w-[900px] bg-white rounded-md shadow-lg border border-gray-300 overflow-hidden">
            {/* header */}
            <div className="flex justify-between items-center px-3 py-2 border-b border-gray-300 bg-gray-50">
              <span className="font-bold uppercase text-sm">
                DETALLE DE ITEMS{" "}
                {countSel > 0 ? `- Seleccionados ${countSel}` : ""}
              </span>

              <button
                type="button"
                className="px-3 py-1 bg-red-600 text-white font-bold rounded-md"
                onClick={cerrarModal}
              >
                X
              </button>
            </div>

            {/* LISTA VERTICAL (SIN TABLA) */}
            <div className="p-2 overflow-auto max-h-[70vh]">
              {detConIdx.length === 0 ? (
                <div className="py-6 text-center font-bold text-gray-600">
                  Sin items para mostrar.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {detConIdx.map((it) => {
                    const peso = Number(it?.peso ?? 0);
                    const pesoOrig = Number(it?.peso_origina ?? 0);

                    return (
                      <div
                        key={it.__idx}
                        className="border border-gray-300 rounded-md overflow-hidden bg-white"
                      >
                        {/* Header del item */}
                        <div className="bg-sky-200 border-b border-gray-300 px-2 py-2 flex justify-between items-center">
                          <span className="font-bold uppercase text-xs">
                            ITEM PALLETS {String(it?.item ?? "")}
                          </span>
                        </div>

                        {/* Cuerpo vertical (USA it.*) */}
                        <div className="grid grid-cols-2">
                          <CabItem
                            label="#BULTO :"
                            value={String(it?.num_bulto ?? "--")}
                          />
                          <CabItem
                            right
                            label="#PESO(KG) :"
                            value={
                              Number.isFinite(peso) ? peso.toFixed(4) : "0.0000"
                            }
                          />

                          <CabItem
                            label="#FECH PRODUCCION :"
                            value={String(it?.fech_produ ?? "--")}
                          />
                          <CabItem
                            right
                            label="#TEMPLA :"
                            value={String(it?.cod_templa ?? "--")}
                          />

                          <CabItem
                            label="#TRAZA :"
                            value={String(it?.cod_traza ?? "--")}
                          />
                          <CabItem
                            right
                            label="#ARTICULO :"
                            value={String(it?.cod_articuli ?? "--")}
                          />
                          {/* DESCRIPCION  */}
                          <div className="col-span-2 border-t border-gray-300">
                            <div className="px-2 py-2 font-bold uppercase text-sm">
                              #DESCRIPCION ARTICULO :
                            </div>
                            <div className="px-2 py-2 text-center font-sans">
                              {String(it?.descripcion ?? "--")}
                            </div>
                          </div>

                          <CabItem
                            label="#CODIGO PLAN DIARIO :"
                            value={
                              it?.cod_parte && it.cod_parte.length > 0
                                ? String(it.cod_parte)
                                : "NO VINCULADO"
                            }
                          />
                          <CabItem
                            right
                            label="#TIPO MOV :"
                            value={String(it?.tipo_mov ?? "--")}
                          />

                          {/* DESCRIPCION PARTE full width */}
                          <div className="col-span-2 border-t border-gray-300">
                            <div className="px-2 py-2 font-bold uppercase text-sm">
                              #DESCRIPCION PLAN DIARIO :
                            </div>
                            <div className="px-2 py-2 text-center font-sans">
                              {it?.desc_parte && it.desc_parte.length > 0
                                ? String(it.desc_parte)
                                : "NO VINCULADO"}
                            </div>
                          </div>

                          <CabItem
                            right
                            label="#OT :"
                            value={
                              it?.ot && it.ot.length > 0
                                ? String(it.ot)
                                : "NO VINCULADO"
                            }
                          />

                          <CabItem
                            label="#NRO VALE :"
                            value={String(it?.nro_vale ?? "--")}
                          />
                          

                          {/* PESO_ORIG */}
                          <div className="col-span-2 border-t border-gray-300">
                            <div className="px-2 py-2 font-bold uppercase text-sm">
                              #PESO ORIGINAL :
                            </div>
                            <div className="px-2 py-2 text-center font-sans">
                              {Number.isFinite(pesoOrig)
                                ? pesoOrig.toFixed(4)
                                : String(it?.peso_origina ?? "0.0000")}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* footer */}
            <div className="flex justify-between items-center px-3 py-3 border-t border-gray-300">
              <div className="flex gap-2">
                {/* <button
                  type="button"
                  className="px-4 py-2 bg-red-600 text-white font-bold rounded-md"
                  onClick={cerrarModal}
                >
                  Salir
                </button> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CabItem({
  label,
  value,
  right = false,
}: {
  label: string;
  value: string;
  right?: boolean;
}) {
  return (
    <div
      className={`border-t border-gray-300 ${
        right ? "border-l border-gray-300" : ""
      }`}
    >
      <div className="px-2 py-2 font-bold uppercase text-sm">{label}</div>
      <div className="px-2 py-2 text-center font-sans">{value}</div>
    </div>
  );
}
