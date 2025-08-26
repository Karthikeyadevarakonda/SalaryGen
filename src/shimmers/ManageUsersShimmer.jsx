import { useTheme } from "../contexts/ThemeContext";

export default function ManageUsersShimmer() {
  const theme = useTheme();
  const isDarkMode = theme.isDarkMode;

  const shimmerGradient = isDarkMode
    ? "linear-gradient(90deg, rgba(100,116,139,0.1) 0%, rgba(100,116,139,0.2) 50%, rgba(100,116,139,0.1) 100%)"
    : "linear-gradient(90deg, rgba(255,255,255,0.6) 0%, rgba(203,213,225,0.6) 50%, rgba(255,255,255,0.6) 100%)";

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

  const SearchBarSkeleton = () => (
    <div className="flex justify-between items-center gap-4 mb-6 flex-nowrap">
      <div
        className={`flex-1 min-w-0 h-8 rounded overflow-hidden relative ${
          isDarkMode ? "bg-slate-700" : "bg-slate-100"
        }`}
      >
        <div style={shimmerStyle}></div>
      </div>
      <div
        className={`w-28 h-8 rounded overflow-hidden relative flex-shrink-0 ${
          isDarkMode ? "bg-slate-700" : "bg-slate-100"
        }`}
      >
        <div style={shimmerStyle}></div>
      </div>
    </div>
  );

  const TableSkeleton = () => (
    <div
      className={`overflow-x-auto rounded shadow-lg border ${
        isDarkMode
          ? "border-slate-700 bg-slate-800"
          : "border-slate-200 bg-white"
      }`}
    >
      <table
        className={`w-full min-w-[600px] text-sm text-left ${
          isDarkMode ? "text-slate-300" : "text-slate-900"
        }`}
      >
        <thead
          className={`uppercase ${
            isDarkMode
              ? "bg-slate-900/60 text-teal-300"
              : "bg-slate-200 text-slate-700"
          }`}
        >
          <tr>
            {["ID", "Name", "Department", "Joining Date", "Actions"].map(
              (_, idx) => (
                <th key={idx} className="px-4 sm:px-6 py-3">
                  <div
                    className={`h-6 rounded overflow-hidden relative ${
                      isDarkMode ? "bg-slate-700" : "bg-slate-100"
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
                    : "border-slate-200 hover:bg-slate-200/50"
                } transition-colors`}
              >
                {Array(5)
                  .fill("")
                  .map((__, colIdx) => (
                    <td key={colIdx} className="px-4 sm:px-6 py-4">
                      <div
                        className={`h-6 rounded overflow-hidden relative ${
                          isDarkMode ? "bg-slate-700" : "bg-slate-100"
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
      <SearchBarSkeleton />
      <TableSkeleton />
    </div>
  );
}
