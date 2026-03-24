import AjouterForm from "../components/AjouterForm";
import PageBackground from "../components/PageBackground";
import { motion } from "motion/react";

const Ajouter = () => {
  return (
    <div className="flex items-center pt-20 flex-col justify-center min-h-screen gap-10">
      <PageBackground />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="  px-5 "
      >
        <h1 className=" text-3xl md:text-4xl font-bold relative right-15 md:right-0">Ajouter un trajet</h1>
      </motion.div>
      <AjouterForm />
    </div>
  );
};

export default Ajouter;
