import {motion} from "motion/react"

const Input = ({
  type,
  placeholder,
  label,
  value,
  onchange,
  pattern,
  onChange,
  name,
  id,
  disabled,
  className,
}) => {
  const inputId = id || name || undefined;
  const changeHandler = onChange || onchange;

  return (
    <motion.div 
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className=" flex flex-col justify-start gap-2 w-full">
      {label && <label htmlFor={inputId}>{label}</label>}
      <div className="w-full">
        <input
          id={inputId}
          name={name}
          type={type || "text"}
          placeholder={placeholder}
          value={value}
          pattern={pattern}
          onChange={changeHandler}
          disabled={disabled}
          className={" input input-bordered w-full bg-white  rounded-lg focus:ring-2 focus:ring-black focus:border-black " + className}
        />
      </div>
    </motion.div>
  );
};

export default Input;
