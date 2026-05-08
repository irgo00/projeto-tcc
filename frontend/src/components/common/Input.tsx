import React, { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { formatCPF, formatTelefone, formatMoeda } from "../../utils/helpers";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ComponentType<{ className?: string }>;
  currency?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  error,
  icon: Icon,
  required = false,
  currency = false,
  name,
  value,
  onChange,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    if (name === "cpf") {
      val = formatCPF(val);
    }

    if (type === "tel") {
      val = formatTelefone(val);
    }

    if (currency) {
      val = formatMoeda(val);
    }

    onChange?.({
      ...e,
      target: {
        ...e.target,
        value: val,
      },
    });
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-gray-700 font-medium mb-2">
          {Icon && <Icon className="inline w-4 h-4 mr-1" />}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          type={isPassword && showPassword ? "text" : type}
          name={name}
          value={value}
          onChange={handleChange}
          className={`
    w-full px-4 py-3 border rounded-lg
    text-gray-800 bg-white
    placeholder-gray-400
    focus:ring-2 focus:ring-purple-500 focus:border-transparent
    transition-colors
    ${error ? "border-red-500" : "border-gray-300"}
    ${isPassword ? "pr-12" : ""}
  `}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
