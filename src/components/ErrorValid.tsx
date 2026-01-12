import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type messageError = {
  message: string | undefined;
};

export default function ErrorValid({ message }: messageError) {
  return (
    <div className=" text-sm md:text-base text-white font-bold uppercase bg-red-600 p-2 text-center">
      <FontAwesomeIcon icon={faCircleExclamation} /> {message}
    </div>
  );
}
