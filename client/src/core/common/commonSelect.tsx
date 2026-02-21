import  { useEffect, useState } from "react";
import Select from "react-select";

export type Option = {
  value: string;
  label: string;
};

export interface SelectProps {
  options: Option[];
  defaultValue?: Option;
  value?: string | null;
  onChange?: (value: string | null) => void;
  className?: string;
  styles?: any; 
}

const CommonSelect: React.FC<SelectProps> = ({ options, defaultValue, value, onChange, className }) => {
  const [selectedOption, setSelectedOption] = useState<Option | undefined>(defaultValue);

  // const customStyles = {
  //   option: (base: any, state: any) => ({
  //     ...base,
  //     color: "#6A7287",
  //     backgroundColor: state.isSelected ? "#ddd" : "white",
  //     cursor: "pointer",
  //     "&:hover": {
  //       backgroundColor: state.isFocused ? "#3D5EE1" : "blue",
  //       color: state.isFocused ? "#fff" : "#6A7287",
  //     },
  //   }),
  // };

  const handleChange = (option: Option | null) => {
    setSelectedOption(option || undefined);
    // Call the onChange callback with the value
    if (onChange) {
      onChange(option ? option.value : null);
    }
  };

  // Update selectedOption when value prop changes (controlled mode)
  // Only run when value is explicitly passed - when undefined, use defaultValue (uncontrolled)
  useEffect(() => {
    if (value !== undefined) {
      if (value) {
        const option = options.find(opt => opt.value === value);
        setSelectedOption(option ?? undefined);
      } else {
        setSelectedOption(undefined);
      }
    }
  }, [value, options]);

  useEffect(() => {
    setSelectedOption(defaultValue || undefined);
  }, [defaultValue])
  
  return (
    <Select
     classNamePrefix="react-select"
      className={className}
      // styles={customStyles}
      options={options}
      value={selectedOption}
      onChange={handleChange}
      placeholder="Select"
    />
  );
};

export default CommonSelect;
