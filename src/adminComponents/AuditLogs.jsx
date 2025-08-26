import { useState, useEffect } from "react";
import useApi from "../customHooks/useApi";
import AuditLogsShimmer from "../shimmers/AuditLogsShimmer";
import { useTheme } from "../contexts/ThemeContext";

export default function AuditLogs() {
  const theme = useTheme();
  const isDarkMode = theme.isDarkMode;

  const { get, loading } = useApi(
    "https://salarygenbackend-3.onrender.com/api/admin/audit-logs"
  );

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [day, setDay] = useState("");
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [showShimmer, setShowShimmer] = useState(true);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setShowShimmer(false), 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    (async () => {
      try {
        const res = await get("");
        const sortedLogs = (res || []).sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setLogs(sortedLogs);
        setFilteredLogs(sortedLogs.slice(0, 5));
      } catch (err) {
        console.error("Error fetching audit logs:", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (!month && !year && !day) {
      setFilteredLogs(logs.slice(0, 5));
      setIsFiltered(false);
    }
  }, [month, year, day, logs]);

  const handleFilter = (e) => {
    e.preventDefault();

    if (!month && !year && !day) {
      setFilteredLogs(logs.slice(0, 5));
      setIsFiltered(false);
      return;
    }

    if (!month || !year) {
      alert("Please enter month and year.");
      return;
    }

    const filtered = logs.filter((log) => {
      if (!log.timestamp) return false;
      const logDate = new Date(log.timestamp);
      const m = logDate.getMonth() + 1;
      const y = logDate.getFullYear();
      const d = logDate.getDate();
      return (
        m === parseInt(month, 10) &&
        y === parseInt(year, 10) &&
        (day ? d === parseInt(day, 10) : true)
      );
    });

    setFilteredLogs(filtered);
    setIsFiltered(true);
  };

  const handleClear = () => {
    setMonth("");
    setYear("");
    setDay("");
    setFilteredLogs(logs.slice(0, 5));
    setIsFiltered(false);
  };

  const headingText = isFiltered
    ? `LOGS ON : ${day ? `${day}/${month}/${year}` : `${month}/${year}`}`
    : "RECENT LOGS";

  const formatDate = (timestamp) => {
    const dateObj = new Date(timestamp);
    if (isNaN(dateObj)) return { date: "NA", time: "NA" };
    return {
      date: dateObj.toLocaleDateString(),
      time: dateObj.toLocaleTimeString(),
    };
  };

  return (
    <div className="px-1 sm:px-6 sm:py-2 space-y-6">
      <h2
        className={`text-xl bg-clip-text text-transparent ${
          isDarkMode
            ? "bg-gradient-to-r from-cyan-300 to-slate-300"
            : "bg-gradient-to-r from-blue-400 to-slate-500"
        }`}
      >
        GENERATE LOGS
      </h2>

      <form
        onSubmit={handleFilter}
        className={`flex flex-wrap gap-4 p-4 rounded-lg border shadow-lg transition-all
          ${
            isDarkMode
              ? "bg-slate-900 border-slate-700"
              : "bg-white border-slate-300"
          }`}
      >
        <div className="flex flex-col flex-1 min-w-[100px]">
          <label
            className={`text-sm mb-1 text-center ${
              isDarkMode ? "text-slate-300" : "text-slate-700"
            }`}
          >
            Month
          </label>
          <input
            type="text"
            placeholder="MM"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className={`w-full px-3 py-2 rounded border text-center focus:outline-none transition-all
              ${
                isDarkMode
                  ? "bg-slate-800 text-slate-200 border-slate-600 focus:border-teal-400"
                  : "bg-white text-slate-900 border-slate-300 focus:border-blue-500"
              }`}
          />
        </div>

        <div className="flex flex-col flex-1 min-w-[100px]">
          <label
            className={`text-sm mb-1 text-center ${
              isDarkMode ? "text-slate-300" : "text-slate-700"
            }`}
          >
            Year
          </label>
          <input
            type="text"
            placeholder="YYYY"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={`w-full px-3 py-2 rounded border text-center focus:outline-none transition-all
              ${
                isDarkMode
                  ? "bg-slate-800 text-slate-200 border-slate-600 focus:border-teal-400"
                  : "bg-white text-slate-900 border-slate-300 focus:border-blue-500"
              }`}
          />
        </div>

        <div className="flex flex-col flex-1 min-w-[100px]">
          <label
            className={`text-sm mb-1 text-center ${
              isDarkMode ? "text-slate-300" : "text-slate-700"
            }`}
          >
            Day
          </label>
          <input
            type="text"
            placeholder="DD"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className={`w-full px-3 py-2 rounded border text-center focus:outline-none transition-all
              ${
                isDarkMode
                  ? "bg-slate-800 text-slate-200 border-slate-600 focus:border-teal-400"
                  : "bg-white text-slate-900 border-slate-300 focus:border-blue-500"
              }`}
          />
        </div>

        <div className="flex flex-col flex-1 min-w-[100px]">
          <label className="text-transparent text-sm mb-1 select-none">
            Filter
          </label>
          <button
            type="submit"
            className={`w-full px-4 py-2 rounded font-semibold shadow transition-transform hover:scale-105
      ${
        isDarkMode
          ? "bg-teal-600 hover:bg-teal-500 text-slate-100"
          : "bg-blue-400 hover:bg-blue-300 text-white"
      }`}
          >
            Filter
          </button>
        </div>

        <div className="flex flex-col flex-1 min-w-[100px]">
          <label className="text-transparent text-sm mb-1 select-none">
            Clear
          </label>
          <button
            type="button"
            onClick={handleClear}
            className={`w-full px-4 py-2 rounded font-semibold shadow transition-transform hover:scale-105
      ${
        isDarkMode
          ? "bg-slate-700 hover:bg-slate-600 text-slate-200"
          : "bg-slate-300 hover:bg-slate-400 text-slate-900"
      }`}
          >
            Clear
          </button>
        </div>
      </form>

      <h1
        className={`text-xl bg-clip-text text-transparent ${
          isDarkMode
            ? "bg-gradient-to-r from-cyan-300 to-slate-300"
            : "bg-gradient-to-r from-blue-400 to-slate-500"
        }`}
      >
        {headingText}
      </h1>

      {loading || showShimmer ? (
        <AuditLogsShimmer />
      ) : filteredLogs.length === 0 ? (
        <p className={isDarkMode ? "text-slate-400" : "text-slate-600"}>
          No logs found for the selected date.
        </p>
      ) : (
        <div
          className={`overflow-x-auto rounded shadow-lg border backdrop-blur-lg transition-all
    ${
      isDarkMode
        ? "border-slate-700 bg-slate-900"
        : "border-slate-300 bg-slate-50"
    }`}
        >
          <table
            className={`w-full text-sm text-left whitespace-nowrap transition-all
      ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}
          >
            <thead
              className={`uppercase sticky top-0 z-10 transition-all
        ${
          isDarkMode
            ? "text-teal-300 bg-slate-800"
            : "text-blue-400 bg-slate-200"
        }`}
            >
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">Entity</th>
                <th className="px-6 py-3">Entity ID</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => {
                const { date, time } = formatDate(log.timestamp);
                return (
                  <tr
                    key={index}
                    className={`border-b transition-colors ${
                      isDarkMode
                        ? `border-slate-700 hover:bg-slate-700/60 ${
                            index % 2 === 0 ? "bg-slate-800" : "bg-slate-900"
                          }`
                        : `border-slate-300 hover:bg-slate-100 ${
                            index % 2 === 0 ? "bg-white" : "bg-slate-50"
                          }`
                    }`}
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{log.username || "NA"}</td>
                    <td className="px-6 py-4">{log.action || "NA"}</td>
                    <td className="px-6 py-4">{log.entityName || "NA"}</td>
                    <td className="px-6 py-4">{log.entityId || "NA"}</td>
                    <td className="px-6 py-4">{date}</td>
                    <td className="px-6 py-4">{time}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
