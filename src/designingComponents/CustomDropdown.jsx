// designingComponents/CustomDropdown.jsx
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../contexts/ThemeContext" 

const CustomDropdown = ({ label, value, onChange, options, placeholder }) => {
  const theme = useTheme();
  const isDarkMode = theme.isDarkMode;

  return (
    <div className="w-full">
      {label && (
        <label
          className={`block text-sm mb-1 ${
            isDarkMode ? "text-slate-300" : "text-slate-700"
          }`}
        >
          {label}
        </label>
      )}

      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          {/* Button */}
          <Listbox.Button
            className={`relative w-full cursor-pointer rounded-lg border py-2 pl-3 pr-10 text-left focus:outline-none sm:text-sm transition-all
              ${
                isDarkMode
                  ? "bg-slate-900 border-slate-600 text-slate-200 focus:border-teal-500"
                  : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"
              }`}
          >
            <span className="block truncate">
              {value || placeholder || "Select"}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className={`h-5 w-5 ${
                  isDarkMode ? "text-slate-400" : "text-slate-500"
                }`}
              />
            </span>
          </Listbox.Button>

          {/* Options */}
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className={`absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border py-1 text-base shadow-lg focus:outline-none sm:text-sm
                ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-600 text-slate-200"
                    : "bg-white border-slate-300 text-slate-800"
                }`}
            >
              {options.map((opt, idx) => (
                <Listbox.Option
                  key={idx}
                  value={opt}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active
                        ? isDarkMode
                          ? "bg-teal-600 text-white"
                          : "bg-blue-500 text-white"
                        : isDarkMode
                        ? "text-slate-200"
                        : "text-slate-800"
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {opt || "All"}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            isDarkMode ? "text-white" : "text-blue-600"
                          }`}
                        >
                          <CheckIcon className="h-5 w-5" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default CustomDropdown;
