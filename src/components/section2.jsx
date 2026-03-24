import { Link } from "react-router";
import background from "../assets/images/background-down.png";
import { MoveRight } from "lucide-react";
import Avantages from "./Avantages";
import Footer from "./Footer"

const style = {
  backgroundImage: `url(${background})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  height: "156vh",
  width: "100%",
};
const Section2 = () => {
  return (
    <div className="w-full flex justify-center items-center flex-col  pt-20 relative ">
      <div style={style} className=" absolute w-full -bottom-60"></div>
      <div className="w-full max-w-6xl space-y-5">
        <Avantages />
        <Contain />
      </div>
      
    </div>
  );
};

export default Section2;

const Contain = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-10 rounded-2xl shadow-lg shadow-[#000000c0] w-11/12 lg:w-1/2 p-10 bg-[#00000032] backdrop-blur-lg mx-auto my-6 ">
      <div className=" space-y-3">
        <h3 className=" text-xl text-white md:text-2xl font-bold text-center">
          Vous pouvez dès maintenant publiez un trajet
        </h3>
        <p className="text-center text-lg text-white/80">
          Partagez vos frais et rencontrez de nouveaux étudiants
        </p>
      </div>
      <Link
        to={"/ajouter"}
        className="  md:w-1/2 btn btn-lg bg-white hover:bg-gray-100 hover:scale-102 rounded-lg text-black border-none transition-all"
      >
        Publier un trajet <MoveRight />
      </Link>
      
    </div>
  );
};
