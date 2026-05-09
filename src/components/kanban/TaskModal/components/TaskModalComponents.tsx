import React, { useState, useRef, useEffect } from "react";
import { format, parseISO } from "date-fns";

export const SectionLabel: React.FC<{
  children: React.ReactNode;
  mb?: string;
  size?: string;
}> = ({ children, mb = "mb-2", size = "text-sm" }) => (
  <label
    className={`block font-bold text-slate-500 uppercase tracking-tight ${size} ${mb}`}
  >
    {children}
  </label>
);

export const InputWrapper: React.FC<{
  children: React.ReactNode;
  icon?: React.ReactNode;
}> = ({ children, icon }) => (
  <div className="relative group">
    {children}
    {icon && (
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-600 transition-colors pointer-events-none">
        {icon}
      </div>
    )}
  </div>
);

interface CustomSelectProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  options,
  onChange,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-100/80 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 cursor-pointer flex items-center justify-between hover:bg-slate-200/50 transition-all"
      >
        <span className="truncate">{value}</span>
        <div
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          {icon}
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className={`px-4 py-2.5 text-sm font-semibold cursor-pointer transition-colors ${
                value === opt
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const CustomDatePicker: React.FC<{
  value: string;
  onChange: (val: string) => void;
  icon?: React.ReactNode;
}> = ({ value, onChange, icon }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const displayDate = value ? format(parseISO(value), "dd MMM, yyyy") : "Pick a date";

  return (
    <div 
      className="relative group cursor-pointer"
      onClick={() => inputRef.current?.showPicker()}
    >
      <div className="w-full bg-slate-100/80 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 flex items-center justify-between hover:bg-slate-200/50 transition-all">
        <span>{displayDate}</span>
        <div className="text-slate-400 group-hover:text-slate-600 transition-colors">
          {icon}
        </div>
      </div>
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 cursor-pointer"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};
