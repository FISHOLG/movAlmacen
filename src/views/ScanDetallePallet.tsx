import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";


import { ObtenerDetallePallet } from "../services/PalletService";
import { SwAlert } from "../utils";
import DetallePallet, { DetallePalletData } from "../components/DetallePallet";

type Scan = {
  codigo: string;
};

export default function ScanDetallePallet() {
  const navigate = useNavigate();

  const [data, setData] = useState<DetallePalletData | null>(null);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [selMap, setSelMap] = useState<Record<string, boolean>>({});

  const { register, reset, handleSubmit, setFocus, watch, setValue } =
    useForm<Scan>({
      defaultValues: { codigo: "" },
    });

  function isPallet(codigo: string) {
    const regex = /^PA\d{8}$/;
    return regex.test(codigo);
  }

  const ReturnHome = () => navigate("/");

  const limpiarVista = () => {
    setShowModal(false);
    setSelMap({});
    setData(null);
    setLoading(false);
    reset({ codigo: "" });
    setValue("codigo", "");
    setTimeout(() => setFocus("codigo"), 50);
  };

  const keyOfItem = (it: any) => `${it?.item ?? ""}-${it?.cod_traza ?? ""}`;

  const detItems = useMemo(() => {
    return Array.isArray(data?.detalle) ? data!.detalle! : [];
  }, [data]);

  const enviarForm = async ({ codigo }: Scan) => {
    const pallet = String(codigo || "")
      .trim()
      .toUpperCase();

    // si ya se está mostrando data, no volver a consultar
    if (data?.cabecera?.num_pallet) return;

    if (!isPallet(pallet)) {
      SwAlert.fire({
        icon: "warning",
        text: "FORMATO INVALIDO",
        showConfirmButton: false,
        timer: 1500,
      });
      setValue("codigo", "");
      return;
    }

    try {
      setLoading(true);
      setData(null);

      const resp = await ObtenerDetallePallet({ numPallet: pallet });

      if (resp?.result === "error") {
        SwAlert.fire({
          icon: "warning",
          text: resp?.message || resp?.mensaje || "NO SE HA ENCONTRADO PALLET",
          showConfirmButton: false,
          timer: 1500,
        });

        setData(null);
        reset({ codigo: "" });
        setValue("codigo", "");
        setTimeout(() => setFocus("codigo"), 50);
        return;
      }

      if (resp?.result === "success" && resp?.data?.cabecera) {
        setData(resp.data as DetallePalletData);
        setSelMap({});
        setShowModal(false);
        reset({ codigo: "" });
        setValue("codigo", "");
        return;
      }

      SwAlert.fire({
        icon: "warning",
        text: "NO SE HA ENCONTRADO PALLET",
        showConfirmButton: false,
        timer: 1500,
      });

      setData(null);
      reset({ codigo: "" });
      setValue("codigo", "");
      setTimeout(() => setFocus("codigo"), 50);
    } catch (error: any) {
      SwAlert.fire({
        icon: "error",
        text: error?.message || "ERROR AL CONSULTAR",
        showConfirmButton: false,
        timer: 1500,
      });

      setData(null);
      reset({ codigo: "" });
      setValue("codigo", "");
      setTimeout(() => setFocus("codigo"), 50);
    } finally {
      setLoading(false);
    }
  };

  // foco solo si NO hay data
  useEffect(() => {
    if (!data) {
      setFocus("codigo");
    }
  }, [data, setFocus]);

  // auto-submit cuando llegue codigo valido
  const codigoWatch = watch("codigo");
  useEffect(() => {
    if (data) return;

    const v = String(codigoWatch || "")
      .trim()
      .toUpperCase();
    if (v.length === 10 && /^PA\d{8}$/.test(v)) {
      handleSubmit(enviarForm)();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codigoWatch, data]);

  const abrirModalItems = () => {
    if (!data) return;
    if (detItems.length === 0) {
      SwAlert.fire({
        icon: "warning",
        text: "Sin items para seleccionar",
        showConfirmButton: false,
        timer: 1200,
      });
      return;
    }

    // pre-cargar map (todos false)
    const map: Record<string, boolean> = {};
    detItems.forEach((it) => {
      map[keyOfItem(it)] = false;
    });
    setSelMap(map);
    setShowModal(true);
  };

  const cerrarModalItems = () => {
    setShowModal(false);
  };

  const confirmarAgregar = () => {
    const seleccionados = detItems.filter((it) => selMap[keyOfItem(it)]);

    if (seleccionados.length === 0) {
      SwAlert.fire({
        icon: "warning",
        text: "Seleccione al menos 1 item",
        showConfirmButton: false,
        timer: 1200,
      });
      return;
    }

    SwAlert.fire({
      icon: "success",
      text: `Agregados ${seleccionados.length} item(s)`,
      showConfirmButton: false,
      timer: 1200,
    });

    console.log("ITEMS SELECCIONADOS =>", seleccionados);

    // cerrar modal
    setShowModal(false);
  };

  return (
    <div id="contentScan" className="">
      {/* =================== SCAN (solo si NO hay data) =================== */}
      {!data && (
        <form onSubmit={handleSubmit(enviarForm)} autoComplete="off">
          <div className="px-2">
            <input
              type="text"
              className="h-8 w-full border border-gray-300 rounded-md px-2 text-xs md:text-base uppercase"
              placeholder="CODIGO DEL PALLET"
              maxLength={10}
              {...register("codigo", {
                required: "CODIGO QR VACIO!",
              })}
            />

            <span className="block uppercase text-center text-gray-400 text-xs md:text-base pt-1">
              {loading ? "cargando..." : "esperando codigo qr"}
            </span>

            <div id="spinQR"></div>
          </div>
        </form>
      )}

      {/* =================== DETALLE =================== */}
      {data && (
        <div className="px-2 mt-3">
          <DetallePallet
            data={data}
            onClose={limpiarVista}
            onAgregar={() => abrirModalItems()}
          />
        </div>
      )}

      {/* =================== BOTON CANCELAR SOLO CUANDO NO HAY DATA =================== */}
      {!data && (
        <div className="absolute bottom-3 w-full px-2">
          <button
            type="button"
            className="w-full py-2 uppercase bg-red-600 text-white text-xs md:text-base font-sans rounded-md"
            onClick={ReturnHome}
          >
            <FontAwesomeIcon icon={faTimes} className="me-2" size="lg" />
            cancelar escaneo
          </button>
        </div>
      )}

      {/* =================== MODAL ITEMS =================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2">
          <div className="bg-white w-full max-w-3xl rounded-md overflow-hidden border border-gray-300">
            {/* HEADER MODAL */}
           

            {/* BODY */}
            <div className="p-2 overflow-auto max-h-[70vh]">
              <div className="flex flex-col gap-3">
                {detItems.map((it, idx) => {
                  const peso = Number(it?.peso ?? 0);
                  const pesoOrig = Number(it?.peso_origina ?? 0);

                  return (
                    <div
                      key={idx}
                      className="border border-gray-300 rounded-md overflow-hidden bg-white"
                    >
                      {/* header card */}
                      <div className="bg-gray-100 border-b border-gray-300 px-2 py-2 flex justify-between items-center">
                        <span className="font-sans uppercase text-xs">
                          ITEM {String(it?.item ?? "")}
                        </span>

                      
                      </div>

                      {/* vertical layout sin scroll lateral */}
                      <div className="grid grid-cols-2">
                        <ModalItem
                          label="BULTO"
                          value={String(it?.num_bulto ?? "--")}
                        />

                        <ModalItem
                          label="PESO"
                          value={
                            Number.isFinite(peso)
                              ? peso.toFixed(4)
                              : String(it?.peso ?? "0.0000")
                          }
                        />

                        <ModalItem
                          label="FECH_PRODU"
                          value={String(it?.fech_produ ?? "--")}
                        />

                        <ModalItem
                          label="TEMPLA"
                          value={String(it?.cod_templa ?? "--")}
                        />

                        <ModalItem
                          label="TRAZA"
                          value={String(it?.cod_traza ?? "--")}
                        />

                        <ModalItem
                          label="ARTICULO"
                          value={String(it?.cod_articuli ?? "--")}
                        />

                        {/* DESCRIPCION full width */}
                        <div className="col-span-2 border-t border-gray-300">
                          <div className="px-2 py-2 font-bold uppercase text-sm">
                            DESCRIPCION
                          </div>
                          <div className="px-2 py-2 text-center font-sans">
                            {String(it?.descripcion ?? "--")}
                          </div>
                        </div>

                        {/* PESO_ORIG full width */}
                        <div className="col-span-2 border-t border-gray-300">
                          <div className="px-2 py-2 font-sans uppercase text-sm">
                            PESO_ORIG
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
            </div>

            {/* FOOTER MODAL (botonera chica y centrada) */}
            <div className="flex justify-center gap-4 p-3 border-t border-gray-300">
              <button
                type="button"
                className="bg-red-600 text-white font-sans px-6 py-2 rounded-md"
                onClick={cerrarModalItems}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>

              <button
                type="button"
                className="bg-orange-600 text-white font-sans px-6 py-2 rounded-md"
                onClick={confirmarAgregar}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Item estilo vertical como las otras vistas */
function ModalItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-gray-300">
      <div className="px-2 py-2 font-sans uppercase text-sm">{label}</div>
      <div className="px-2 py-2 text-center font-sans">{value}</div>
    </div>
  );
}
