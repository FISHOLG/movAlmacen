import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { motion } from "motion/react";
import { AsigStore } from "../../stores/AsigStore";
import {
  listarAlmacenes,
  obtenerDataRack,
  obtenerUbicaciones,
} from "../../services/almacenService";
import { almBD } from "../../types";

type Props = {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  propAlm?: string;
};

type Filtro = {
  COD_RACK: string;
  TOTAL_UBIC: string;
  DISP_UBIC: string;
  PORCENTAJE: number;
};

type Lado = {
  valor: string; // "I", "C", "D"
  desc: string; // "IZQ", "CENTRO", "DER"
};

export default function StepsAsig({ step, setStep, propAlm }: Props) {
  const ubicacion = AsigStore((state) => state.ubicacion);
  const setAlm = AsigStore((state) => state.setAlm);
  /* const setLado = AsigStore((state) => state.setLado);
  const setColumna = AsigStore((state) => state.setColumna);
  const setNivel = AsigStore((state) => state.setNivel);
  const setProfundidad = AsigStore((state) => state.setProfundidad); */
  const setUbicacion = AsigStore((state) => state.setUbicacion);
  const setEstado = AsigStore((state) => state.setEstado);
  const clearAsig = AsigStore((state) => state.clearAsig);

  const [transition, setTransition] = useState(100);

  const [cantLado, setCantLado] = useState<Filtro[]>([]);
  const [cantColumna, setCantColumna] = useState<Filtro[]>([]);
  const [cantNivel, setCantNivel] = useState<Filtro[]>([]);
  const [ubicaciones, setUbicaciones] = useState([]);

  const [almacenes, setAlmacenes] = useState<almBD[]>([]);

  const [ventanaInicial, setVentanaInicial] = useState(!propAlm ? 1 : 2);

  /* const almacenes = [
    { almacen: "C1", desc: "CÁMARA 1" },
    { almacen: "C2", desc: "CÁMARA 2" },
    { almacen: "C3", desc: "CÁMARA 3" },
    { almacen: "C4", desc: "CÁMARA 4" },
  ]; */

  const obtenerAlmacenes = async () => {
    const peticion = await listarAlmacenes();
    setAlmacenes(peticion);
  };

  // const ventanaInicial =!propAlm ? 1 : 2 ;

  const lados = [
    { valor: "I", desc: "IZQ" },
    { valor: "C", desc: "CENTRO" },
    { valor: "D", desc: "DER" },
  ];

  function ordenarRacksPorLado(racks: Filtro[], lados: Lado[]) {
    const prioridadLado: Record<string, number> = lados.reduce(
      (acc, lado, index) => {
        acc[lado.valor] = index;
        return acc;
      },
      {} as Record<string, number>
    );

    return racks.sort((a, b) => {
      const ladoA = a.COD_RACK.slice(-1);
      const ladoB = b.COD_RACK.slice(-1);
      return prioridadLado[ladoA] - prioridadLado[ladoB];
    });
  }

  const nextStep = () => {
    setTransition(100);
    const next = step + 1;
    setStep(next);
  };

  const prevStep = () => {
    setTransition(-100);
    const prev = step - 1;
    if (prev === 5) {
      // const newCod = ubicacion.codigo.substring(0, -2);
      const newCod =
        ubicacion.codigo.length >= 6 ? ubicacion.codigo.substring(0, 6) : "";
      setUbicacion(newCod);
    }
    if (prev === 4) {
      const newCod =
        ubicacion.codigo.length >= 5 ? ubicacion.codigo.substring(0, 5) : "";
      setUbicacion(newCod);
    }
    if (prev === 3) {
      const newCod =
        ubicacion.codigo.length >= 3 ? ubicacion.codigo.substring(0, 3) : "";
      setUbicacion(newCod);
    }
    if (prev === 2) {
      const newCod =
        ubicacion.codigo.length >= 2 ? ubicacion.codigo.substring(0, 2) : "";
      setUbicacion(newCod);
    }
    if (prev === 1) {
      setUbicacion("");
      setAlm("");
    }
    setStep(prev);
  };

  /* const selecAlm = (alm: string) => {
    setAlm(alm);
    nextStep();
  };

  const selecLado = (lado: string) => {
    setLado(lado);
    nextStep();
  };

  const selecColumna = (columna: string) => {
    setColumna(columna);
    nextStep();
  };

  const selecNivel = (nivel: string) => {
    setNivel(nivel);
    nextStep();
  }; */

  const selecCodigo = (codigo: string) => {
    setUbicacion(codigo);
    nextStep();
  };

  const selecUbicacion = (codigo: string, estado: string) => {
    setUbicacion(codigo);
    setEstado(estado);
    nextStep();
  };

  const cantDisponible = async (nvl: number) => {
    const datos = {
      operacion: "cantRackDisp",
      filtro: nvl === 2 ? ubicacion.almacen : ubicacion.codigo,
      nivel: nvl,
    };

    const peticion = await obtenerDataRack(datos);

    if (nvl === 2) setCantLado(ordenarRacksPorLado(peticion, lados));
    else if (nvl === 3) setCantColumna(peticion);
    else if (nvl === 4) setCantNivel(peticion);
  };

  const ubicDisponible = async () => {
    const datos = {
      operacion: "listarRackDisp",
      filtro: ubicacion.codigo,
    };

    const peticion = await obtenerUbicaciones(datos);
    setUbicaciones(peticion);
  };

  useEffect(() => {
    if (step > 1 && step <= 4) {
      cantDisponible(step);
    } else if (step === 5) {
      ubicDisponible();
    }
  }, [step]);

  useEffect(() => {
    if (!propAlm) {
      obtenerAlmacenes();
      if (ubicacion.almacen !== "") {
        setVentanaInicial(2);
        nextStep();
      }
    }
    if (propAlm) {
      clearAsig();
      selecCodigo(propAlm);
      setAlm(propAlm);
    }
  }, []);

  return (
    <div className="pt-3 px-2">
      <h1 className="uppercase font-bold text-center">Escoja Ubicacion</h1>
      {/* PANELES DE OPCIONES */}
      <div className="flex gap-x-2">
        {/* boton de regreso */}
        {step > ventanaInicial && step <= 5 && (
          <div className="grow">
            <button
              className="bg-red-600 p-2 rounded-md text-white uppercase text-sm md:text-base"
              onClick={prevStep}
            >
              <FontAwesomeIcon icon={faArrowAltCircleLeft} className="me-2" />
              regresar
            </button>
          </div>
        )}
        <div className="grow p-2">
          <span className="block text-end">
            {ubicacion.codigo.substring(0, 2)}|{ubicacion.lado}|
            {ubicacion.columna}|{ubicacion.fila}|{ubicacion.profundidad}
          </span>
        </div>
      </div>

      {/* PANEL 01: SELECCION DE ALMACEN */}
      {step === 1 && (
        <motion.div
          className="px-3 border-2 boder-gray-300 py-5 mt-2 rounded-2xl shadow shadow-gray-300 "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, x: [transition, 0] }}
          transition={{
            duration: 0.4,
            ease: "easeIn",
          }}
        >
          <h4 className="font-bold text-slate-600 uppercase mb-2">
            Seleccione Cámara
          </h4>

          <div className="flex flex-wrap gap-2">
            {almacenes.length > 0 &&
              almacenes.map((alm) => (
                <div
                  key={alm.almacen}
                  onClick={() => {
                    setAlm(alm.almacen);
                    selecCodigo(alm.almacen);
                  }}
                  className="basis-32 grow p-3 bg-emerald-600 rounded-md text-center text-white hover:bg-emerald-700 hover:cursor-pointer  "
                >
                  <span className="uppercase font-semibold">{alm.desc}</span>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      {/* PANEL 02: SELECCION DE LADO  */}
      {step === 2 && (
        <motion.div
          className="px-3 border-2 boder-gray-300 py-5 mt-2 rounded-2xl shadow shadow-gray-300 "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, x: [transition, 0] }}
          transition={{
            duration: 0.4,
            ease: "easeIn",
          }}
        >
          <h4 className="font-bold text-slate-600 uppercase mb-2">
            Seleccione lado
          </h4>

          <div className="flex flex-wrap gap-2">
            {cantLado.length > 0 &&
              cantLado.map((lado, index) => {
                const lad = lados.find(
                  (l) => l.valor === lado.COD_RACK.slice(-1)
                );

                return (
                  <div
                    key={index}
                    onClick={() => selecCodigo(lado["COD_RACK"])}
                    className="basis-32 grow p-3 bg-emerald-600 rounded-md text-center text-white hover:bg-emerald-700 hover:cursor-pointer  "
                  >
                    <span className="uppercase font-semibold block">
                      {lad?.desc}
                    </span>
                    <span className="text-xs uppercase">
                      disp: {lado["DISP_UBIC"]}
                    </span>
                  </div>
                );
              })}
          </div>
        </motion.div>
      )}

      {/* PANEL 03: SELECCION DE COLUMNA*/}
      {step === 3 && (
        <motion.div
          className="px-3 border-2 boder-gray-300 py-5 mt-2 rounded-2xl shadow shadow-gray-300 "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, x: [transition, 0] }}
          transition={{
            duration: 0.4,
            ease: "easeIn",
          }}
        >
          <h4 className="font-bold text-slate-600 uppercase mb-2">
            Seleccione columna
          </h4>
          <div className="flex flex-wrap gap-2">
            {cantColumna.length > 0 &&
              cantColumna.map((col, index) => (
                <div
                  key={index}
                  onClick={() => selecCodigo(col["COD_RACK"])}
                  className="basis-32 grow p-3 bg-emerald-600 rounded-md text-center text-white hover:bg-emerald-700 hover:cursor-pointer  "
                >
                  <span className="uppercase font-semibold block text-base">
                    {col["COD_RACK"].slice(-2)}
                  </span>
                  <span className="text-xs uppercase">
                    disp: {col["DISP_UBIC"]}
                  </span>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      {step === 4 && (
        <motion.div
          className="px-3 border-2 boder-gray-300 py-5 mt-2 rounded-2xl shadow shadow-gray-300 "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, x: [transition, 0] }}
          transition={{
            duration: 0.4,
            ease: "easeIn",
          }}
        >
          <h4 className="font-bold text-slate-600 uppercase mb-2">
            Seleccione nivel
          </h4>
          <div className="flex flex-wrap gap-2">
            {cantNivel.length > 0 &&
              cantNivel.map((nvl, index) => (
                <div
                  key={index}
                  onClick={() => selecCodigo(nvl["COD_RACK"])}
                  className="basis-32 grow p-3 bg-emerald-600 rounded-md text-center text-white hover:bg-emerald-700 hover:cursor-pointer  "
                >
                  <span className="uppercase font-semibold block">
                    {nvl["COD_RACK"].slice(-1)}
                  </span>
                  <span className="text-xs uppercase">
                    disp: {nvl["DISP_UBIC"]}
                  </span>
                </div>
              ))}
          </div>
        </motion.div>
      )}
      {step === 5 && (
        <motion.div
          className="px-3 border-2 boder-gray-300 py-5 mt-2 rounded-2xl shadow shadow-gray-300 "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, x: [transition, 0] }}
          transition={{
            duration: 0.4,
            ease: "easeIn",
          }}
        >
          <h4 className="font-bold text-slate-600 uppercase mb-2">
            Seleccione posicion
          </h4>
          <div className="flex flex-wrap gap-2">
            {ubicaciones.length > 0 &&
              ubicaciones.map((ubic) => (
                <div
                  key={ubic["codUbic"]}
                  onClick={() =>
                    selecUbicacion(ubic["codUbic"], ubic["estado"])
                  }
                  className={`basis-32 grow p-3 ${
                    ubic["estado"] === "1"
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }  rounded-md text-center text-white  hover:cursor-pointer`}
                >
                  <span className="uppercase font-semibold">
                    {ubic["posicion"]}
                  </span>
                </div>
              ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
