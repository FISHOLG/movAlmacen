import {
  faCalendarDay,
  faChevronLeft,
  faChevronRight,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formHistorial } from "../types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DetalleHistorial, HistorialVale } from "../services/ValeService";
import moment from "moment";
import { AuthStore } from "../stores/AuthStore";
import { HistoryStore } from "../stores/HistoryStore";
import { SwAlert } from "../utils";
import MdlDetVale from "../components/Historial/MdlDetVale";

type Form = {
  usuario: string;
  fechIni: string;
  fechFin: string;
};

export default function Historial() {
  const fechaHoy = moment().format("YYYY-MM-DD");
  const dataAuth = AuthStore((state) => state.auth);
  const numVale = HistoryStore((state) => state.numVale);
  const detalles = HistoryStore((state) => state.detalles);
  const setDetalles = HistoryStore((state) => state.setDetalles);
  const setNumVale = HistoryStore((state) => state.setNumVale);
  const clearAll = HistoryStore((state) => state.clearAll);

  const {
    register,
    handleSubmit,
    /*   formState: { errors }, */
  } = useForm<formHistorial>();

  const [fechaIni, setFechaIni] = useState(fechaHoy);
  const [fechaFin, setFechaFin] = useState(fechaHoy);

  const [searching, setSearching] = useState(false);
  const [history, getHistory] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Cálculo de los datos a mostrar
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = history.slice(indexOfFirstItem, indexOfLastItem);

  // Cálculo del número total de páginas
  const totalPages = Math.ceil(history.length / itemsPerPage);

  // Cambio de página
  const handlePageChange = (numero: number) => {
    const pagina = currentPage + numero;
    setCurrentPage(pagina);
  };

  const enviarSubmit = async (datos: Form) => {
    const data: formHistorial = {
      ...datos,
      operacion: "historial",
      usuario: dataAuth["usuario"],
    };
    setSearching(true);
    const service = await HistorialVale(data);

    getHistory(service);
    setSearching(false);
  };
  const ChangeFechaI = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFechaIni(e.target.value);
  };
  const ChangeFechaF = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFechaFin(e.target.value);
  };

  const ObtnerDetalle = async (numVale: string, estado: string) => {
    if (estado == "0") {
      return await SwAlert.fire({
        icon: "warning",
        text: `EL VALE N° ${numVale} ESTA ANULADO`,
        showConfirmButton: false,
        timer: 1500,
      });
    }

    const datos = {
      operacion: "detHistory",
      numVale: numVale,
    };

    const peticion = await DetalleHistorial(datos);

    if (peticion.length === 0) {
      await SwAlert.fire({
        icon: "warning",
        text: "NO SE HAN ENCONTRADO DETALLES",
        showConfirmButton: false,
        timer: 1500,
      });
    }

    setNumVale(numVale);
    setDetalles(peticion);

    //console.log(peticion);
  };

  useEffect(() => {
    clearAll();
    const sendForm = async () => {
      try {
        await handleSubmit(enviarSubmit)();
      } catch (error) {
        console.error("Error al enviar el formulario:", error);
      }
    };

    sendForm();
  }, []);

  return (
    <>
      {numVale.length > 0 && detalles.length > 0 && <MdlDetVale />}
      <div id="controlPallet" className="px-2">
        <div className="pb-2">
          <h2 className="bg-red-600 text-white font-bold uppercase text-center text-base md:text-xl lg:text-2xl py-2">
            historial de vales
          </h2>
        </div>

        <div id="filtro">
          <form onSubmit={handleSubmit(enviarSubmit)}>
            <div className="flex flex-wrap gap-3 ">
              <div className="grow">
                <span className="text-sm md:text-base uppercase font-semibold">
                  desde
                </span>
                <div className="flex">
                  <span className="w-16 text-center content-center bg-gray-400 text-white py-1 rounded-l-md">
                    <FontAwesomeIcon icon={faCalendarDay} />
                  </span>
                  <input
                    className="w-full h-8 border border-gray-300 rounded-r-md text-center pe-1"
                    type="date"
                    value={fechaIni}
                    {...register("fechIni", {
                      required: "DEBE ESCOGER FECHA INICIO",
                      onChange: ChangeFechaI,
                    })}
                  />
                </div>
              </div>
              <div className="grow">
                <span className="text-sm md:text-base uppercase font-semibold">
                  hasta
                </span>
                <div className="flex">
                  <span className="w-16 text-center content-center bg-gray-400 text-white py-1 rounded-l-md">
                    <FontAwesomeIcon icon={faCalendarDay} />
                  </span>
                  <input
                    className="w-full h-8 border border-gray-300 rounded-r-md text-center pe-1"
                    type="date"
                    value={fechaFin}
                    {...register("fechFin", {
                      required: "DEBE ESCOGER FECHA FIN",
                      onChange: ChangeFechaF,
                    })}
                  />
                </div>
              </div>
            </div>
            <div className=" mt-2">
              <div className="flex">
                <button
                  type="submit"
                  className="w-full bg-orange-600 uppercase text-white py-2 rounded-md font-semibold hover:cursor-pointer hover:bg-orange-700 disabled:bg-opacity-50"
                  disabled={searching}
                >
                  <FontAwesomeIcon icon={faFilter} className="me-2" />
                  filtrar
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="pt-2">
          <table className="w-full border-collapse border border-slate-300 text-sm md:text-base">
            <thead>
              <tr className="text-center uppercase text-white bg-orange-600">
                <th className="border-collapse border border-slate-300 py-1 w-1/5">
                  fecha
                </th>
                <th className="border-collapse border border-slate-300 py-1 w-1/5">
                  #vale
                </th>
                <th className="border-collapse border border-slate-300 py-1 w-2/5">
                  movimiento
                </th>
                <th className="border-collapse border border-slate-300 py-1 w-1/5">
                  almacen
                </th>
              </tr>
            </thead>
            <tbody>
              {searching ? (
                <tr className="border-b-2 border-white  font-semibold ">
                  <td colSpan={5} className="py-2 text-center uppercase">
                    BUSCANDO...
                  </td>
                </tr>
              ) : history.length > 0 ? (
                currentItems.map((vale) => (
                  <tr
                    key={vale["nroVale"]}
                    className={`text-center ${
                      vale["estado"] == "0" ? "bg-red-300" : ""
                    }`}
                    onClick={() =>
                      ObtnerDetalle(vale["nroVale"], vale["estado"])
                    }
                  >
                    <td className="border-collapse border border-slate-300 py-1">
                      {vale["fechReg"]}
                    </td>
                    <td className="border-collapse border border-slate-300 py-1">
                      {vale["nroVale"]}
                    </td>
                    <td className="border-collapse border border-slate-300 py-1">
                      {vale["tMov"]}
                    </td>
                    <td className="border-collapse border border-slate-300 py-1">
                      {vale["almacen"]}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-b-2 border-slate-300  font-semibold ">
                  <td
                    colSpan={5}
                    className="border-collapse border border-slate-300 py-1 text-center"
                  >
                    NO SE HAN ENCONTRADO REGISTROS
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Paginación */}
          <div className=" flex justify-between  my-2">
            <div className="">
              <span>
                Pág {currentPage}/{totalPages}
              </span>
            </div>
            <div className="justify-end">
              {currentPage > 1 && (
                <button
                  type="button"
                  className={`mx-1 px-3 py-1 rounded bg-sky-600 text-white`}
                  onClick={() => handlePageChange(-1)}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
              )}
              {currentPage < totalPages && (
                <button
                  type="button"
                  className={`mx-1 px-3 py-1 rounded bg-orange-600 text-white`}
                  onClick={() => handlePageChange(1)}
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
