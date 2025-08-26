import { useTheme } from "../contexts/ThemeContext";

export default function AuditLogsShimmer() {
  const theme = useTheme();
  const isDarkMode = theme.isDarkMode;

  const shimmerGradient = isDarkMode
    ? "linear-gradient(90deg, rgba(100,116,139,0.1) 0%, rgba(100,116,139,0.2) 50%, rgba(100,116,139,0.1) 100%)"
    : "linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(148,163,184,0.4) 50%, rgba(255,255,255,0.2) 100%)";

  const shimmerStyle = {
    background: shimmerGradient,
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  const TableSkeleton = () => (
    <div
      className={`overflow-x-auto rounded shadow-lg border ${
        isDarkMode ? "border-slate-700" : "border-slate-300"
      } ${isDarkMode ? "bg-slate-800" : "bg-white"}`}
    >
      <table
        className={`w-full text-sm text-left ${
          isDarkMode ? "text-slate-300" : "text-slate-900"
        }`}
      >
        <thead
          className={`${
            isDarkMode
              ? "text-teal-300 bg-slate-900/60"
              : "text-teal-700 bg-slate-100"
          }`}
        >
          <tr>
            {["#", "User", "Action", "Entity", "Entity ID", "Date", "Time"].map(
              (_, idx) => (
                <th key={idx} className="px-6 py-3">
                  <div
                    className={`h-6 rounded overflow-hidden relative ${
                      isDarkMode ? "bg-slate-700" : "bg-white"
                    }`}
                  >
                    <div style={shimmerStyle}></div>
                  </div>
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {Array(5)
            .fill("")
            .map((_, rowIdx) => (
              <tr
                key={rowIdx}
                className={`border-b ${
                  isDarkMode
                    ? "border-slate-700 hover:bg-slate-700/50"
                    : "border-slate-300 hover:bg-slate-200/50"
                } transition-colors`}
              >
                {Array(7)
                  .fill("")
                  .map((__, colIdx) => (
                    <td key={colIdx} className="px-6 py-4">
                      <div
                        className={`h-6 rounded overflow-hidden relative ${
                          isDarkMode ? "bg-slate-700" : "bg-white"
                        }`}
                      >
                        <div style={shimmerStyle}></div>
                      </div>
                    </td>
                  ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6">
      <TableSkeleton />
    </div>
  );
}
