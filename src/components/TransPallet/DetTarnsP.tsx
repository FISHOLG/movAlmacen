import { Control, Controller, UseFormSetValue } from "react-hook-form";
import { dataFormTransP, dataItemTransP } from "../../types";
import { useEffect } from "react";

type detalle = {
  detalle: dataItemTransP;
  control: Control<dataFormTransP>;
  index: number;
  setValue: UseFormSetValue<dataFormTransP>;
};

export default function DetTarnsP({
  detalle,
  control,
  index,
  setValue,
}: detalle) {
  useEffect(() => {
    setValue(`detalles.${index}.peso`, detalle.peso);
  }, [detalle]);
  return (
    <div className="w-full py-2">
      <table className="w-full border-collapse border border-slate-400 pointer-events-none">
        <tbody>
          <tr>
            <td colSpan={2}>
              <span className="text-xs md:text-base text-center font-semibold uppercase">
                Cod Articulo
              </span>
              <Controller
                control={control}
                name={`detalles.${index}.codArt`}
                defaultValue={detalle.codArt}
                render={({ field }) => (
                  <input
                    type="text"
                    className="h-6 w-full px-2 text-center text-xs md:text-base "
                    readOnly
                    {...field}
                  />
                )}
              />
            </td>
          </tr>
          <tr>
            <td className="border border-slate-400 p-1">
              <span className="text-xs md:text-base text-center font-semibold uppercase">
                fecha prod
              </span>

              <Controller
                control={control}
                name={`detalles.${index}.fecha`}
                defaultValue={detalle.fecha}
                render={({ field }) => (
                  <input
                    type="date"
                    className="h-6 w-full px-2 text-center text-xs md:text-base "
                    readOnly
                    {...field}
                  />
                )}
              />
            </td>
            <td className="border border-slate-400 p-1">
              <span className="text-xs md:text-base text-center font-semibold uppercase">
                lote
              </span>
              <Controller
                control={control}
                name={`detalles.${index}.lote`}
                defaultValue={detalle.lote}
                render={({ field }) => (
                  <input
                    type="text"
                    className="h-6 w-full px-2 text-center text-xs md:text-base "
                    readOnly
                    {...field}
                  />
                )}
              />
            </td>
          </tr>
          <tr>
            <td colSpan={1} className="border border-slate-400 p-1">
              <span className="text-xs md:text-base text-center font-semibold uppercase">
                ot
              </span>
              <Controller
                control={control}
                name={`detalles.${index}.referencia.nro`}
                defaultValue={detalle.ot}
                render={({ field }) => (
                  <input
                    type="text"
                    className="h-6 w-full px-2 text-center text-xs md:text-base "
                    readOnly
                    {...field}
                  />
                )}
              />
            </td>
            <td colSpan={1} className="border border-slate-400 p-1">
              <span className="text-xs md:text-base text-center font-semibold uppercase">
                trazabilidad
              </span>
              <Controller
                control={control}
                name={`detalles.${index}.traza`}
                defaultValue={detalle.traza}
                render={({ field }) => (
                  <input
                    type="text"
                    className="h-6 w-full px-2 text-center text-xs md:text-base "
                    readOnly
                    {...field}
                  />
                )}
              />
            </td>
          </tr>
          <tr>
            <td colSpan={2} className="border border-slate-400 p-1">
              <span className="text-xs md:text-base text-center font-semibold uppercase">
                peso
              </span>

              <Controller
                control={control}
                name={`detalles.${index}.peso`}
                //defaultValue={detalle.peso}
                render={({ field }) => (
                  <input
                    type="text"
                    className="h-6 w-full px-2 text-center text-xs md:text-base"
                    placeholder="0.0000"
                    readOnly
                    {...field}
                  />
                )}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
