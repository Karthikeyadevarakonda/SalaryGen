import { useTheme } from "../contexts/ThemeContext";

export default function DashboardShimmer() {
  const theme = useTheme();
  const isDarkMode = theme.isDarkMode;

  const cardBg = isDarkMode ? "bg-slate-800" : "bg-white";

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

  const CardSkeleton = () => (
    <div className={`relative overflow-hidden ${cardBg} rounded-lg p-4 h-24`}>
      <div style={shimmerStyle}></div>
    </div>
  );

  const ChartSkeleton = () => (
    <div className={`relative overflow-hidden ${cardBg} rounded-lg p-4 h-72`}>
      <div style={shimmerStyle}></div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
}
