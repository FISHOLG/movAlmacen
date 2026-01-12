import { useEffect, useRef, useState } from "react";
import { TransferStore } from "../../stores/TransferStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import MdlScanPallet from "./MdlScanPallet";
import MdlItemsAlm from "./MdlItemsAlm";
import { dataFormTransfer } from "../../types";
import { useForm } from "react-hook-form";
import DetTransfer from "./DetTransfer";
import {
  aleatorioEntero,
  FechaHora,
  generarID,
  loadingSave,
  SwAlert,
} from "../../utils";
import { AuthStore } from "../../stores/AuthStore";
import { GuardarOtr } from "../../services/TransferService";
import { useNavigate } from "react-router";
import { AsigStore } from "../../stores/AsigStore";
import { AsignarRack } from "../../services/almacenService";

type Props = {
  changeVisibilityAsig: Function;
};

export default function FormTransfer({ changeVisibilityAsig }: Props) {
  const almOrg = TransferStore((state) => state.almOrg);
  const almDest = TransferStore((state) => state.almDest);
  const infoDet = TransferStore((state) => state.infoDet);
  const infoArt = TransferStore((state) => state.infoArt);
  const infoPallet = TransferStore((state) => state.infoPallet);
  const setInfoDet = TransferStore((state) => state.setInfoDet);

  const ubicacion = AsigStore((state) => state.ubicacion);
  const clearAsig = AsigStore((state) => state.clearAsig);
  // const dropAll = TransferStore((state) => state.dropAll);

  const authData = AuthStore((state) => state.auth);

  const idFormS = generarID();
  const idFormI = generarID();

  const [dateServ, setDateServ] = useState("");

  const [vMdlPallet, setVMdlPallet] = useState(false);
  const [vMdlItems, setVMdlItems] = useState(false);

  const [multi, setMulti] = useState(false);
  const ubicRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    unregister,
    formState: { errors },
  } = useForm<dataFormTransfer>();

  const changeVisiPallet = () => {
    setVMdlPallet(!vMdlPallet);
  };

  const changeVisiItems = () => {
    setVMdlItems(!vMdlItems);
  };

  const obtenerHora = async () => {
    const hora = await FechaHora();
    setDateServ(hora);
    setValue("fechaReg", hora);
  };

  /* const handleMulti = () => {
    setMulti(!multi);
  }; */

  useEffect(() => {
    obtenerHora();
  }, []);

  useEffect(() => {
    if (infoDet?.length == 0) {
      clearAsig();
    }
  }, [infoDet]);

  const enviarForm = async (data: dataFormTransfer) => {
    try {
      if (ubicRef.current && ubicRef.current.value.trim().length == 0) {
        throw new Error("DEBE SELECCIONAR UBICACIÓN DEL PALLET");
      }

      const datos = {
        ...data,
        operacion: "saveOTR",
        usuario: authData.usuario,
        pallet: infoPallet ? infoPallet.toUpperCase() : "",
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

      /* console.log(datos);
      return; */

      const peticion = await GuardarOtr(datos);

      if (!peticion.result) {
        throw new Error("ERROR DESCONOCIDO");
      }

      if (peticion.result == "error") {
        throw new Error(peticion.message);
      }

      if (infoPallet.length > 0) {
        const dataAsig = {
          codigo: ubicacion.codigo,
          pallet: infoPallet ? infoPallet.toUpperCase() : "",
          operacion: "asignarRack",
          valeI: peticion["vales"][1],
          valeS: peticion["vales"][0],
          multi: multi ? "1" : "0",
          usuario: authData.usuario,
        };

        const ubicar = await AsignarRack(dataAsig);

        if (!ubicar.result) {
          throw new Error("ERROR DESCONOCIDO AL ASIGNAR UBICACIÓN");
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

      await SwAlert.fire({
        icon: "success",
        title: "OPERACIÓN EXITOSA",
        text: `${peticion.message}`,
        showConfirmButton: true,
        confirmButtonText: "CONTINUAR",
      });

      reset();
      navigate("/");
    } catch (error: any) {
      SwAlert.fire({
        icon: "error",
        title: "NO SE HA REALIZADO LA OPERACIÓN",
        text: error.message,
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };

  const Cancelar = () => {
    navigate("/");
  };

  const addItem = () => {
    const item = aleatorioEntero(20000);

    const newdetalle = {
      visible: true,
      codArt: infoArt ? infoArt.codigo : "",
      item: item,
      bultos: "",
      peso: "",
      lote: "",
      traza: "",
      adicional: "",
    };
    if (infoDet) {
      const dataDet = [...infoDet, newdetalle];
      setInfoDet(dataDet);
    }
  };

  useEffect(() => {
    if (ubicacion.estado === "1") setMulti(true);
  }, [ubicacion.estado]);

  return (
    <>
      {vMdlPallet && <MdlScanPallet changeVisiPallet={changeVisiPallet} />}
      {vMdlItems && <MdlItemsAlm changeVisiItems={changeVisiItems} />}
      <div className="px-2 text-sm md:text-base">
        <form onSubmit={handleSubmit(enviarForm)} autoComplete="off">
          <div className="flex flex-col mb-2">
            <span className="block w-full font-bold uppercase mb-2">
              Fecha de Registro
            </span>
            <input
              type="datetime-local"
              className="h-8 px-2 text-center border border-gray-300 rounded-md w-full"
              defaultValue={dateServ}
              readOnly
              {...register("fechaReg")}
            />
            <input
              type="text"
              {...register("idFormS")}
              defaultValue={idFormS}
              readOnly
              className="hidden"
            />
            <input
              type="text"
              {...register("idFormI")}
              defaultValue={idFormI}
              readOnly
              className="hidden"
            />
          </div>
          <div className="flex gap-2 justify-between mb-2">
            <div className="">
              <p className="font-bold uppercase">almacen origen</p>
              <input
                type="text"
                className="w-full h-8 text-center border border-gray-300 rounded-md"
                value={almOrg?.codigo}
                readOnly
                {...register("almOrg")}
              />
            </div>
            <div className="">
              <p className="font-bold uppercase">almacen destino</p>
              <input
                type="text"
                className="w-full h-8 text-center border border-gray-300 rounded-md"
                value={almDest?.codigo}
                readOnly
                {...register("almDest")}
              />
            </div>
          </div>

          {infoPallet.length > 0 && almDest?.almacen != "" && (
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
              {/*  <div className="flex gap-x-2 align-middle uppercase text-xs font-semibold ">
                <input
                  type="checkbox"
                  className=" text-orange-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  checked={multi}
                  onChange={handleMulti}
                  disabled={ubicacion.estado != "2"}
                />
                <label htmlFor="">ubicacion sea de uso multiple</label>
              </div> */}
            </div>
          )}

          <div className="flex flex-col">
            <p className="font-bold uppercase">observaciones</p>
            <textarea
              className="w-full h-12 p-2  border border-gray-300 rounded-md"
              {...register("observaciones")}
            ></textarea>
          </div>
          {!infoDet ||
            (infoDet.length == 0 && (
              <div className="flex mt-2">
                {almOrg && almOrg.codigo == "ALPRTE" && (
                  <div className="flex-grow">
                    <button
                      type="button"
                      className="bg-orange-600 p-2 uppercase text-white font-bold w-full border border-orange-600 rounded-l-md"
                      onClick={changeVisiItems}
                    >
                      <FontAwesomeIcon icon={faPlus} className="me-2" />
                      Item almacen
                    </button>
                  </div>
                )}

                {almOrg && almOrg.codigo !== "ALPRTE" && (
                  <div className="flex-grow">
                    <button
                      type="button"
                      className="bg-cyan-600 p-2 uppercase text-white font-bold w-full border border-cyan-600 rounded-r-md"
                      onClick={changeVisiPallet}
                    >
                      <FontAwesomeIcon icon={faPlus} className="me-2" />
                      Pallet
                    </button>
                  </div>
                )}
              </div>
            ))}

          <div id="transferDet" className="flex flex-col">
            {infoDet &&
              infoDet.length > 0 &&
              infoDet.map(
                (detalle, index) =>
                  detalle.visible && (
                    <DetTransfer
                      key={index}
                      detalle={detalle}
                      setValue={setValue}
                      control={control}
                      index={index}
                      unregister={unregister}
                      errors={errors}
                    />
                  )
              )}
          </div>

          {infoDet && infoDet.length > 0 && (
            <div className="flex my-2">
              <div className="w-1/2">
                <button
                  type="button"
                  className="bg-red-600 p-2 uppercase text-white font-bold w-full border border-red-600 rounded-l-md"
                  onClick={Cancelar}
                >
                  <FontAwesomeIcon icon={faTimes} className="me-2" />
                </button>
              </div>
              {infoPallet.length === 0 && (
                <div className="w-1/2">
                  <button
                    type="button"
                    className="bg-cyan-600 p-2 uppercase text-white font-bold w-full border border-cyan-600 "
                    onClick={addItem}
                  >
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                  </button>
                </div>
              )}

              <div className="w-1/2">
                <button
                  type="submit"
                  className="bg-orange-600 p-2 uppercase text-white font-bold w-full border border-orange-600 rounded-r-md"
                >
                  <FontAwesomeIcon icon={faSave} className="me-2" />
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  );
}
