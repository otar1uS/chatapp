import { FC, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: FC<InputProps> = ({ label, ...rest }) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={rest.id}
        className="block text-slate-950 text-sm font-medium mb-2"
      >
        {label}
      </label>
      <input
        {...rest}
        className="w-full p-2  outline-cyan-700  text-slate-950 rounded"
      />
    </div>
  );
};

export default Input;
