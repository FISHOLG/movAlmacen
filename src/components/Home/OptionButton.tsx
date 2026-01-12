import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router";

type props = {
  titulo: string;
  icon: IconDefinition;
  view: string;
};

export default function OptionButton({ titulo, icon, view }: props) {
  const navigate = useNavigate();

  const Navegar = (ruta: string) => {
    navigate(`/${ruta}`);
  };

  return (
    <>
      <div
        className="bg-red-700 w-full text-white py-4 px-3 border border-red-700 rounded-lg text-center"
        onClick={() => Navegar(view)}
      >
        <FontAwesomeIcon icon={icon} className="me-2" size="lg" />
        <span className="uppercase font-bold">{titulo}</span>
      </div>
    </>
  );
}
