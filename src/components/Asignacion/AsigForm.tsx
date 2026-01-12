import { AsigStore } from "../../stores/AsigStore";
import { AsignarRack } from "../../services/almacenService";
import { useForm } from "react-hook-form";
import { loadingSave, SwAlert } from "../../utils";
import { useEffect, useState } from "react";
import StepsAsig from "./StepsAsig";
import { AuthStore } from "../../stores/AuthStore";

type Form = {
  codigo: string;
};
export default function AsigForm() {
  const info = AsigStore((state) => state.info);
  const ubicacion = AsigStore((state) => state.ubicacion);
  const authData = AuthStore((state) => state.auth);

  const [step, setStep] = useState(1);
  const clearAsig = AsigStore((state) => state.clearAsig);

  const { register, handleSubmit, reset } = useForm<Form>();

  const [multi, setMulti] = useState(false);

  /* const handleMulti = () => {
    setMulti(!multi);
  };
 */
  const enviarForm = async (data: Form) => {
    try {
      const datos = {
        codigo: data["codigo"],
        pallet: info ? info.numPallet : "",
        operacion: "asignarRack",
        valeI: "",
        valeS: "",
        multi: multi ? "1" : "0",
        usuario: authData.usuario,
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

      const peticion = await AsignarRack(datos);

      if (!peticion.result) {
        throw new Error("ERROR DESCONOCIDO");
      }

      if (peticion.result == "error") {
        throw new Error(peticion.message);
      }
      await SwAlert.fire({
        icon: "success",
        title: "OPERACIÓN EXITOSA",
        text: `PALLET: ${info?.numPallet} ASIGNADO AL RACK: ${data.codigo}`,
        showConfirmButton: true,
        confirmButtonText: "CONTINUAR",
      });

      reset();
      clearAsig();
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
  useEffect(() => {
    if (ubicacion.estado === "1") setMulti(true);
  }, [ubicacion.estado]);

  return (
    <>
      <div className="flex justify-center ">
        <div className="  w-10/12 md:w-3/5 border-2 border-gray-300 rounded-2xl p-3 uppercase  shadow shadow-gray-300 ">
          <h4 className="text-lg md:text-xl text-center w-full text-sky-600 font-bold  border-b-2 border-gray-300">
            información pallet
          </h4>

          <div className="py-2 px-3 flex flex-wrap font-bold text-sky-600">
            <p className="w-full ">
              n° pallet:{" "}
              <span className="text-gray-900 font-semibold">
                {info?.numPallet}
              </span>
            </p>
            <p className="w-1/2 ">
              bultos:{" "}
              <span className="text-gray-900 font-semibold">
                {info?.bultos}
              </span>
            </p>
            <p className="w-1/2  text-right">
              peso:{" "}
              <span className="text-gray-900 font-semibold">
                {info?.peso} kg
              </span>
            </p>
          </div>

          <p className="w-full text-center border-t-2 border-gray-300 pt-3 font-semibold">
            {info?.estado}
          </p>
        </div>
      </div>
      <div className="pt-3 px-2">
        {step <= 5 && (
          <>
            <StepsAsig step={step} setStep={setStep} />
          </>
        )}
        {step > 5 && (
          <div className="px-3 border-2 boder-gray-300 py-5 mt-2 rounded-2xl shadow shadow-gray-300 ">
            <h4 className="font-bold text-slate-600 uppercase mb-2">
              Información de Rack
            </h4>
            <form
              onSubmit={handleSubmit(enviarForm)}
              className="text-sm md:text-base"
            >
              <div className="flex flex-wrap gap-2 mb-2">
                <div className="w-full">
                  <label className="block font-semibold text-center uppercase">
                    Código de Rack
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 h-8 rounded-lg px-2 text-center"
                    readOnly
                    defaultValue={ubicacion.codigo}
                    value={ubicacion.codigo}
                    {...register("codigo")}
                  />
                </div>
              </div>
              <div className="flex gap-2 mb-2">
                <div className="grow">
                  <label className="block font-semibold text-center uppercase">
                    Cámara
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 h-8 rounded-lg px-2 text-center"
                    readOnly
                    value={ubicacion.codigo.substring(0, 2)}
                    defaultValue={ubicacion.codigo.substring(0, 2)}
                  />
                </div>
                <div className="grow">
                  <label className="block font-semibold text-center uppercase">
                    Lado
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 h-8 rounded-lg px-2 text-center"
                    readOnly
                    value={ubicacion.lado}
                    defaultValue={ubicacion.lado}
                  />
                </div>
              </div>
              <div className="flex gap-2 mb-2">
                <div className="grow">
                  <label className="block font-semibold text-center uppercase">
                    columna
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 h-8 rounded-lg px-2 text-center"
                    readOnly
                    value={ubicacion.columna}
                    defaultValue={ubicacion.columna}
                  />
                </div>
                <div className="grow">
                  <label className="block font-semibold text-center uppercase">
                    nivel
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 h-8 rounded-lg px-2 text-center"
                    readOnly
                    value={ubicacion.fila}
                    defaultValue={ubicacion.fila}
                  />
                </div>
                <div className="grow">
                  <label className="block font-semibold text-center uppercase">
                    posición
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 h-8 rounded-lg px-2 text-center"
                    readOnly
                    value={ubicacion.profundidad}
                    defaultValue={ubicacion.profundidad}
                  />
                </div>
              </div>
              {/* <div className="flex gap-x-2 align-middle uppercase text-xs font-semibold mb-2">
                <input
                  type="checkbox"
                  className=" text-orange-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  checked={multi}
                  onChange={handleMulti}
                  disabled={ubicacion.estado != "2"}
                />
                <label htmlFor="">ubicacion sea de uso multiple</label>
              </div> */}

              <div className="flex">
                <button
                  type="submit"
                  className="bg-sky-600 text-white text-center p-2 font-bold uppercase w-full rounded-l-lg"
                >
                  Asignar Ubicacion
                </button>
                <button
                  type="button"
                  className="bg-red-600 text-white text-center p-2 font-bold uppercase w-full rounded-r-lg"
                  onClick={() => clearAsig()}
                >
                  regresar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
