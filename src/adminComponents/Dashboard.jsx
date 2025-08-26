import React, { useEffect, useState } from "react";
import useApi from "../customHooks/useApi";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Users,
  DollarSign,
  Wallet,
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
  BarChart3,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import DashboardShimmer from "../shimmers/DashboardShimmer";

const Dashboard = () => {
  const { data, get } = useApi(
    "https://salarygenbackend-3.onrender.com/api/hr/staff"
  );
  const { colors, isDarkMode } = useTheme();

  const CHART_COLORS = isDarkMode
    ? ["#14B8A6", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"]
    : ["#0891B2", "#059669", "#DC2626", "#7C3AED", "#EA580C"];

  const [stats, setStats] = useState({
    totalStaff: 0,
    totalSalaries: 0,
    totalDeductions: 0,
    netGross: 0,
    componentTotals: {},
  });
  const [loading, setLoading] = useState(true);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  useEffect(() => {
    get();
  }, [get]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (data && Array.isArray(data)) {
        let totalStaff = data.length;
        let totalSalaries = 0;
        let totalDeductions = 0;
        let componentTotals = {};

        data.forEach((staff) => {
          let basic = parseFloat(staff.salaryDetails?.basicPay || 0);
          let comps = staff.salaryDetails?.salaryComponents || [];

          comps.forEach((comp) => {
            componentTotals[comp] = (componentTotals[comp] || 0) + 1;
          });

          let deductionComponents = [
            "PF",
            "ESI",
            "PT",
            "TDS",
            "OTHER_DEDUCTIONS",
          ];
          let deductions =
            comps.filter((c) => deductionComponents.includes(c)).length * 1000;
          let salary = basic + comps.length * 1000;

          totalSalaries += salary;
          totalDeductions += deductions;
        });

        let netGross = totalSalaries - totalDeductions;

        setStats({
          totalStaff,
          totalSalaries,
          totalDeductions,
          netGross,
          componentTotals,
        });
      }
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [data]);

  if (loading) return <DashboardShimmer />;

  const pieData = [
    { name: "Total Salaries", value: stats.totalSalaries },
    { name: "Total Deductions", value: stats.totalDeductions },
  ];

  const barData = Object.entries(stats.componentTotals).map(
    ([key, value], idx) => {
      let shortName = key;

      if (key.replace(/[_\s]/g, "").toLowerCase() === "medicalallowance") {
        shortName = "Medical";
      } else if (
        key.replace(/[_\s]/g, "").toLowerCase() === "specialallowance"
      ) {
        shortName = "Special";
      } else if (key.length > 12) {
        shortName = key.slice(0, 8) + "…";
      }

      return {
        name: shortName,
        count: value,
        fullName: key,
      };
    }
  );

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div
      className={`${colors.card} rounded-xl p-6 md:p-4 shadow-lg border ${colors.border} hover:shadow-xl transition-all duration-300 group`}
    >
      <div className="flex items-center justify-between mb-2">
        <div
          className={`p-3 rounded-lg bg-gradient-to-br ${color} group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-4 h-4 text-white" />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              trend > 0
                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            {trend > 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <h3
          className={`text-sm font-medium ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          } mb-1`}
        >
          {title}
        </h3>
        <p
          className={`text-2xl font-bold ${colors.text} group-hover:scale-105 transition-transform duration-300`}
        >
          {typeof value === "string" ? value : value.toLocaleString()}
        </p>
      </div>
    </div>
  );

  return (
    <div className={`h-fit ${colors.primary} p-2 md:p-1`}>
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="text-center mb-8 md:hidden">
          <h1 className={`text-3xl md:text-4xl font-bold ${colors.text} mb-2`}>
            HR's Dashboard
          </h1>
          <p
            className={`text-lg ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Complete overview of your workforce and payroll
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            title="Total Staff"
            value={stats.totalStaff}
            icon={Users}
            color="from-blue-500 to-blue-600"
            trend={12}
          />
          <StatCard
            title="Total Salaries"
            value={`₹${stats.totalSalaries.toLocaleString()}`}
            icon={DollarSign}
            color="from-green-500 to-green-600"
            trend={8}
          />
          <StatCard
            title="Total Deductions"
            value={`₹${stats.totalDeductions.toLocaleString()}`}
            icon={Wallet}
            color="from-orange-500 to-orange-600"
            trend={-3}
          />
          <StatCard
            title="Net Gross"
            value={`₹${stats.netGross.toLocaleString()}`}
            icon={TrendingUp}
            color="from-purple-500 to-purple-600"
            trend={15}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div
            className={`${colors.card} rounded-xl p-6 shadow-lg border ${colors.border}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600">
                <PieChartIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className={`text-xl font-semibold ${colors.text}`}>
                Salary Distribution
              </h3>
            </div>

            <ResponsiveContainer width="100%" height={isMobile ? 180 : 160}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={isMobile ? 60 : 70}
                  innerRadius={isMobile ? 0 : 0}
                  paddingAngle={2}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? "#1e293b" : "#f1f5f9",
                    border: "none",
                    borderRadius: "8px",
                  }}
                  itemStyle={{
                    color: isDarkMode ? "white" : "black",
                    fontSize: isMobile ? 10 : 12,
                  }}
                  labelStyle={{ color: isDarkMode ? "white" : "black" }}
                  position={{ x: 10, y: 150 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div
            className={`${colors.card} rounded-xl p-6 shadow-lg border ${colors.border}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h3 className={`text-xl font-semibold ${colors.text}`}>
                Component Distribution
              </h3>
            </div>

            <div className={`${isMobile ? "h-80" : "h-40"}`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  layout={isMobile ? "vertical" : "horizontal"}
                  margin={{
                    top: 20,
                    right: 20,
                    left: isMobile ? -15 : 0,
                    bottom: 5,
                  }}
                  barCategoryGap={isMobile ? "5%" : "5%"}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? "#334155" : "#e2e8f0"}
                    strokeOpacity={0.5}
                  />
                  {isMobile ? (
                    <>
                      <XAxis type="number" hide />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 10 }}
                        width={80}
                      />
                    </>
                  ) : (
                    <>
                      <XAxis
                        dataKey="name"
                        stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                        fontSize={12}
                        fontWeight="500"
                        tick={{ fill: isDarkMode ? "#94a3b8" : "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                        fontSize={12}
                        fontWeight="500"
                        tick={{ fill: isDarkMode ? "#94a3b8" : "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                        width={40}
                      />
                    </>
                  )}
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value} employees`,
                      props.payload.fullName || name,
                    ]}
                    contentStyle={{
                      backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    }}
                    itemStyle={{
                      color: isDarkMode ? "#ffffff" : "#374151",
                      fontWeight: "500",
                    }}
                    labelStyle={{
                      color: isDarkMode ? "#ffffff" : "#111827",
                      fontWeight: "600",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={isMobile ? 30 : 50}
                  >
                    {barData.map((_, index) => (
                      <Cell
                        key={`cell-bar-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
