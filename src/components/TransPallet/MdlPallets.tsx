import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleLeft,
  faBoxesStacked,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { TransferPStore } from "../../stores/TranPalletStore";
import { useForm } from "react-hook-form";
import { formatearNumero, SwAlert } from "../../utils";
import { GetDataPallet, VerificarPallet } from "../../services/PalletService";
import { useNavigate } from "react-router";
import ErrorValid from "../ErrorValid";
import {
  dataItemTransP,
  detallePallet,
  GroupItemPalletsTransP,
  ItemPalletsMap,
} from "../../types";
//  -------------
import { agruparPorArticulo } from "../../utils/agrupador";

type Props = {
  changeVisibility: (valor:boolean)=>void;
};

type Form = {
  numPallet: string;
};

export default function MdlPallets({ changeVisibility }: Props) {
  const infoPalletO = TransferPStore((state) => state.infoPalletO);
  const setInfoPalletO = TransferPStore((state) => state.setInfoPalletO);
  const setInfoPalletD = TransferPStore((state) => state.setInfoPalletD);
  const setInfoArt = TransferPStore((state) => state.setInfoArt);
  const infoArt = TransferPStore((state) => state.infoArt);
  const setInfoDet = TransferPStore((state) => state.setInfoDet);

  const [step, setStep] = useState(1);
  const [transition, setTransition] = useState(100);

  const navigate = useNavigate();

  const almOrg = useRef<string>("");

  const {
    register,
    reset,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<Form>();

  const nextStep = async (pasos: number = 1) => {
    setTransition(100);

    const next = step + pasos;
    if (next > 2) {
      changeVisibility(false);
    }
    setStep(next);
  };

  const prevStep = () => {
    setTransition(-100);
    setStep(step - 1);
  };

  const recuperarFoco = () => {
    setFocus("numPallet");
  };

  const cancelarModal = () => {
    changeVisibility(false);
    navigate("/");
  };

  function obtenerCajasReales(
    // items: dataItemTransP[],
    items: ItemPalletsMap[],
    pesoUnd: number
  ): dataItemTransP[] {
    const resultado: dataItemTransP[] = [];
    const itemcopy = [...items]; // Sacamos una copia del arreglo original

    for (let i = 0; i < itemcopy.length; i++) {
      if (parseFloat(itemcopy[i].peso) === 0) continue; // SI EL ITEM ES PESO 0, SE OMITE

      const itemActual = { ...itemcopy[i] }; //Creamos una copia del item actual
      const pesoTotalActual = parseFloat(itemActual.peso); // Peso total que viene en el objeto
      const adicionalActual = parseFloat(itemActual.adicional); // Adicional que viene en el objeto

      // Asignamos el valor calculado de bultos y adicional
      itemActual.adicional = formatearNumero(adicionalActual);
      // Si el item tiene un adicional, intentamos tomar peso del siguiente item
      if (adicionalActual > 0 && i < itemcopy.length - 1) {
        let pesoAcumulado = parseFloat(itemActual.adicional);
        let indice = i + 1;

        let lotes = "";
        let trazas = "";
        let pesos = "";
        let fechas = "";
        let ots = "";

        while (
          indice < itemcopy.length &&
          pesoAcumulado + parseFloat(itemcopy[indice].peso) < pesoUnd
        ) {
          const pesosig = parseFloat(itemcopy[indice].peso);

          if (pesosig == 0) {
            indice++;
          } else {
            pesoAcumulado += parseFloat(itemcopy[indice].peso);

            const itemPrev = itemcopy[indice - 1];

            lotes +=
              itemPrev.lote === itemcopy[indice].lote
                ? ""
                : `|${itemcopy[indice].lote}`;

            trazas +=
              itemPrev.traza === itemcopy[indice].traza
                ? ""
                : `|${itemcopy[indice].traza}`;

            fechas +=
              itemPrev.fecha === itemcopy[indice].fecha
                ? ""
                : `|${itemcopy[indice].fecha}`;

            ots +=
              itemPrev.ot === itemcopy[indice].ot
                ? ""
                : `|${itemcopy[indice].ot}`;

            pesos += `|${itemcopy[indice].peso}`;
            indice++;
          }
        }

        const siguienteItem = { ...itemcopy[indice] };
        const pesoSiguiente = parseFloat(siguienteItem.peso);

        // Si el siguiente item tiene suficiente peso para cubrir el adicional
        if (pesoSiguiente >= pesoUnd - pesoAcumulado) {
          const itemCombinado: dataItemTransP = {
            codArt: itemActual.codArt,
            lote: itemActual.lote + lotes + "|" + siguienteItem.lote,
            traza: itemActual.traza + trazas + "|" + siguienteItem.traza,
            fecha: itemActual.fecha + fechas + "|" + siguienteItem.fecha,
            peso:
              itemActual.adicional +
              pesos +
              "|" +
              formatearNumero(pesoUnd - pesoAcumulado),
            ot: itemActual.ot + ots + "|" + siguienteItem.ot,
            adicional: "0",
            pesoUnd: pesoUnd.toString(),
          };

          // Ajustamos el item actual
          itemActual.peso = formatearNumero(pesoTotalActual - pesoAcumulado);
          itemActual.adicional = "0";

          // Ajustamos el siguiente item
          siguienteItem.peso = formatearNumero(
            pesoSiguiente - (pesoUnd - pesoAcumulado)
          );
          siguienteItem.adicional = formatearNumero(
            parseFloat(siguienteItem.peso) % pesoUnd
          );

          // Añadimos el item actual y el combinado
          resultado.push(itemActual);
          resultado.push(itemCombinado);

          // Actualizamos el siguiente item y lo añadimos
          itemcopy[indice] = siguienteItem;
        } else {
          // TEST
          const itemSaldo: dataItemTransP = {
            codArt: itemActual.codArt,
            lote: itemActual.lote + lotes,
            traza: itemActual.traza + trazas,
            fecha: itemActual.fecha + fechas,
            peso: '0' ,

            ot: itemActual.ot + ots,
            adicional: itemActual.adicional,
            pesoUnd: pesoUnd.toString(),
          };
          resultado.push(itemSaldo);
        }
      } else if (adicionalActual > 0 && i == itemcopy.length - 1) {
        itemActual.peso = formatearNumero(
          parseFloat(itemActual.peso) - parseFloat(itemActual.adicional)
        );

        const itemCombinado: dataItemTransP = {
          codArt: itemActual.codArt,
          lote: itemActual.lote,
          traza: itemActual.traza,
          fecha: itemActual.fecha,
          peso: "0",
          ot: itemActual.ot,
          adicional: formatearNumero(adicionalActual),
          pesoUnd: pesoUnd.toString(),
        };

        resultado.push(itemActual);
        resultado.push(itemCombinado);
      } else {
        // Si no tiene adicional, solo agregamos el item tal cual
        resultado.push(itemActual);
      }
    }

    return resultado.filter((result) => result.peso !== "0.0000");
  }

  const formOrigen = async (data: Form) => {
    console.log(data)
    const pallet = data["numPallet"].toUpperCase();
    console.log(pallet)
    const verPallet = {
      numPallet: pallet,
      operacion: "verificar",
    };
    const verificar = await VerificarPallet(verPallet);

    if (!verificar.result) {
      SwAlert.fire({
        icon: "error",
        title: "ERROR",
        text: "ERROR DESCONOCIDO",
        showConfirmButton: false,
        timer: 2500,
      });
      reset();
      return;
    }

    if (verificar.result === "error") {
      SwAlert.fire({
        icon: "error",
        title: "ERROR",
        text: verificar.message,
        showConfirmButton: false,
        timer: 2500,
      });
      reset();
      return;
    }

    almOrg.current = verificar.message.ubic;

    const dataPallet = {
      numPallet: pallet,
      iTmov: "",
      operacion: "dataPallet",
      articulo: infoArt ? infoArt.codigo : "",
    };
    const peticion = await GetDataPallet(dataPallet);

    //---------------- Validamos que exista informacion del pallet ----------------
    if (peticion.dataArticulo === null) {
      SwAlert.fire({
        icon: "warning",
        title: "ADVERTENCIA",
        text: "NO EXISTE INFORMACION DE PALLET",
        showConfirmButton: false,
        timer: 2500,
      });
      reset();
      return;
    }
    //---------------- Seteamos la informacion del articulo ----------------
    setInfoArt(peticion.dataArticulo);

    if (peticion.dataItems.length == 0) {
      SwAlert.fire({
        icon: "warning",
        title: "ADVERTENCIA",
        text: "NO HAY ARTICULOS DISPONIBLES PARA TRANSFERIR",
        showConfirmButton: false,
        timer: 2500,
      });
      reset();
      return;
    }

    const items: ItemPalletsMap[] = peticion.dataItems.map(
      (item: detallePallet) => ({
        codArt: item.codArt,
        adicional: item.adicional,
        lote: item.lote,
        traza: item.traza,
        fecha: item.fecha,
        peso: item.peso,
        ot: item.referencia?.nro,
        bultos: item.bultos,
        pesoUnd: item.pesoUnd,
      })
    );

    //---------------- Agrupamos los items por articulo ----------------
    const agrupado = agruparPorArticulo(items);
    console.log("DATA AGRUPADA ===>", agrupado);

    // const pesoUnd = parseFloat(peticion.dataArticulo.pesoUnd);
    // const cajasReales = obtenerCajasReales(items, pesoUnd);

    // const pesoUnd = parseFloat(peticion.dataArticulo.pesoUnd);
    /* const cajasReales = agrupado.map((item) => {
      return {
        [item.codArt]: obtenerCajasReales(item.items, parseFloat(item.pesoUnd)),
      };
    }); */

    const cajasReales: GroupItemPalletsTransP[] = [];

    agrupado.forEach((item) =>
      cajasReales.push({
        [item.codArt]: obtenerCajasReales(item.items, parseFloat(item.pesoUnd)),
      })
    );

    console.log(cajasReales);

    // ------------------- AGRUPAMIENTO  PALLET TRANSFERENCIA-------------------
    setInfoDet(cajasReales);
    /*  const grupos = agruparDataItemTransP(cajasReales, "codArt");
    const listaMapeada = mapearAgrupado(grupos);
    debugDataItemTransP(listaMapeada); */

    setInfoPalletO(pallet);
    reset();
    nextStep();

    // ------------------- FIN AGRUPAMIENTO  PALLET TRANSFERENCIA-------------------
  };

  const formDest = async (data: Form) => {
    const pallet = data["numPallet"].toUpperCase();

    if (infoPalletO === pallet) {
      SwAlert.fire({
        icon: "warning",
        //title: "warning",
        text: "PALLET DESTINO NO PUEDE SER IGUAL AL ORIGEN",
        showConfirmButton: false,
        timer: 2500,
      });
      reset();
      return;
    }

    const dataPallet = {
      numPallet: pallet,
      operacion: "verificar",
    };
    const peticion = await VerificarPallet(dataPallet);

    if (!peticion.result) {
      SwAlert.fire({
        icon: "error",
        title: "ERROR",
        text: "ERROR DESCONOCIDO",
        showConfirmButton: false,
        timer: 2500,
      });
      reset();
      return;
    }
    if (peticion.result === "error") {
      SwAlert.fire({
        icon: "error",
        title: "ERROR",
        text: peticion.message,
        showConfirmButton: false,
        timer: 2500,
      });
      reset();
      return;
    }

    if (peticion.message.ubic !== almOrg.current) {
      SwAlert.fire({
        icon: "error",
        title: "ERROR",
        text: "LOS PALLET DEBEN PERTENECER AL MISMO ALMACEN",
        showConfirmButton: false,
        timer: 2500,
      });
      reset();
      return;
    }

    setInfoPalletD(pallet);
    reset();
    nextStep();
  };

  useEffect(() => {
    recuperarFoco();
  }, []);

  return (
    <div className="fixed bg-gray-700 inset-1 bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-10">
      <motion.div
        className="w-11/12 md:w-2/3 lg:w-4/5 bg-white  justify-center items-center overflow-hidden"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          ease: "easeIn",
        }}
      >
        {/* CARD HEADER */}
        <div className="h-12 bg-orange-600 flex  items-center w-full justify-between">
          <h3 className="text-sm md:text-base text-white font-bold uppercase p-5 ">
            <FontAwesomeIcon icon={faBoxesStacked} className="mr-2" />
            transferencia entre pallet
          </h3>
          <button
            className="px-5 text-lg text-gray-600 font-extrabold"
            onClick={cancelarModal}
          >
            <FontAwesomeIcon icon={faTimes} size="xl" />
          </button>
        </div>
        {/* CARD BODY */}
        <div className="bg-white w-full p-3">
          {step > 1 && (
            <div className="">
              <button
                className=" py-2 rounded-md text-orange-500 uppercase text-sm md:text-base font-bold underline"
                onClick={prevStep}
              >
                <FontAwesomeIcon icon={faArrowAltCircleLeft} className="me-2" />
                regresar
              </button>
            </div>
          )}

          {step === 1 && (
            <motion.div
              className=""
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x: [transition, 0] }}
              transition={{
                duration: 0.4,
                ease: "easeIn",
              }}
            >
              <p className="uppercase font-bold mb-2">Scanee pallet origen</p>
              <form onSubmit={handleSubmit(formOrigen)} autoComplete="off">
                <div className="flex ">
                  <input
                    type="text"
                    className="h-10 border border-gray-300 rounded-lg w-full px-2 uppercase"
                    maxLength={10}
                    autoFocus
                    {...register("numPallet", {
                      pattern: {
                        value: /^[A-Za-z0-9]{2}\d{8}$/,
                        message: "NO CUMPLE CON EL FORMATO",
                      },
                    })}
                    onBlur={recuperarFoco}
                  />
                </div>
              </form>
              {errors.numPallet && (
                <ErrorValid
                  message={
                    errors.numPallet.message ? errors.numPallet.message : ""
                  }
                />
              )}
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              className=""
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x: [transition, 0] }}
              transition={{
                duration: 0.4,
                ease: "easeIn",
              }}
            >
              <p className="uppercase font-bold mb-2">Scanee pallet destino</p>
              <form onSubmit={handleSubmit(formDest)} autoComplete="off">
                <div className="flex ">
                  <input
                    type="text"
                    className="h-10 border border-gray-300 rounded-lg w-full px-2 uppercase"
                    maxLength={10}
                    autoFocus
                    {...register("numPallet", {
                      pattern: {
                        value: /^[Pp][Aa]\d{8}$/,
                        message: "NO CUMPLE CON EL FORMATO",
                      },
                    })}
                    onBlur={recuperarFoco}
                  />
                </div>
              </form>
              {errors.numPallet && (
                <ErrorValid
                  message={
                    errors.numPallet.message ? errors.numPallet.message : ""
                  }
                />
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
