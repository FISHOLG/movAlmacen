import React, { useEffect, useState } from "react";
import { dataFormVale, detallePallet, searchLote } from "../../types";
import {
  Controller,
  Control,
  UseFormSetFocus,
  UseFormSetValue,
  UseFormUnregister,
  FieldErrors,
} from "react-hook-form";
import { ValeStore } from "../../stores/ValeStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxes, faTimes } from "@fortawesome/free-solid-svg-icons";
import { formatearNumero, SwAlert } from "../../utils";
import MdlLote from "../MdlLote";
import { GetLotes } from "../../services/LoteService";
import ErrorValid from "../ErrorValid";

type detalle = {
  detalle: detallePallet;
  matriz: string;
  control: Control<dataFormVale>;
  index: number;
  unregister: UseFormUnregister<dataFormVale>;
  setValue: UseFormSetValue<dataFormVale>;
  setFocus: UseFormSetFocus<dataFormVale>;
  errors: FieldErrors<dataFormVale>;
};

export default function DetGenerar({
  detalle,
  matriz,
  control,
  index,
  unregister,
  setValue,
  errors,
}: //setFocus,
detalle) {
  const infoPallet = ValeStore((state) => state.infoPallet);
  const infoArt = ValeStore((state) => state.infoArt);
  const changeVDet = ValeStore((state) => state.changeVDet);
  const tipoMov = ValeStore((state) => state.tipoMov);

  const [bultos, setBultos] = useState(detalle["bultos"]);
  const [pesoItem, setPesoItem] = useState(detalle["peso"]);
  const [adicional, setAdicional] = useState(detalle["adicional"]);
  const [vMdlLote, setVMdlLote] = useState(false);
  const [lote, setLote] = useState(detalle["lote"]);

  const changebultos = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBultos(e.target.value);
  };

  const changeAdicional = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdicional(e.target.value);
  };

  const CalcularPeso = () => {
    const cantBultos = parseFloat(bultos);
    const cantAdd = parseFloat(adicional);
    const pesoUnd = parseFloat(infoArt ? infoArt.pesoUnd : "1");
    //const pesoUnd = parseFloat(detalle.pesoUnd !== "" ? detalle.pesoUnd : "1");

    if (infoPallet.length > 0 && tipoMov?.codigo.substring(0, 1) === "I")
      return;
    const total =
      (isNaN(cantBultos) ? 0 : cantBultos) * pesoUnd +
      (isNaN(cantAdd) ? 0 : cantAdd);

    setPesoItem(formatearNumero(total));
    setValue(`detalles.${index}.peso`, formatearNumero(total));
  };

  const changeVLote = () => {
    setVMdlLote(!vMdlLote);
  };

  const changeLote = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLote(e.target.value);
  };

  const verificarLote = async () => {
    if (!tipoMov) throw new Error("No existe tipo mov");

    let datos: searchLote = {
      operacion: "listarLotes",
      tMov: tipoMov.codigo,
      lote: lote,
    };

    const almacen = detalle.referencia ? detalle.referencia.almacen : "";
    const articulo = infoArt ? infoArt.codigo : "";

    if (tipoMov.codigo.substring(0, 1) === "S")
      datos = { ...datos, articulo, almacen };

    const peticion = await GetLotes(datos);

    if (peticion.result && peticion.result === "error") {
      await SwAlert.fire({
        icon: "warning",
        text: peticion.message,
        showConfirmButton: false,
        timer: 2500,
      });

      return;
    }
  };

  useEffect(() => {
    CalcularPeso();
  }, [bultos, adicional]);

  useEffect(() => {
    setValue(`detalles.${index}.lote`, lote);
  }, [lote]);

  return (
    <>
      {vMdlLote && (
        <MdlLote
          changeVLote={changeVLote}
          setLote={setLote}
          articulo={infoArt ? infoArt.codigo : ""}
          almacen={detalle.referencia ? detalle.referencia.almacen : ""}
          tipoMov={tipoMov ? tipoMov.codigo : ""}
        />
      )}
      <div className="w-full py-2">
        <button
          type="button"
          className="bg-red-600 text-white px-2 py-1  absolute right-2 z-10"
          onClick={() => {
            unregister(`detalles.${index}`);
            changeVDet(
              detalle.item,
              detalle.numPallet ? detalle.numPallet : ""
            );
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <table
          className={`w-full border-collapse border border-slate-400 ${
            infoPallet.length > 0 && tipoMov?.codigo.substring(0, 1) == "I"
              ? "pointer-events-none	opacity-50"
              : ""
          }`}
        >
          <tbody>
            <tr>
              <td colSpan={3} className="border border-slate-400 p-1">
                <span className="text-xs md:text-base text-center font-semibold uppercase">
                  OT
                </span>

                <Controller
                  control={control}
                  name={`detalles.${index}.item`}
                  defaultValue={detalle.item}
                  render={({ field }) => (
                    <input
                      type="text"
                      className="h-6 w-full px-2 text-center text-xs md:text-base hidden"
                      readOnly
                      {...field}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name={`detalles.${index}.referencia.tipo`}
                  defaultValue={detalle.referencia?.tipo}
                  render={({ field }) => (
                    <input
                      type="text"
                      className="h-6 w-full px-2 text-center text-xs md:text-base hidden"
                      readOnly
                      {...field}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name={`detalles.${index}.referencia.nroMov`}
                  defaultValue={detalle.referencia?.nroMov}
                  render={({ field }) => (
                    <input
                      type="text"
                      className="h-6 w-full px-2 text-center text-xs md:text-base hidden"
                      readOnly
                      {...field}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`detalles.${index}.referencia.nro`}
                  defaultValue={detalle.referencia?.nro}
                  render={({ field }) => (
                    <input
                      type="text"
                      className="h-6 w-full px-2 text-center text-xs md:text-base "
                      readOnly
                      {...field}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name={`detalles.${index}.referencia.almacen`}
                  defaultValue={detalle.referencia?.almacen}
                  render={({ field }) => (
                    <input
                      type="text"
                      className="h-6 w-full px-2 text-center text-xs md:text-base hidden "
                      readOnly
                      {...field}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name={`detalles.${index}.codArt`}
                  defaultValue={detalle.codArt}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="h-6 w-full px-2 text-center text-xs md:text-base hidden"
                      readOnly
                    />
                  )}
                />

                <Controller
                  control={control}
                  name={`detalles.${index}.numPallet`}
                  defaultValue={detalle.numPallet}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="h-6 w-full px-2 text-center text-xs md:text-base hidden"
                      readOnly
                    />
                  )}
                />
              </td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-1">
                <span className="text-xs md:text-base text-center font-semibold uppercase">
                  # trazabilidad
                </span>
                <Controller
                  control={control}
                  name={`detalles.${index}.traza`}
                  defaultValue={detalle.traza}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="h-6 w-full px-2 text-center text-xs md:text-base"
                      readOnly
                    />
                  )}
                />
              </td>
              <td className="border border-slate-400 p-1">
                <span className="text-xs md:text-base text-center font-semibold uppercase">
                  # matriz
                </span>
                <Controller
                  control={control}
                  name={`detalles.${index}.matriz`}
                  defaultValue={matriz}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="h-6 w-full px-2 text-center text-xs md:text-base"
                      readOnly
                    />
                  )}
                />
              </td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-1">
                <span className="text-xs md:text-base text-center font-semibold uppercase">
                  # bultos
                </span>

                <input
                  defaultValue={detalle.bultos}
                  type="number"
                  step="any"
                  min={0}
                  className="h-6 w-full px-2 text-center text-xs md:text-base"
                  placeholder="# Bultos"
                  value={bultos}
                  onChange={changebultos}
                />
              </td>
              <td className="border border-slate-400 p-1">
                <span className="text-xs md:text-base text-center font-semibold uppercase">
                  # lote
                </span>
                <div className="flex">
                  <Controller
                    control={control}
                    name={`detalles.${index}.lote`}
                    defaultValue={lote}
                    rules={{
                      required: "DEBE INGRESAR LOTE",
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="h-6 w-full px-2 text-center text-xs md:text-base"
                        readOnly={infoPallet.length === 0 ? false : true}
                        value={lote}
                        onChange={changeLote}
                        onBlur={verificarLote}
                      />
                    )}
                  />
                  <div
                    className={`pe-2 ${infoPallet.length > 0 ? "hidden" : ""}`}
                    onClick={changeVLote}
                  >
                    <FontAwesomeIcon icon={faBoxes} />
                  </div>
                </div>
              </td>
            </tr>
            {errors.detalles && errors.detalles[index]?.lote && (
              <tr>
                <td colSpan={2}>
                  {
                    <ErrorValid
                      message={errors.detalles[index]?.lote.message}
                    />
                  }
                </td>
              </tr>
            )}

            <tr>
              <td className="border border-slate-400 p-1">
                <span className="text-xs md:text-base text-center font-semibold uppercase">
                  KG ADICIONALES
                </span>

                <input
                  type="number"
                  className="h-6 w-full px-2 text-center text-xs md:text-base"
                  step="any"
                  placeholder="0.00"
                  value={adicional}
                  onChange={changeAdicional}
                  /*  onKeyUp={() => actualizarPeso("adicional")}
                    onFocus={() =>
                      setUEdit({ campo: "adicional", index: index })
                    } */
                />
              </td>
              <td className="border border-slate-400 p-1">
                <span className="text-xs md:text-base text-center font-semibold uppercase">
                  peso(kg){" - "}
                  {detalle.peso}
                  <span className="text-slate-500"></span>
                </span>
                <Controller
                  control={control}
                  name={`detalles.${index}.peso`}
                  rules={{
                    min: {
                      value: 0.0001,
                      message: "LA CANTIDAD DEBE SER MAYOR A 0",
                    },
                    ...(infoPallet.length > 0 &&
                      tipoMov?.codigo.substring(0, 1) === "S" && {
                        max: {
                          value: detalle.peso, // el valor máximo que deseas
                          message: `CANTIDAD MAXIMA ES ${detalle.peso}`,
                        },
                      }),
                  }}
                  defaultValue={pesoItem}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="h-6 w-full px-2 text-center text-xs md:text-base"
                      placeholder="0.0000"
                      readOnly
                      value={pesoItem}

                      //value={pesoItem || field.value}
                    />
                  )}
                />
              </td>
            </tr>
          </tbody>
        </table>
        {errors.detalles && errors.detalles[index]?.peso && (
          <ErrorValid message={errors.detalles[index]?.peso.message} />
        )}
      </div>
    </>
  );
}
