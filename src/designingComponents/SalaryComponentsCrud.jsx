import { useState, useEffect } from "react";
import useApi from "../customHooks/useApi";
import CustomDropdown from "../designingComponents/CustomDropdown";
import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../contexts/ThemeContext";
import AuditLogsShimmer from "../shimmers/AuditLogsShimmer";

const SALARY_COMPONENT_NAMES = [
  "DA",
  "HRA",
  "SPECIAL_ALLOWANCE",
  "TRANSPORT_ALLOWANCE",
  "MEDICAL_ALLOWANCE",
  "PF",
  "ESI",
  "PT",
  "TDS",
  "OTHER_DEDUCTIONS",
];
const COMPONENT_TYPES = ["ALLOWANCE", "DEDUCTION"];

const fmt = (v) =>
  v === null || v === undefined || v === "" ? "NA" : String(v);
const fmtNum = (v) =>
  v === null || v === undefined || v === "" || isNaN(Number(v))
    ? "NA"
    : Number(v);

export default function SalaryComponentCrud({ baseUrl }) {
  const { theme, isDarkMode } = useTheme();
  const { get, post, put, del } = useApi(baseUrl);

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [filterType, setFilterType] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [loading, setIsLoading] = useState(true);

  const DEPARTMENTS = ["CSE", "HR", "EEE", "ECE", "MECH", "CIVIL"];

  const [formData, setFormData] = useState({
    name: "",
    fixedAmount: "",
    percentage: "",
    componentType: "",
    effectiveDate: "",
    department: "",
  });

  const ui = {
    pageBg: isDarkMode
      ? "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
      : "bg-gradient-to-b from-white via-slate-50 to-white",
    title: isDarkMode
      ? "bg-gradient-to-r from-teal-300 to-slate-300 bg-clip-text text-transparent"
      : "text-blue-600",
    cardWrap: `rounded shadow border ${
      isDarkMode
        ? "border-slate-700 bg-slate-900/70"
        : "border-slate-200 bg-white"
    } backdrop-blur-lg`,
    thead: `uppercase sticky top-0 z-10 ${
      isDarkMode
        ? "bg-slate-800/50 text-teal-300"
        : "bg-slate-100 text-blue-700"
    }`,
    row: isDarkMode
      ? "border-b border-slate-700 hover:bg-slate-800/60"
      : "border-b border-slate-200 hover:bg-slate-50",
    input: `w-full p-3 rounded-xl ${
      isDarkMode
        ? "bg-slate-800/70 border-slate-700"
        : "bg-white border-slate-300"
    } border backdrop-blur-sm focus:outline-none ${
      isDarkMode ? "focus:border-teal-400" : "focus:border-blue-500"
    }`,
    neutralBtn: isDarkMode
      ? "px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-2xl transition-all"
      : "px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-2xl transition-all",
    primaryBtn: isDarkMode
      ? "px-6 py-2 rounded-2xl font-bold shadow-lg hover:scale-105 transform transition-transform bg-teal-500 hover:bg-teal-400 text-white"
      : "px-6 py-2 rounded-2xl font-bold shadow-lg hover:scale-105 transform transition-transform bg-blue-500 hover:bg-blue-600 text-white",
    addBtn: isDarkMode
      ? "bg-teal-500 hover:bg-teal-400 text-white"
      : "bg-blue-500 hover:bg-blue-600 text-white",
    sidebar: isDarkMode
      ? "bg-slate-900/95 border-slate-700"
      : "bg-white border-slate-200",
    headerAccent: isDarkMode ? "text-teal-400" : "text-blue-600",
    eyeIcon: isDarkMode ? "text-teal-400" : "text-blue-500",
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await get();
      if (!Array.isArray(res)) return;
      const sorted = res.sort(
        (a, b) => new Date(b.effectiveDate) - new Date(a.effectiveDate)
      );
      setItems(sorted);
      setFilteredItems(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => fetchData(), 1000);
  }, [baseUrl]);

  useEffect(() => {
    let data = [...items];
    if (searchName)
      data = data.filter((c) =>
        c.name?.toLowerCase().includes(searchName.toLowerCase())
      );
    if (filterType) data = data.filter((c) => c.componentType === filterType);
    setFilteredItems(data);
  }, [searchName, filterType, items]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      fixedAmount:
        formData.fixedAmount === "" ? null : Number(formData.fixedAmount),
      percentage:
        formData.percentage === "" ? null : Number(formData.percentage),
      componentType: formData.componentType,
      effectiveDate: formData.effectiveDate,
      department: formData.department,
    };

    try {
      if (isEditMode && editId) await put(`/${editId}`, payload);
      else await post("", payload);
      setIsFormOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`px-2 h-full ${ui.pageBg}`}>
      <h1
        className={`text-lg sm:text-xl font-semibold mb-2 ${
          isDarkMode ? "text-teal-400" : "text-blue-400"
        }`}
      >
        Salary Components
      </h1>

      <div className="flex flex-col md:flex-row py-2 gap-3">
        <div className="flex flex-col sm:flex-row w-full gap-3">
          <input
            type="text"
            placeholder="Search by Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className={`flex-[3] px-4 py-1.5 rounded border focus:outline-none transition-all
    ${
      isDarkMode
        ? "bg-slate-900 text-slate-200 border-slate-700 focus:border-teal-400"
        : "bg-white text-slate-900 border-slate-300 focus:border-blue-500"
    }`}
          />

          <div className="flex-[1]">
            <CustomDropdown
              value={filterType}
              onChange={(val) => setFilterType(val)}
              options={["", ...COMPONENT_TYPES]}
              placeholder="All Types"
              className="w-full"
            />
          </div>

          <button
            onClick={() => {
              setIsEditMode(false);
              setEditId(null);
              setFormData({
                name: "",
                fixedAmount: "",
                percentage: "",
                componentType: "",
                effectiveDate: "",
              });
              setIsFormOpen(true);
            }}
            className={`flex-[1] flex items-center justify-center gap-2 px-0 py-1.5 rounded ${ui.addBtn} font-semibold shadow transition-transform hover:scale-105`}
          >
            <PlusIcon className="w-5 h-5" />
            Add
          </button>
        </div>
      </div>

      <div
        className={`overflow-x-auto sm:overflow-y-auto h-full sm:h-86 ${ui.cardWrap}`}
      >
        {loading ? (
          <AuditLogsShimmer />
        ) : (
          <table
            className={`w-full h-full sm:h-auto text-sm text-left ${
              isDarkMode ? "text-slate-200" : "text-slate-800"
            }`}
          >
            <thead className={ui.thead}>
              <tr>
                {[
                  "ID",
                  "Name",
                  "Component Type",
                  "Percentage",
                  "Fixed Amount",
                  "Effective Date",
                  "Actions",
                ].map((col) => (
                  <th
                    key={col}
                    className={`px-6 py-3 whitespace-nowrap text-nowrap ${
                      isDarkMode ? "text-teal-400" : "text-blue-400"
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredItems.length ? (
                filteredItems.map((c, idx) => (
                  <tr
                    key={c.id ?? `${c.name}-${idx}`}
                    className={`${ui.row} transition-colors`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{idx + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {fmt(c.name)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {fmt(c.componentType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {fmtNum(c.percentage)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {fmtNum(c.fixedAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {fmt(c.effectiveDate?.slice?.(0, 10))}
                    </td>
                    <td className="px-6 py-4 flex justify-center gap-3 text-xl whitespace-nowrap">
                      <EyeIcon
                        className="w-5 h-5 text-blue-400 hover:scale-125 cursor-pointer transition-transform"
                        title="View"
                        onClick={() => setViewItem(c)}
                      />
                      <PencilIcon
                        onClick={() => {
                          setIsEditMode(true);
                          setEditId(c.id);
                          setFormData({
                            name: c.name ?? "",
                            fixedAmount: c.fixedAmount ?? "",
                            percentage: c.percentage ?? "",
                            componentType: c.componentType ?? "",
                            effectiveDate:
                              c.effectiveDate?.slice?.(0, 10) ?? "",
                          });
                          setIsFormOpen(true);
                        }}
                        className="w-5 h-5 text-yellow-400 hover:scale-125 cursor-pointer transition-transform"
                        title="Update"
                      />
                      <TrashIcon
                        onClick={async () => {
                          if (!window.confirm("Delete this salary component?"))
                            return;
                          await del(`/${c.id}`);
                          fetchData();
                        }}
                        className="w-5 h-5 text-red-500 hover:scale-125 cursor-pointer transition-transform"
                        title="Delete"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-10 text-slate-500 dark:text-slate-400"
                  >
                    No salary components found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Form Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-lg ${
          ui.sidebar
        } shadow-2xl border-l z-50 transform transition-transform duration-500 ease-in-out ${
          isFormOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-8 flex flex-col h-full overflow-y-auto">
          <h2 className={`text-2xl font-bold mb-6 ${ui.headerAccent}`}>
            {isEditMode ? "Update Salary Component" : "Add Salary Component"}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <CustomDropdown
              label="Name"
              value={formData.name}
              onChange={(val) => setFormData((p) => ({ ...p, name: val }))}
              options={SALARY_COMPONENT_NAMES}
              placeholder="Select component"
              className={isDarkMode ? "text-slate-200" : "text-slate-800"}
            />

            <CustomDropdown
              label="Component Type"
              value={formData.componentType}
              onChange={(val) =>
                setFormData((p) => ({ ...p, componentType: val }))
              }
              options={COMPONENT_TYPES}
              placeholder="Select type"
              className={isDarkMode ? "text-slate-200" : "text-slate-800"}
            />

            <CustomDropdown
              label="Department"
              value={formData.department}
              onChange={(val) =>
                setFormData((p) => ({ ...p, department: val }))
              }
              options={DEPARTMENTS}
              placeholder="Select department"
              className={isDarkMode ? "text-slate-200" : "text-slate-800"}
            />

            <div>
              <label
                className={`block text-sm mb-1 ${
                  isDarkMode ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Percentage
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.percentage}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, percentage: e.target.value }))
                }
                className={`w-full p-3 rounded-xl border transition-all
        ${
          isDarkMode
            ? "bg-slate-800/70 border-slate-700 text-slate-200 focus:border-teal-400"
            : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"
        }`}
              />
            </div>

            <div>
              <label
                className={`block text-sm mb-1 ${
                  isDarkMode ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Fixed Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.fixedAmount}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, fixedAmount: e.target.value }))
                }
                className={`w-full p-3 rounded-xl border transition-all
        ${
          isDarkMode
            ? "bg-slate-800/70 border-slate-700 text-slate-200 focus:border-teal-400"
            : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"
        }`}
              />
            </div>

            <div>
              <label
                className={`block text-sm mb-1 ${
                  isDarkMode ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Effective Date
              </label>
              <input
                type="date"
                value={formData.effectiveDate}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, effectiveDate: e.target.value }))
                }
                className={`w-full p-3 rounded-xl border transition-all
        ${
          isDarkMode
            ? "bg-slate-800/70 border-slate-700 text-slate-200 focus:border-teal-400"
            : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"
        }`}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className={ui.neutralBtn}
              >
                Cancel
              </button>
              <button type="submit" className={ui.primaryBtn}>
                {isEditMode ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* View Sidebar */}
      {viewItem && (
        <div
          onClick={() => setViewItem(null)}
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md ${
          ui.sidebar
        } shadow-2xl border-l z-50 transform transition-transform duration-500 ease-in-out ${
          viewItem ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-8 flex flex-col h-full overflow-y-auto">
          <h2 className={`text-2xl font-bold mb-6 ${ui.headerAccent}`}>
            Salary Component Details
          </h2>

          <div
            className={`flex flex-col gap-4 text-lg ${
              isDarkMode ? "text-slate-200" : "text-slate-800"
            }`}
          >
            <div>
              <strong>Name:</strong> {viewItem?.name}
            </div>
            <div>
              <strong>Component Type:</strong> {viewItem?.componentType}
            </div>
            <div>
              <strong>Percentage:</strong> {fmtNum(viewItem?.percentage)}
            </div>
            <div>
              <strong>Fixed Amount:</strong> {fmtNum(viewItem?.fixedAmount)}
            </div>
            <div>
              <strong>Effective Date:</strong>{" "}
              {viewItem?.effectiveDate?.slice(0, 10)}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button onClick={() => setViewItem(null)} className={ui.neutralBtn}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
