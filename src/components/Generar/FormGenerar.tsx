import { useEffect, useRef, useState } from "react";
import { ValeStore } from "../../stores/ValeStore";
import { FechaHora, generarID, loadingSave, SwAlert } from "../../utils";
import DetGenerar from "./DetGenerar";
import { dataFormVale, dataSaveValeMultiple, referUnidas } from "../../types";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { GuardarVale } from "../../services/ValeService";
import { AuthStore } from "../../stores/AuthStore";
import MdlDetSalida from "./MdlDetSalida";
import MdlScanPallet from "./MdlScanPallet";
import { AsigStore } from "../../stores/AsigStore";
import MdlAsigRack from "../Transferencia/MdlAsigRack";
import { AsignarRack } from "../../services/almacenService";
import { getParteProduccionActiva } from "../../services/ParteProdService"; // ---- agregue aqui
import ErrorValid from "../ErrorValid";

export default function FormGenerar() {
  const [dateServ, setDateServ] = useState("");
  const [vMdlSalida, vSetVMdlSalida] = useState(false);
  const [vMdlPallet, vSetVMdlPallet] = useState(false);

  const [visibilityMdlAsig, setVisibilityMdlAsig] = useState(false);
  const [listParte, setListParte] = useState([]); // ---- agregue aqui
  const ubicRef = useRef<HTMLInputElement>(null);

  const palletRef = useRef<string>("");

  const segundosRef = useRef<string>("00");

  const authData = AuthStore((state) => state.auth);

  const infoPallet = ValeStore((state) => state.infoPallet);
  const tipoMov = ValeStore((state) => state.tipoMov);
  const infoArt = ValeStore((state) => state.infoArt);
  const infoDet = ValeStore((state) => state.infoDet); //--- items
  const infoRefer = ValeStore((state) => state.infoRefer);
  const matriz = ValeStore((state) => state.matriz);
  const dropAll = ValeStore((state) => state.dropAll);

  const ubicacion = AsigStore((state) => state.ubicacion);
  const clearAsig = AsigStore((state) => state.clearAsig);

  const {
    register,
    setFocus,
    setValue,
    control,
    handleSubmit,
    reset,
    unregister,
    formState: { errors },
  } = useForm<dataFormVale>();

  const idForm = generarID();

  const changeVMdlSalida = () => {
    vSetVMdlSalida(!vMdlSalida);
  };

  const changeVMdlPallet = () => {
    vSetVMdlPallet(!vMdlPallet);
  };

  const changeVisibilityAsig = () => {
    setVisibilityMdlAsig(!visibilityMdlAsig);
  };

  const obtenerHora = async () => {
    const hora = await FechaHora();
    segundosRef.current = hora.slice(-2);
    // console.log(segundosRef.current);
    setDateServ(hora);
    setValue("fechaReg", hora);
  };

  const Cancelar = () => {
    dropAll();
  };

  const agruparPorReferencia = (data: dataFormVale) => {
    const referenciasAgrupadas: referUnidas[] = [];

    // Iteramos sobre cada detalle
    data.detalles.forEach((detalle) => {
      if (!detalle.referencia) return;
      const nroReferencia = detalle.referencia?.nro;

      let referenciaExistente = referenciasAgrupadas.find(
        (ref) => ref.nro === nroReferencia
      );

      if (!referenciaExistente && referenciaExistente == undefined) {
        // Si no existe, la creamos y la añadimos
        referenciaExistente = {
          tipo: detalle.referencia?.tipo,
          nro: nroReferencia,
          almacen: detalle.referencia.almacen,
          detalles: [],
        };
        referenciasAgrupadas.push(referenciaExistente);
      }
      if (referenciaExistente !== undefined) {
        referenciaExistente.detalles.push({
          codArt: detalle.codArt,
          item: detalle.item,
          peso: detalle.peso,
          lote: detalle.lote,
          traza: detalle.traza,
          matriz: matriz,
          referencia: detalle.referencia,
          //pesoUnd: detalle.pesoUnd,
          numPallet: detalle.numPallet,
        });
      }
    });

    return referenciasAgrupadas;
  };

  const enviarForm = async (data: dataFormVale) => {
    try {
      if (ubicRef.current && ubicRef.current.value === "") {
        throw new Error("DEBE SELECCIONAR LA NUEVA UBICACIÓN");
      }

      const referencias = agruparPorReferencia(data);

      const { value: formValues } = await SwAlert.fire({
        html: `
        <h3 class='font-bold pb-3'>INFORMACION OPCIONAL</h3>
        <div class="flex flex-col uppercase gap-2 my-3 text-sm md:text-base">
          <p class="block font-semibold w-full">Recepcionado Por</p>
          <input type="text" id="recepcionado"  class="h-10 px-2 rounded-md border border-gray-300 w-full" placeholder="" autocomplete="off">
        </div>
        <div class="flex flex-col uppercase gap-2 my-3 text-sm md:text-base">
          <p class="block font-semibold">Observaciones</p>
          <textarea type="text" id="observaciones" class="h-16 p-2 rounded-md border border-gray-300 w-full" placeholder="" autocomplete="off"></textarea>

        </div>

        `,
        confirmButtonText: "CONTINUAR",
        focusConfirm: false,
        preConfirm: () => {
          const recepcionado = document.getElementById(
            "recepcionado"
          ) as HTMLInputElement;
          const observaciones = document.getElementById(
            "observaciones"
          ) as HTMLInputElement;

          return {
            recepcionado: recepcionado.value,
            observaciones: observaciones.value,
          };
        },
      });

      const datos: dataSaveValeMultiple = {
        fechaReg: data.fechaReg,
        tMov: data.tMov,
        idForm: data.idForm,
        referencias: referencias,
        observaciones: formValues["observaciones"],
        recepcionado: formValues["recepcionado"],
        operacion: "saveVale",
        usuario: authData.usuario,
        numPallet: infoPallet[0],
        codParte: data.codParte ?? "",
      };

      const saveAlert = await SwAlert.fire({
        title: "¿GUARDAR?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "CONFIRMAR",
        cancelButtonText: "CANCELAR",
      });

      if (!saveAlert.isConfirmed) return;

      loadingSave();

      console.log(datos);
      // return; ---- PRUEBA

      const peticion = await GuardarVale(datos);

      if (!peticion.result) {
        throw new Error("ERROR DESCONOCIDO AL GENERAR VALE");
      }

      if (peticion.result === "error") {
        throw new Error(peticion.message);
      }

      const vales: string = peticion.message.join("|");

      if (ubicRef.current) {
        const dataAsig = {
          codigo: ubicacion.codigo,
          pallet: infoPallet[0].toUpperCase(),
          operacion: "asignarRack",
          valeI: vales,
          valeS: "",
          multi: "",
        };

        const ubicar = await AsignarRack(dataAsig);

        if (!ubicar.result) {
          await SwAlert.fire({
            icon: "error",
            title: "NO SE HA REALIZADO LA OPERACIÓN",
            text: "ERROR DESCONOCIDO AL ASIGNAR UBICACION",
            showConfirmButton: false,
            timer: 2500,
          });
        }

        if (ubicar.result == "error") {
          await SwAlert.fire({
            icon: "warning",
            title: "NO SE HA ASIGNADO LA UBICACIÓN",
            text: ubicar["message"],
            showConfirmButton: true,
            confirmButtonText: "CONTINUAR",
          });
        }
      }

      /*if (
        tipoMov &&
        tipoMov.codigo.substring(0, 1) == "S" &&
        tipoMov.clase === "C"
      ) {
        const liberar = await LiberarPallet({ pallet: infoPallet[0] });

        if (!liberar.result) {
          await SwAlert.fire({
            icon: "error",
            title: "NO SE HA REALIZADO LA OPERACIÓN",
            text: "ERROR DESCONOCIDO AL DESASIGNAR UBICACION",
            showConfirmButton: false,
            timer: 2500,
          });
        }

        if (liberar.result == "error") {
          await SwAlert.fire({
            icon: "warning",
            title: "NO SE HA DESASIGNADO LA UBICACIÓN",
            text: liberar["message"],
            showConfirmButton: true,
            confirmButtonText: "CONTINUAR",
          });
        }
      }*/

      await SwAlert.fire({
        icon: "success",
        title: "OPERACIÓN EXITOSA",
        text: `N° VALES: ${vales}`,
        showConfirmButton: true,
        confirmButtonText: "CONTINUAR",
      });

      reset();
      dropAll();
    } catch (error: any) {
      SwAlert.fire({
        icon: "warning",
        title: "ADVERTENCIA",
        text: error.message,
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };

  useEffect(() => {
    if (
      infoPallet.length > 0 &&
      infoDet?.length == 0 &&
      tipoMov?.codigo.substring(0, 1) === "I"
    ) {
      SwAlert.fire({
        icon: "warning",
        title: "ADVERTENCIA",
        text: "NO HAY ARTICULOS DISPONIBLES PARA INGRESO",
        showConfirmButton: false,
        timer: 2500,
      });
      dropAll();
      return;
    }

    obtenerHora();
    clearAsig();
    palletRef.current = "";
  }, []);

  useEffect(() => {
    palletRef.current = "";
  }, [infoDet]);
  // -------------------- AGREGUE AQUI ----------------------
  const [mostrarParte, setMostrarParte] = useState(false);

  useEffect(() => {
    const validarParte = async () => {
      if (!infoRefer) {
        setMostrarParte(false);
        setListParte([]);
        return;
      }
      const tSalida = tipoMov?.codigo?.startsWith("S");
      const tOT = infoRefer.tipo === "OT";
      const tProdPA = parseFloat(infoRefer.ot_tipo??"0") >0;

      if (!tSalida || !tOT || !tProdPA) {
        setMostrarParte(false);
        setListParte([]);

        // SwAlert.fire({
        //   icon: "warning",
        //   title: "ADVERTENCIA",
        //   text: "NO SE SOLICITA PARTE DE PRODUCCION",
        //   showConfirmButton: false,
        //   timer: 2000,
        // });

        return;
      }

      const resp = await getParteProduccionActiva();

      setMostrarParte(true);
      setListParte(resp.list ?? []);
    };

    validarParte();
  }, [infoRefer, tipoMov]);
  // ----------------- FIN  AGREGUE AQUI -----------------

  return (
    <>
      {vMdlSalida && <MdlDetSalida changeVMdlSalida={changeVMdlSalida} />}
      {vMdlPallet && <MdlScanPallet changeVMdlPallet={changeVMdlPallet} />}
      {visibilityMdlAsig && (
        <MdlAsigRack changeVisibilityAsig={changeVisibilityAsig} />
      )}
      <div className="px-2">
        <form onSubmit={handleSubmit(enviarForm)} autoComplete="off">
          <div id="formContainer">
            <div
              id="cabecera"
              className="flex flex-wrap gap-6  text-xs md:text-base"
            >
              {/* Cabecera */}
              <div className="grow">
                <label className="block font-semibold mb-1 uppercase">
                  Fecha Registro
                </label>
                <input
                  type="datetime-local"
                  className="h-8 border-b border-b-gray-300 text-center w-full"
                  defaultValue={dateServ}
                  readOnly
                  step="1"
                  {...register("fechaReg", {
                    onChange: (e) => {
                      const valor = e.target.value; // Ej: "2025-10-31T10:45:15"

                      const fecha = new Date(valor);

                      // Aplica los segundos adicionales
                      fecha.setSeconds(
                        fecha.getSeconds() + parseInt(segundosRef.current)
                      );

                      // Ajuste para evitar el desfase de zona horaria (UTC-5)
                      fecha.setHours(fecha.getHours() - 5);

                      // Formatear la fecha correctamente sin perder la hora local
                      const nuevaFecha = fecha
                        .toISOString()
                        .slice(0, 19)
                        .replace("T", " ");

                      // Muestra por consola
                      console.log("Valor original:", valor);
                      console.log("Fecha ajustada local:", nuevaFecha);
                      // alert(nuevaFecha);

                      // Actualiza el valor dentro del formulario
                      setValue("fechaReg", nuevaFecha);
                    },
                  })}
                />
              </div>
              <div className="grow">
                <label className="block  font-semibold mb-1 uppercase">
                  tipo movimiento
                </label>
                <input
                  type="text"
                  className="h-8 border-b border-b-gray-300 text-center w-full"
                  readOnly
                  defaultValue={tipoMov?.codigo}
                  {...register("tMov")}
                />
              </div>

              {/*  */}
              <div className="w-28">
                <label className="block font-semibold mb-1 uppercase">
                  CODIGO ART
                </label>
                <input
                  type="text"
                  className="h-8 border-b border-b-gray-300 text-center w-full"
                  defaultValue={infoArt?.codigo}
                  readOnly
                />
              </div>
              <div className="grow">
                <label className="block  font-semibold mb-1 uppercase">
                  ARTICULO
                </label>
                <input
                  type="text"
                  className="h-8 border-b border-b-gray-300 text-center w-full"
                  readOnly
                  defaultValue={infoArt?.desc}
                />

                <input
                  type="text"
                  {...register("idForm")}
                  defaultValue={idForm}
                  readOnly
                  className="hidden"
                />
              </div>
             

              {mostrarParte && (
                <div className="w-full ">
                  <label className="block  font-semibold mb-1 uppercase ">
                    PLAN DE PRODUCCION
                  </label>

                  <select
                    className="h-8 border-b border-b-gray-300 text-center w-full"
                    {...register("codParte", {
                      required: {
                        value: true,
                        message: "Seleccione un plan de produccion",
                      },
                    })}
                  >
                    <option value="">SELECCIONE</option>
                    {listParte.map((item: any, i: number) => (
                      <option key={i} value={item.CODIGO}>
                        {item.ESPECIE} - {item.DESCRIPCION}
                      </option>
                    ))}
                  </select>
                  {errors.codParte && (
                    <ErrorValid message={errors.codParte.message} />
                  )}
                </div>
              )}
            
            </div>

            {/* SOLO MOSTRAR LA UBICACION EN CASO DE I03 */}
            {tipoMov &&
              tipoMov.codigo.substring(0, 1) === "I" &&
              tipoMov.clase == "T" && (
                <div className="flex gap-2 justify-between mb-2 flex-col">
                  <p className="font-bold uppercase">escoja nueva Ubicacion</p>
                  <div className="flex ">
                    <input
                      ref={ubicRef}
                      className="w-full h-8 border border-gray-300 rounded-l-md text-center pe-1"
                      type="text"
                      readOnly
                      value={ubicacion.codigo ? ubicacion.codigo : ""}
                    />
                    <span
                      className="w-16 text-center content-center bg-gray-400 text-white py-1 rounded-r-md"
                      onClick={() => changeVisibilityAsig()}
                    >
                      <FontAwesomeIcon icon={faPlus} size="lg" />
                    </span>
                  </div>
                </div>
              )}

            <div id="detallesVale" className="pt-2">
              {infoDet &&
                infoDet.length > 0 &&
                infoDet.map((detalle, index) => {
                  // Verificar si numPallet es diferente de PalletActual
                  if (
                    detalle.numPallet &&
                    detalle.numPallet != palletRef.current
                  ) {
                    palletRef.current = detalle.numPallet;

                    return (
                      detalle.visible && (
                        <>
                          <div
                            key={`div-${index}`}
                            className="bg-blue-500 p-2 text-white text-center font-bold"
                          >
                            <p> {detalle.numPallet}</p>
                          </div>
                          <DetGenerar
                            key={index}
                            detalle={detalle}
                            matriz={matriz}
                            setFocus={setFocus}
                            setValue={setValue}
                            control={control}
                            // CalcularTotales={CalcularTotales}
                            unregister={unregister}
                            index={index}
                            errors={errors}
                          />
                        </>
                      )
                    );
                  } else if (
                    detalle.numPallet &&
                    detalle.numPallet == palletRef.current &&
                    index == 0
                  ) {
                    palletRef.current = detalle.numPallet;

                    return (
                      detalle.visible && (
                        <>
                          <div
                            key={`div-${index}`}
                            className="bg-blue-500 p-2 text-white text-center font-bold"
                          >
                            <p> {detalle.numPallet}</p>
                          </div>
                          <DetGenerar
                            key={index}
                            detalle={detalle}
                            matriz={matriz}
                            setFocus={setFocus}
                            setValue={setValue}
                            control={control}
                            // CalcularTotales={CalcularTotales}
                            unregister={unregister}
                            index={index}
                            errors={errors}
                          />
                        </>
                      )
                    );
                  }

                  return (
                    detalle.visible && (
                      <DetGenerar
                        key={index}
                        detalle={detalle}
                        matriz={matriz}
                        setFocus={setFocus}
                        setValue={setValue}
                        control={control}
                        // CalcularTotales={CalcularTotales}
                        unregister={unregister}
                        index={index}
                        errors={errors}
                      />
                    )
                  );
                })}
            </div>
            <div className="flex py-3">
              <button
                type="button"
                className="w-1/2 text-white text-center bg-red-600 py-2 rounded-l-md"
                onClick={Cancelar}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>

              {infoPallet.length === 0 ||
                (infoPallet.length > 0 && tipoMov?.clase == "V" && (
                  <button
                    type="button"
                    className="w-1/2 text-white text-center bg-orange-600 py-2 "
                    onClick={changeVMdlPallet}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                ))}

              {infoPallet.length === 0 ||
                (infoPallet.length > 0 &&
                  tipoMov?.codigo.substring(0, 1) == "S" &&
                  tipoMov.clase != "V" && (
                    <button
                      type="button"
                      className="w-1/2 text-white text-center bg-orange-600 py-2 "
                      onClick={changeVMdlSalida}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  ))}

              <button
                type="submit"
                className="w-1/2 text-white text-center bg-sky-600 py-2 rounded-r-md"
              >
                <FontAwesomeIcon icon={faSave} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
