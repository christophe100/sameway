import { Bike, HandCoins, ShieldCheck } from "lucide-react";
import icon1 from "../assets/icons/icon1.png";
import icon2 from "../assets/icons/icon2.png";
import icon3 from "../assets/icons/icon3.png";
import CardAdvantages from "./CardAdvantages";

const Avantages = () => {
  return (
    <div className="w-full py-20 text-center relative">
      <h2 className=" text-4xl font-bold mb-29">Pourquoi choisir SameWay ?</h2>

      <div className="w-full flex justify-center items-center ">
        <div className="hidden md:block relative w-full max-w-4xl h-64">
          <CardAdvantages
            icon={<HandCoins className=" h-20 w-20" />}
            title={"Économiser de l’argent au quotidien"}
            className={
              "absolute left-1 top-8 transform -rotate-15 shadow-[0_25px_40px_rgba(0,0,0,0.45)]"
            }
          />

          <CardAdvantages
            icon={<Bike className=" h-20 w-20" />}
            title={"Se déplacer plus facilement et plus vite"}
            className={
              "absolute left-1/2 top-0 transform -translate-x-1/2 rotate-0  shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
            }
          />

          <CardAdvantages
            icon={<ShieldCheck className=" h-20 w-20" />}
            title={"Voyager entre étudiants, en toute confiance"}
            className={
              "absolute right-1 top-8 transform rotate-15 shadow-[0_25px_40px_rgba(0,0,0,0.45)]"
            }
          />
        </div>

        <div className="md:hidden flex flex-col gap-6 items-center w-full px-6">
          <CardAdvantages
            icon={<HandCoins className="h-20 w-20" />}
            title={"Économiser de l’argent au quotidien"}
          />
          <CardAdvantages
            icon={<Bike className="h-20 w-20" />}
            title={"Se déplacer plus facilement et plus vite"}
          />
          <CardAdvantages
            icon={<ShieldCheck className="h-20 w-20" />}
            title={"Voyager entre étudiants, en toute confiance"}
          />
        </div>
      </div>
    </div>
  );
};

export default Avantages;
