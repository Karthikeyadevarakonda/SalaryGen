import { useState, useEffect } from "react";
import useApi from "../customHooks/useApi";
import { useTheme } from "../contexts/ThemeContext";

export default function GenerateSalaries() {
  const theme = useTheme();
  const isDarkMode = theme.isDarkMode;

  const [showForm, setShowForm] = useState(false);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { data: results, loading, error, post } = useApi(
    "http://localhost:8081/api/hr/salary-transactions"
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentYear = new Date().getFullYear();

    if (parseInt(year) > currentYear) {
      setErrorMessage(`Year cannot be greater than ${currentYear}`);
      setYear("");
      setMonth("");
      return;
    }

    if (parseInt(month) < 1 || parseInt(month) > 12) {
      setErrorMessage("Month must be between 01 and 12");
      setYear("");
      setMonth("");
      return;
    }

    try {
      await post(`/generate?year=${year}&month=${month}`);
    } catch (err) {
      console.error("ERROR IN GENERATING SALARY ", err);
    }
  };

  // Auto-hide error after 3 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const bgForm = isDarkMode ? "bg-slate-900" : "bg-white";
  const textPrimary = isDarkMode ? "text-white" : "text-blue-400";
  const textSecondary = isDarkMode ? "text-teal-400" : "text-blue-400";
  const borderColor = isDarkMode ? "border border-slate-600" : "border border-blue-300";
  const inputBg = isDarkMode ? "bg-slate-800 text-white" : "bg-white text-slate-900";
  const buttonGradient = isDarkMode
    ? "bg-gradient-to-r from-teal-500 to-slate-400 hover:from-teal-400 hover:to-green-300 text-slate-900"
    : "bg-gradient-to-r from-blue-400 to-slate-200 hover:from-blue-300 hover:to-blue-100 text-slate-900";

  return (
    <div className={`max-w-6xl mx-auto p-4 sm:p-6 ${textPrimary}`}>
      {/* Error Popup (Toast) */}
      {errorMessage && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-xl shadow-lg w-[90%] sm:w-auto z-50 text-center font-medium transition-all duration-500
            ${isDarkMode ? "bg-red-500 text-white" : "bg-red-100 text-red-700"}`}
        >
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-8">
        <h1
          className={`text-lg sm:text-xl font-semibold bg-clip-text text-transparent 
            ${
              isDarkMode
                ? "bg-gradient-to-r from-cyan-300 to-slate-300"
                : "bg-gradient-to-r from-blue-400 to-slate-400"
            }`}
        >
          SALARY REPORTS
        </h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-3 sm:px-4 py-1.5 rounded shadow font-semibold transition-transform hover:scale-105 text-sm sm:text-base w-full sm:w-auto
            ${
              isDarkMode
                ? "bg-gradient-to-r from-teal-500 to-slate-400 hover:from-teal-400 hover:to-green-300 text-slate-900"
                : "bg-gradient-to-r from-blue-400 to-slate-200 hover:from-blue-300 hover:to-blue-100 text-slate-900"
            }`}
        >
          {showForm ? "Close Form" : "Generate Salary"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className={`${bgForm} p-4 sm:p-6 rounded-2xl shadow-lg mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-end`}
        >
          <div>
            <label
              className={`block mb-1 font-medium text-sm sm:text-base ${textSecondary}`}
            >
              Year
            </label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value.replace(/\D/, ""))}
              required
              placeholder="e.g. 2025"
              className={`w-full px-3 py-2 rounded-md ${inputBg} ${borderColor} 
                focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none
                transition h-8 sm:h-10 text-sm sm:text-base`}
            />
          </div>

          <div>
            <label
              className={`block mb-1 font-medium text-sm sm:text-base ${textSecondary}`}
            >
              Month
            </label>
            <input
              type="text"
              value={month}
              onChange={(e) => setMonth(e.target.value.replace(/\D/g, ""))}
              required
              placeholder="01 - 12"
              className={`w-full px-3 py-2 rounded-md ${inputBg} ${borderColor} 
                focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none
                transition h-8 sm:h-10 text-sm sm:text-base`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-3 py-2 rounded shadow font-semibold transition-transform hover:scale-105 
              h-8 sm:h-10 text-sm sm:text-base ${buttonGradient}`}
          >
            {loading ? "Generating..." : "Submit"}
          </button>
        </form>
      )}

      {error && (
        <p
          className={`text-center mb-6 font-medium ${
            isDarkMode ? "text-red-400" : "text-red-600"
          }`}
        >
          {error}
        </p>
      )}

      {results && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-6 rounded-2xl border shadow-lg hover:shadow-2xl transition 
                ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
                <h2
                  className={`text-sm sm:text-lg font-bold ${
                    isDarkMode ? "text-teal-400" : "text-gray-500"
                  }`}
                >
                  Staff ID: {item.staffId}
                </h2>
                <span className={`text-xs sm:text-sm ${textSecondary}`}>
                  {new Date(item.generatedDate).toLocaleDateString()}
                </span>
              </div>

              <div className="space-y-1 text-sm sm:text-base">
                <p>
                  <span className={textSecondary}>Salary Month:</span>{" "}
                  {item.salaryMonth}
                </p>
                <p>
                  <span className={textSecondary}>Basic Pay:</span> ₹
                  {item.basicPay.toLocaleString()}
                </p>
                <p>
                  <span className={textSecondary}>Gross Salary:</span> ₹
                  {item.grossSalary.toLocaleString()}
                </p>
                <p>
                  <span className={textSecondary}>Total Deductions:</span> ₹
                  {item.totalDeductions.toLocaleString()}
                </p>
                <p
                  className={`text-base sm:text-lg font-bold ${textPrimary}`}
                >
                  <span
                    className={`text-sm sm:text-lg font-bold ${
                      isDarkMode ? "text-teal-400" : "text-gray-500"
                    }`}
                  >
                    Net Salary:
                  </span>{" "}
                  ₹{item.netSalary.toLocaleString()}
                </p>
              </div>

              {item.componentBreakdown &&
                Object.keys(item.componentBreakdown).length > 0 && (
                  <div className="mt-4">
                    <h3
                      className={` mb-2 text-sm sm:text-base font-semibold ${
                        isDarkMode ? "text-teal-400" : "text-gray-400"
                      }`}
                    >
                      Component Breakdown:
                    </h3>
                    <ul className="grid grid-cols-1 xs:grid-cols-2 gap-x-4 gap-y-1 text-xs sm:text-sm">
                      {Object.entries(item.componentBreakdown).map(
                        ([comp, value]) => (
                          <li key={comp}>
                            {comp}: ₹{value.toLocaleString()}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
