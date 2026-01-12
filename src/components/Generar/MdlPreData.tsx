import {
  faArrowAltCircleLeft,
  faBoxesStacked,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { ValeStore } from "../../stores/ValeStore";
import { useEffect, useState } from "react";
import {
  AlmacenesUbic,
  ListarMatrices,
  ListarMovimientos,
} from "../../services/almacenService";
import {
  GetDataPallet,
  //ObtenerCantArticulos,
} from "../../services/PalletService";
import {
  almBD,
  detallePallet,
  /* Infoarticulo,*/ referencia,
  tMovType,
} from "../../types";
import { GetOtDisp } from "../../services/otService";
import { aleatorioEntero, SwAlert } from "../../utils";
import { TransferStore } from "../../stores/TransferStore";

type mtz = {
  codigo: string;
  desc: string;
};

type Props = {
  changeVisibility: (valor:boolean)=>void;
};

export default function MdlPreData({ changeVisibility }: Props) {
  const infoArt = ValeStore((state) => state.infoArt);
  const infoPallet = ValeStore((state) => state.infoPallet);
  const infoRefer = ValeStore((state) => state.infoRefer);

  const setTipoMov = ValeStore((state) => state.setTipoMov);
  //const setInfoArt = ValeStore((state) => state.setInfoArt);
  const setInfoDet = ValeStore((state) => state.setInfoDet);
  const setDet = ValeStore((state) => state.setDet);
  const setMtz = ValeStore((state) => state.setMtz);
  const setRefer = ValeStore((state) => state.setRefer);
  const dropAll = ValeStore((state) => state.dropAll);

  const setDest = TransferStore((state) => state.setDest);

  const paneles = 4;

  const [step, setStep] = useState(1);
  const [transition, setTransition] = useState(100);
  const [tmov, setTMov] = useState("");
  const [movimientos, setMovimientos] = useState<tMovType[]>([]);
  const [movSel, setMovSel] = useState("");
  const [matrices, setMatrices] = useState<mtz[]>([]);
  const [otsDisp, setOtsDisp] = useState<referencia[]>([]);

  const nextStep = async (pasos: number = 1) => {
    setTransition(100);
    const next = step + pasos;
    if (next > paneles) {
      if (infoPallet.length === 0) {
        addItemVacio();
      }
      changeVisibility(false);
    }

    if (next == 3) {
      const tipoMov = tmov + movSel;
      const data = {
        codigo: infoArt ? infoArt.codigo : "",
        tMov: tipoMov,
        operacion: "searchOt",
        nroDoc: infoRefer ? infoRefer.nro : "",
      };
      console.log(data);
      const peticion = await GetOtDisp(data);
      if (peticion.result === "error") {
        await SwAlert.fire({
          text: peticion.message,
          icon: "warning",
          showConfirmButton: false,
          timer: 2500,
        });

        return;
      }
      setOtsDisp(peticion);
    } else if (next == 4) {
      const tipoMov = tmov + movSel;
      const data = {
        articulo: infoArt ? infoArt.codigo : "",
        tmov: tipoMov,
        operacion: "listarMtz",
      };
      const peticion = await ListarMatrices(data);
      setMatrices(peticion);
    }
    setStep(next);
  };

  const prevStep = (pasos: number = 1) => {
    setTransition(-100);
    if (step == 4 && infoPallet.length === 0 && tmov == "I") {
      pasos = 2;
    }
    setStep(step - pasos);
  };

  const addItemVacio = () => {
    if (!infoArt || !infoRefer) return;
    const item = aleatorioEntero(200);
    const newDetalle = {
      visible: true,
      codArt: infoArt.codigo,
      item: item.toString(),
      bultos: "",
      peso: "",
      lote: "",
      traza: "",
      adicional: "",
      numPallet: "",
      referencia: infoRefer,
      //pesoUnd: infoArt.pesoUnd,
    };
    setDet(newDetalle);
  };

  const cancelarModal = () => {
    dropAll();
    changeVisibility(false);
  };

  const changeMov = (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => {
    let valor = e.target.value;
    if (e.target.type === "text") {
      valor = tmov + valor;
    }

    setMovSel(valor.substring(1));
  };

  const asigTMov = async (tmov: string) => {
    setTMov(tmov);
    const data = { tmov, operacion: "listarMov" };
    const movs = await ListarMovimientos(data);
    setMovimientos(movs);
    nextStep();
  };

  const asigMov = async () => {
    if (movSel == "" || movSel === null || movSel === "NA") {
      await SwAlert.fire({
        text: "ESCOJA UN MOVIMIENTO",
        icon: "warning",
        showConfirmButton: false,
        timer: 2500,
      });

      return;
    }

    const tipoMov = tmov + movSel;
    const selectMov = movimientos.find((mov) => mov.codigo === tipoMov);
    if (!selectMov) throw new Error("No se encontro tipo Mov");
    setTipoMov(selectMov);

    let salto = 1;

    if (infoPallet.length > 0) {
      salto = tmov === "I" && movSel != "03" ? 2 : 1;

      /*  const listArticulos = await ObtenerCantArticulos({
        numPallet: infoPallet[0],
      });
      const listData: Infoarticulo[] = listArticulos.data;

      if (listData.length > 1) {
        const opciones = listData.map((art) => `${art.codigo}`);

        const { value: dataArt } = await SwAlert.fire({
          title: "SELECCIONE EL ARTICULO",
          input: "radio",
          confirmButtonText: "Seleccionar",
          inputOptions: opciones,
          inputValidator: (value) => {
            if (!value) {
              return "Escoja una opción";
            }
          },
        });

        setInfoArt(listData[dataArt]);
      } */
    }

    nextStep(salto);
  };

  const asignOt = async (ot: referencia) => {
    setRefer(ot);
    nextStep();
  };

  const asignMtz = async (matriz: string) => {
    setMtz(matriz);
    // console.log(ot);
    await obtenerDataPallet();

    nextStep();
  };

  const obtenerDataPallet = async () => {
    const dataPallet = {
      numPallet: infoPallet[0],
      iTmov: tmov + movSel === "I03" ? "S" : tmov,
      operacion: "dataPallet",
      articulo: infoArt ? infoArt.codigo : "",
    };
    const peticion = await GetDataPallet(dataPallet);

    if (tmov === "S" && infoRefer?.almacen !== peticion.dataAlmacen) {
      await SwAlert.fire({
        text: "EL PALLET NO PERTENECE AL ALMACEN DE LA PROYECCION",
        icon: "warning",
        showConfirmButton: false,
        timer: 2500,
      });
      return false;
    }

    if (!peticion.dataItems) {
      await SwAlert.fire({
        text: "NO SE HAN ENCONTRADO ITEMS",
        icon: "warning",
        showConfirmButton: false,
        timer: 2500,
      });
      return false;
    }

    const datos: detallePallet[] = peticion["dataItems"].map(
      (item: detallePallet) => {
        if (tmov === "S") {
          if (movSel === "02")
            return { ...item, referencia: infoRefer, visible: true };

          return { ...item, referencia: infoRefer };
        } else if (tmov === "I" && movSel == "03") {
          return { ...item, referencia: infoRefer, visible: true };
        }
        return item;
      }
    );

    setInfoDet(datos);
    return true;
  };

  const obtenerCodigoAlm = async (almacen: string) => {
    const petAlm: almBD = await AlmacenesUbic({
      almacen,
      condicion: "2",
    });

    setDest(petAlm);
  };

  useEffect(() => {
    if (step === 3 && otsDisp.length === 1) asignOt(otsDisp[0]);
    if (step === 4 && matrices.length === 1) asignMtz(matrices[0].codigo);
    if (step === 4 && tmov + movSel === "I03") asignMtz("");
  }, [step]);
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
            {infoPallet.length > 0 ? infoPallet[0] : infoArt?.desc}
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
                onClick={() => prevStep(1)}
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
              <p className="uppercase font-bold mb-2">escoja tipo movimiento</p>
              <div className="flex w-full">
                <button
                  className="grow text-white font-semibold uppercase py-2 bg-sky-600 rounded-l-lg"
                  onClick={() => asigTMov("S")}
                >
                  salida
                </button>
                <button
                  className="grow text-white font-semibold uppercase py-2 bg-orange-600 rounded-r-lg"
                  onClick={() => asigTMov("I")}
                >
                  ingreso
                </button>
              </div>
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
              <p className="uppercase font-bold mb-2">seleccione movimiento</p>
              <div className="flex text-xs md:text-base mb-2">
                <input
                  type="text"
                  className="w-10 px-2 rounded-l-md h-9 border border-slate-300"
                  defaultValue={tmov}
                  readOnly
                />
                <input
                  type="text"
                  className="w-16 px-2 h-9 border border-slate-300 "
                  value={movSel}
                  onChange={changeMov}
                  autoFocus
                  onKeyUp={(e) => {
                    if (e.key === "Enter") asigMov();
                  }}
                />
                <select
                  className="w-full rounded-r-md h-9 border border-slate-300 uppercase"
                  // defaultValue={"NA"}
                  value={tmov + movSel}
                  onChange={changeMov}
                >
                  <option value={"NA"} className="text-center">
                    seleccione movimiento
                  </option>
                  {movimientos.length > 0 &&
                    movimientos.map((mov) => (
                      <option key={mov.codigo} value={mov.codigo}>
                        {mov.desc}
                      </option>
                    ))}
                </select>
              </div>
              <button
                className="uppercase bg-orange-600 w-full p-2 text-center text-white rounded-lg text-xs md:text-base"
                onClick={asigMov}
              >
                siguiente
              </button>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div
              className=""
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x: [transition, 0] }}
              transition={{
                duration: 0.4,
                ease: "easeIn",
              }}
            >
              <p className="uppercase font-bold mb-2">escoja ot</p>
              <div className="flex gap-2 flex-wrap">
                {otsDisp.length > 0 &&
                  otsDisp.map((ot) => (
                    <button
                      key={ot.nro}
                      className="text-sm md:text-base border border-orange-500 rounded-md p-3 font-semibold text-orange-600 hover:bg-orange-500 hover:text-white w-full"
                      onClick={() => {
                        asignOt(ot);
                        if (tmov == "I") obtenerCodigoAlm(ot.almacen);
                      }}
                    >
                      {ot.desc} ({ot.nro}) ({ot.almacen}) - {ot.restante}KG
                    </button>
                  ))}
              </div>
            </motion.div>
          )}
          {step === 4 && (
            <motion.div
              className=""
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x: [transition, 0] }}
              transition={{
                duration: 0.4,
                ease: "easeIn",
              }}
            >
              <p className="uppercase font-bold mb-2">escoja matriz</p>
              <div className="flex gap-2 flex-wrap">
                {matrices.length > 0 &&
                  matrices.map((mtz) => (
                    <button
                      key={mtz.codigo}
                      className="text-sm md:text-base border border-orange-500 rounded-md p-3 font-semibold text-orange-600 hover:bg-orange-500 hover:text-white w-full"
                      onClick={() => asignMtz(mtz.codigo)}
                    >
                      {mtz.desc}
                    </button>
                  ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
