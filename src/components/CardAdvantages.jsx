import { motion } from "motion/react";

const CardAdvantages = ({ icon, title, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotate: -20 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`card bg-[#0000003b] backdrop-blur-sm rounded-2xl shadow-2xl shadow-black p-6 md:w-64 w-80 flex flex-col items-center gap-4 text-white ${className}`}
    >
      <div className=" bg-white/10 p-4 rounded-full ">{icon}</div>

      <h3 className=" text-center text-lg font-semibold text-white">{title}</h3>
    </motion.div>
  );
};

export default CardAdvantages;
