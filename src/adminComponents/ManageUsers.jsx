import { useState, useEffect } from "react";
import useApi from "../customHooks/useApi";
import Loading from "../designingComponents/Loading";
import CustomDropdown from "../designingComponents/CustomDropdown";

import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import ManageUsersShimmer from "../shimmers/ManageUsersShimmer";
import SalaryComponentCrud from "../designingComponents/SalaryComponentsCrud";
import { FaChartPie } from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";

const SALARY_COMPONENTS = [
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

const formatValue = (value) =>
  value === null || value === undefined || value === "" ? "NA" : value;

const StaffTable = ({
  staffList,
  loading,
  onView,
  onEdit,
  onDelete,
  onComponents,
}) => {
  const { colors, isDarkMode } = useTheme();

  return (
    <div
      className={`overflow-x-auto sm:overflow-y-auto h-full sm:h-92 rounded shadow border ${colors.border} ${colors.card} backdrop-blur-lg`}
    >
      <table className="w-full text-sm text-left">
        <thead
          className={`${colors.textSecondary} uppercase ${colors.secondary}`}
        >
          <tr>
            {[
              "ID",
              "Name",
              "Department",
              "Joining Date",
              "Actions",
              "Components",
            ].map((col) => (
              <th
                key={col}
                className={`px-6 py-3 ${
                  isDarkMode ? "bg-slate-900" : "bg-slate-100"
                } text-nowrap whitespace-nowrap`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={colors.text}>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center py-8">
                <Loading />
              </td>
            </tr>
          ) : (
            staffList.map((staff, index) => (
              <tr
                key={staff.id}
                className={`${colors.border} border-b hover:${colors.hover} transition-colors`}
              >
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{formatValue(staff.name)}</td>
                <td className="px-6 py-4">{formatValue(staff.department)}</td>
                <td className="px-6 py-4">{formatValue(staff.joiningDate)}</td>
                <td className="px-6 py-4 flex gap-3 text-xl">
                  <EyeIcon
                    onClick={() => onView(staff)}
                    className="w-5 h-4 text-blue-500 dark:text-blue-400 hover:scale-110 cursor-pointer transition-transform"
                  />
                  <PencilIcon
                    onClick={() => onEdit(staff)}
                    className="w-5 h-4 text-yellow-500 dark:text-yellow-400 hover:scale-110 cursor-pointer transition-transform"
                  />
                  <TrashIcon
                    onClick={() => onDelete(staff.id)}
                    className="w-5 h-4 text-red-600 dark:text-red-500 hover:scale-110 cursor-pointer transition-transform"
                  />
                </td>
                <td className="px-6 py-4 text-center align-middle">
                  <FaChartPie
                    onClick={() => onComponents(staff)}
                    className="mx-auto inline-block w-5 h-5 text-indigo-600 dark:text-indigo-400 hover:scale-110 cursor-pointer transition-transform"
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const StaffFormPanel = ({
  isOpen,
  isEditMode,
  formData,
  setFormData,
  onClose,
  onSubmit,
  toggleComponent,
}) => {
  const { colors } = useTheme();

  const fields = [
    { name: "name", placeholder: "Name" },
    { type: "date", name: "joiningDate" },
    { name: "department", placeholder: "Department" },
    {
      type: "number",
      name: "basicPay",
      placeholder: "Basic Pay",
      nested: "salaryDetails",
    },
    {
      type: "number",
      name: "bankAccountNumber",
      placeholder: "Bank Account Number",
      nested: "salaryDetails",
    },
    { name: "ifscCode", placeholder: "IFSC Code", nested: "salaryDetails" },
    { name: "bankName", placeholder: "Bank Name", nested: "salaryDetails" },
  ];

  return (
    <div
      className={`fixed top-0 right-0 w-full max-w-lg shadow-2xl border-l z-50 transform transition-transform duration-500 ease-in-out
        ${colors.primary} ${colors.border} 
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="p-8 flex flex-col h-full overflow-y-auto">
        <h2 className={`text-2xl font-semibold mb-6 ${colors.text}`}>
          {isEditMode ? "Update Staff" : "Add Staff"}
        </h2>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {!isEditMode && (
            <>
              <div>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
                  placeholder="Unique Username"
                  required
                  className={`w-full p-3 rounded-lg border focus:outline-none ${colors.input} ${colors.text} ${colors.border} focus:${colors.accent}`}
                />
                <span className="text-xs mt-1 inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full shadow">
                  Must be unique
                </span>
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Email"
                required
                className={`w-full p-3 rounded-lg border focus:outline-none ${colors.input} ${colors.text} ${colors.border} focus:${colors.accent}`}
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Password"
                required
                className={`w-full p-3 rounded-lg border focus:outline-none ${colors.input} ${colors.text} ${colors.border} focus:${colors.accent}`}
              />
              <CustomDropdown
                label="Role"
                value={formData.role}
                onChange={(val) => setFormData({ ...formData, role: val })}
                options={["ADMIN", "HR", "STAFF"]}
                placeholder="Select a role"
              />
            </>
          )}

          {fields.map((field, idx) => {
            const value =
              field.nested === "salaryDetails"
                ? formData.salaryDetails[field.name]
                : formData[field.name];

            return (
              <input
                key={idx}
                type={field.type || "text"}
                name={field.name}
                value={value}
                onChange={(e) =>
                  field.nested
                    ? setFormData({
                        ...formData,
                        [field.nested]: {
                          ...formData[field.nested],
                          [field.name]: e.target.value,
                        },
                      })
                    : setFormData({ ...formData, [field.name]: e.target.value })
                }
                placeholder={field.placeholder}
                required
                className={`w-full p-3 rounded-lg border focus:outline-none
                  ${colors.input} ${colors.text} ${colors.border} 
                  focus:${colors.accent}`}
              />
            );
          })}

          <div className="flex flex-wrap gap-2 mt-2">
            {SALARY_COMPONENTS.map((comp) => {
              const isSelected =
                formData.salaryDetails.salaryComponents.includes(comp);

              return (
                <button
                  type="button"
                  key={comp}
                  onClick={() => toggleComponent(comp)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all
                    ${
                      isSelected
                        ? `${colors.accent} text-white shadow-md scale-105`
                        : `${colors.secondary} ${colors.text} ${colors.border} hover:${colors.hover}`
                    }`}
                >
                  {comp}
                </button>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2 rounded-lg font-semibold ${colors.buttonSecondary} ${colors.text}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 rounded-lg font-bold text-white ${colors.button}`}
            >
              {isEditMode ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StaffViewModal = ({ staff, onClose }) => {
  const { isDarkMode, colors } = useTheme();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className={`${colors.card} p-8 rounded-xl w-11/12 max-w-xl relative border ${colors.border} shadow-lg`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-600 dark:text-red-400 text-2xl hover:scale-110 transition-transform"
        >
          ×
        </button>

        <h2
          className={`text-2xl font-semibold mb-4 ${
            isDarkMode ? "text-teal-400" : "text-slate-800"
          }`}
        >
          Staff Details
        </h2>

        <div
          className={`space-y-3 ${
            isDarkMode ? "text-slate-300" : "text-slate-700"
          }`}
        >
          <p>
            <span className={isDarkMode ? "text-teal-300" : "text-slate-900"}>
              Name:
            </span>{" "}
            {formatValue(staff.name)}
          </p>
          <p>
            <span className={isDarkMode ? "text-teal-300" : "text-slate-900"}>
              Department:
            </span>{" "}
            {formatValue(staff.department)}
          </p>
          <p>
            <span className={isDarkMode ? "text-teal-300" : "text-slate-900"}>
              Joining Date:
            </span>{" "}
            {formatValue(staff.joiningDate)}
          </p>
          <p>
            <span className={isDarkMode ? "text-teal-300" : "text-slate-900"}>
              Basic Pay:
            </span>{" "}
            {formatValue(staff.salaryDetails?.basicPay)}
          </p>
          <p>
            <span className={isDarkMode ? "text-teal-300" : "text-slate-900"}>
              Bank Account:
            </span>{" "}
            {formatValue(staff.salaryDetails?.bankAccountNumber)}
          </p>
          <p>
            <span className={isDarkMode ? "text-teal-300" : "text-slate-900"}>
              IFSC Code:
            </span>{" "}
            {formatValue(staff.salaryDetails?.ifscCode)}
          </p>
          <p>
            <span className={isDarkMode ? "text-teal-300" : "text-slate-900"}>
              Bank Name:
            </span>{" "}
            {formatValue(staff.salaryDetails?.bankName)}
          </p>
          <p>
            <span className={isDarkMode ? "text-teal-300" : "text-slate-900"}>
              Salary Components:
            </span>{" "}
            {staff.salaryDetails?.salaryComponents?.join(", ") || "NA"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function ManageUsers() {
  const { colors, isDarkMode } = useTheme();

  const { get, post, put, del, loading } = useApi(
    "https://salarygenbackend-3.onrender.com/api/admin/staff"
  );
  const [staffList, setStaffList] = useState([]);
  const [filteredStaffList, setFilteredStaffList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [isFormPanelOpen, setIsFormPanelOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showComponentsFor, setShowComponentsFor] = useState(null);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    role: "STAFF",
    name: "",
    joiningDate: "",
    department: "",
    salaryDetails: {
      basicPay: "",
      bankAccountNumber: "",
      ifscCode: "",
      bankName: "",
      salaryComponents: [],
    },
  });

  const [shimmerDelay, setShimmerDelay] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShimmerDelay(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    const filtered = staffList.filter(
      (staff) =>
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.id.toString().includes(searchTerm)
    );
    setFilteredStaffList(filtered);
  }, [searchTerm, staffList]);

  const fetchStaff = async () => {
    try {
      const res = await get();
      const sorted = (res || []).sort((a, b) => Number(a.id) - Number(b.id));
      setStaffList(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      userName: "",
      email: "",
      password: "",
      role: "STAFF",
      name: "",
      joiningDate: "",
      department: "",
      salaryDetails: {
        basicPay: "",
        bankAccountNumber: "",
        ifscCode: "",
        bankName: "",
        salaryComponents: [],
      },
    });
  };

  const handleAddClick = () => {
    setIsEditMode(false);
    setEditId(null);
    resetForm();
    setIsFormPanelOpen(true);
  };

  const handleEditClick = (staff) => {
    setIsEditMode(true);
    setEditId(staff.id);
    setFormData({
      name: staff.name,
      joiningDate: staff.joiningDate,
      department: staff.department,
      salaryDetails: {
        basicPay: staff.salaryDetails?.basicPay || "",
        bankAccountNumber: staff.salaryDetails?.bankAccountNumber || "",
        ifscCode: staff.salaryDetails?.ifscCode || "",
        bankName: staff.salaryDetails?.bankName || "",
        salaryComponents: staff.salaryDetails?.salaryComponents || [],
      },
    });
    setIsFormPanelOpen(true);
  };

  const handleViewClick = (staff) => {
    setSelectedStaff(staff);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Delete this staff member?")) return;
    try {
      await del(`/${id}`);
      fetchStaff();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      salaryDetails: {
        ...formData.salaryDetails,
        basicPay: parseFloat(formData.salaryDetails.basicPay),
      },
    };
    try {
      if (isEditMode && editId) {
        await put(`/${editId}`, payload);
      } else {
        await post("", {
          userName: formData.userName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          ...payload,
        });
      }
      setIsFormPanelOpen(false);
      fetchStaff();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComponent = (comp) => {
    setFormData((prev) => {
      const comps = prev.salaryDetails.salaryComponents;
      return {
        ...prev,
        salaryDetails: {
          ...prev.salaryDetails,
          salaryComponents: comps.includes(comp)
            ? comps.filter((c) => c !== comp)
            : [...comps, comp],
        },
      };
    });
  };

  return (
    <div className="">
      {loading || shimmerDelay ? (
        <ManageUsersShimmer />
      ) : showComponentsFor ? (
        <>
          <button
            onClick={() => setShowComponentsFor(null)}
            className="mb-4 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg font-semibold"
          >
            ← Back to Staff List
          </button>

          <SalaryComponentCrud
            baseUrl={`https://salarygenbackend-3.onrender.com/api/hr/salary-components/staff/${showComponentsFor.id}`}
            staffName={showComponentsFor.name}
          />
        </>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by ID, Name or Department"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`px-4 py-2 rounded-lg w-full md:w-2/3 focus:outline-none border ${colors.input} ${colors.text} ${colors.border} focus:${colors.accent}`}
            />
            <button
              onClick={handleAddClick}
              className={`flex w-full sm:w-auto items-center gap-2 px-4 py-2 rounded font-semibold ${colors.button} text-white`}
            >
              <PlusIcon className="w-5 h-5" />
              Add Staff
            </button>
          </div>

          <StaffTable
            staffList={filteredStaffList}
            loading={loading}
            onView={handleViewClick}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onComponents={(staff) => setShowComponentsFor(staff)}
          />
        </>
      )}

      <StaffFormPanel
        isOpen={isFormPanelOpen}
        isEditMode={isEditMode}
        formData={formData}
        setFormData={setFormData}
        onClose={() => setIsFormPanelOpen(false)}
        onSubmit={handleSubmit}
        toggleComponent={toggleComponent}
      />

      {isViewModalOpen && (
        <StaffViewModal
          staff={selectedStaff}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}
    </div>
  );
}
