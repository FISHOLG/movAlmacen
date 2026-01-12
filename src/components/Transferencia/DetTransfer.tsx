import {
  Control,
  Controller,
  FieldErrors,
  UseFormSetValue,
  UseFormUnregister,
} from "react-hook-form";
import { dataFormTransfer, detallePallet } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxes, faTimes } from "@fortawesome/free-solid-svg-icons";
import { TransferStore } from "../../stores/TransferStore";
import { useEffect, useState } from "react";
import { formatearNumero } from "../../utils";
import MdlLote from "../MdlLote";
import ErrorValid from "../ErrorValid";

type detalle = {
  detalle: detallePallet;
  control: Control<dataFormTransfer>;
  index: number;
  unregister: UseFormUnregister<dataFormTransfer>;
  setValue: UseFormSetValue<dataFormTransfer>;
  errors: FieldErrors<dataFormTransfer>;
};

export default function DetTransfer({
  detalle,
  control,
  index,
  unregister,
  setValue,
  errors,
}: detalle) {
  const dropDet = TransferStore((state) => state.dropDet);
  const infoPallet = TransferStore((state) => state.infoPallet);
  const infoArt = TransferStore((state) => state.infoArt);
  const almOrg = TransferStore((state) => state.almOrg);
  const almDest = TransferStore((state) => state.almDest);

  const [bultos, setBultos] = useState(detalle["bultos"]);
  const [pesoItem, setPesoItem] = useState(detalle["peso"]);
  const [adicional, setAdicional] = useState(detalle["adicional"]);
  const [vMdlLoteOrg, setVMdlLoteOrg] = useState(false);
  const [vMdlLoteDest, setVMdlLoteDest] = useState(false);
  const [loteOrg, setLoteOrg] = useState(detalle["lote"]);
  const [loteDest, setLoteDest] = useState(detalle["lote"]);

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

    if (detalle.peso != "") return;
    const total =
      (isNaN(cantBultos) ? 0 : cantBultos) * pesoUnd +
      (isNaN(cantAdd) ? 0 : cantAdd);

    setPesoItem(formatearNumero(total));
    setValue(`detalles.${index}.peso`, formatearNumero(total));
  };

  const changeVLoteOrg = () => {
    setVMdlLoteOrg(!vMdlLoteOrg);
  };

  const changeVLoteDest = () => {
    setVMdlLoteDest(!vMdlLoteDest);
  };

  const changeLoteOrg = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoteOrg(e.target.value);
  };
  const changeLoteDest = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoteDest(e.target.value);
  };

  useEffect(() => {
    CalcularPeso();
  }, [bultos, adicional]);

  useEffect(() => {
    setValue(`detalles.${index}.loteOrg`, loteOrg);
    setLoteDest(loteOrg);
    setValue(`detalles.${index}.loteDest`, loteOrg);
  }, [loteOrg]);

  useEffect(() => {
    setValue(`detalles.${index}.loteDest`, loteDest);
  }, [loteDest]);

  useEffect(() => {
    setValue(`detalles.${index}.codArt`, detalle["codArt"]);
  }, []);

  return (
    <>
      {vMdlLoteOrg && (
        <MdlLote
          changeVLote={changeVLoteOrg}
          setLote={setLoteOrg}
          articulo={infoArt ? infoArt.codigo : ""}
          almacen={almOrg?.codigo || ""}
          tipoMov={"S03"}
        />
      )}
      {vMdlLoteDest && (
        <MdlLote
          changeVLote={changeVLoteDest}
          setLote={setLoteDest}
          articulo={infoArt ? infoArt.codigo : ""}
          almacen={almDest?.codigo || ""}
          tipoMov={"I03"}
        />
      )}
      <div className="w-full py-2">
        {/*  {infoPallet.length === 0 && index !== 0 && (
          <button
            type="button"
            className="bg-red-600 text-white px-2 py-1  absolute right-2 z-10"
            onClick={() => {
              unregister(`detalles.${index}`);
              dropDet(detalle.item);
            }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )} */}
        <button
          type="button"
          className="bg-red-600 text-white px-2 py-1  absolute right-2 z-10"
          onClick={() => {
            unregister(`detalles.${index}`);
            dropDet(detalle.item);
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <table
          className={`w-full border-collapse border border-slate-400 ${
            infoPallet != "" ? "pointer-events-none	opacity-50" : ""
          }`}
        >
          <tbody>
            <tr>
              <td colSpan={2} className="border border-slate-400 p-1">
                <span className="text-xs md:text-base text-center font-semibold uppercase">
                  articulo
                </span>

                <Controller
                  control={control}
                  name={`detalles.${index}.item`}
                  defaultValue={detalle.item}
                  render={({ field }) => (
                    <input
                      type="text"
                      className="h-6 w-full px-2 text-center text-xs md:text-base hidden "
                      readOnly
                      {...field}
                      //value={detalle.codArt}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name={`detalles.${index}.codArt`}
                  //defaultValue={detalle.codArt}
                  render={({ field }) => (
                    <input
                      type="text"
                      className="h-6 w-full px-2 text-center text-xs md:text-base "
                      readOnly
                      {...field}
                      //value={detalle.codArt}
                    />
                  )}
                />
                <input
                  type="text"
                  className="h-6 w-full px-2 text-center text-xs md:text-base "
                  readOnly
                  defaultValue={infoArt?.desc}
                />
              </td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-1">
                <span className="text-xs md:text-base text-center font-semibold uppercase">
                  Lote Sal
                </span>
                <div className="flex">
                  <Controller
                    control={control}
                    name={`detalles.${index}.loteOrg`}
                    defaultValue={loteOrg}
                    rules={{
                      required: "DEBE INGRESAR LOTE SAL",
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="h-6 w-full px-2 text-center text-xs md:text-base"
                        readOnly={infoPallet === "" ? false : true}
                        value={loteOrg}
                        onChange={changeLoteOrg}
                      />
                    )}
                  />
                  <div
                    className={`pe-2 ${infoPallet !== "" ? "hidden" : ""}`}
                    onClick={changeVLoteOrg}
                  >
                    <FontAwesomeIcon icon={faBoxes} />
                  </div>
                </div>
              </td>
              <td className="border border-slate-400 p-1">
                <span className="text-xs md:text-base text-center font-semibold uppercase">
                  # lote Ing
                </span>
                <div className="flex">
                  <Controller
                    control={control}
                    name={`detalles.${index}.loteDest`}
                    defaultValue={loteDest}
                    rules={{
                      required: "DEBE INGRESAR LOTE ING",
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="h-6 w-full px-2 text-center text-xs md:text-base"
                        readOnly={infoPallet === "" ? false : true}
                        value={loteDest}
                        onChange={changeLoteDest}
                      />
                    )}
                  />
                  <div
                    className={`pe-2 ${infoPallet !== "" ? "hidden" : ""}`}
                    onClick={changeVLoteDest}
                  >
                    <FontAwesomeIcon icon={faBoxes} />
                  </div>
                </div>
              </td>
            </tr>
            {errors.detalles &&
              (errors.detalles[index]?.loteOrg ||
                errors.detalles[index]?.loteDest) && (
                <tr>
                  <td>
                    {
                      <ErrorValid
                        message={errors.detalles[index].loteOrg?.message}
                      />
                    }
                  </td>
                  <td>
                    {
                      <ErrorValid
                        message={errors.detalles[index].loteDest?.message}
                      />
                    }
                  </td>
                </tr>
              )}
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
                  PESO x BULtO
                </span>

                <input
                  type="text"
                  className="h-6 w-full px-2 text-center text-xs md:text-base "
                  readOnly
                  value={infoArt?.pesoUnd}
                />
              </td>
            </tr>

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
                  peso TOTAL(kg){" - "}
                  <span className="text-slate-500"></span>
                </span>
                <Controller
                  control={control}
                  name={`detalles.${index}.peso`}
                  defaultValue={pesoItem}
                  rules={{
                    min: {
                      value: 0.0001,
                      message: "LA CANTIDAD DEBE SER MAYOR A 0",
                    },
                  }}
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
