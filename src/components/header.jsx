import background from "../assets/images/background.png";
import RechercherForm from "./RechercherForm";
import {motion} from "motion/react";

const Header = () => {
 const style = {
    backgroundImage: `url(${background})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh",
    width: "100%",
  };
  return (
    <div className=" w-full flex justify-center items-center flex-col h-screen pt-20">
      <motion.div
      initial={{y: -50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
        style={style}
        className="-z-1 absolute -top-20"
      ></motion.div>
      <div className=" flex items-center justify-center h-screen flex-col w-full gap-20 absolute top-20">
        <div className=" text-center space-y-2.5 ">

        <h1 className="text-4xl md:text-5xl font-bold text-white text-center md:w-150 w-100 ">
          Voyager malin entre étudiants
        </h1>
        <p className=" text-white text-xl ">
          partager vos trajets, reduiser vos frais!!!!!!
        </p>
        </div>
        <RechercherForm/>
      </div>
    </div>
  );
};

export default Header;
