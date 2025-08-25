import { useEffect, useState } from "react";
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
} from "recharts";
import { FaMoneyBillWave, FaPlusCircle, FaWallet, FaCoins } from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";
import DashboardShimmer from "../shimmers/DashboardShimmer";
import { useAuth } from "../contexts/AuthContext";

const CARD_COLORS = ["#14B8A6", "#0e7490", "#94a3b8", "#14b8a6"];


const StaffHome = () => {
  const { colors, isDarkMode } = useTheme();

  // Blue-400 for pie (and bars) in light mode as requested
  const COLORS = isDarkMode
    ? ["#14B8A6", "#94a3b8", "#cbd5e1", "#0e7490"]
    : ["#60a5fa", "#94a3b8", "#cbd5e1", "#0e7490"];

  const {id} = useAuth();
    const staffId = id;
  const { data: staffData, get: getStaff } = useApi(
    `https://salarygenbackend-3.onrender.com/api/staff/salary-transactions/${staffId}/all`
  );

  const [stats, setStats] = useState({
    grossSalary: 0,
    allowances: 0,
    deductions: 0,
    netSalary: 0,
    componentTotals: {},
  });

  const [loading, setLoading] = useState(true);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  useEffect(() => {
    getStaff();
  }, [getStaff]);

  useEffect(() => {
    if (staffData && staffData.length > 0) {
      const r = staffData[staffData.length - 1];

      const grossSalary = r.grossSalary ?? 0;
      const basicSalary = r.basicPay ?? 0;
      const allowances = grossSalary - basicSalary;
      const deductions = r.totalDeductions ?? 0;
      const netSalary = r.netSalary ?? grossSalary - deductions;

      const componentTotals = r.componentBreakdown || {};

      setStats({
        grossSalary,
        allowances,
        deductions,
        netSalary,
        componentTotals,
      });

      setLoading(false);
    }
  }, [staffData]);

  if (loading) return <DashboardShimmer />;

  const pieData = [
    { name: "Gross Salary", value: stats.grossSalary },
    { name: "Allowances", value: stats.allowances },
    { name: "Deductions", value: stats.deductions },
    { name: "Net Salary", value: stats.netSalary },
  ];

  const barData = Object.entries(stats.componentTotals).map(
    ([key, value], idx) => ({
      name:
        key.replace(/[_\s]/g, "").length > 12
          ? key.replace(/[_\s]/g, "").slice(0, 10) + "…"
          : key,
      amount: value,
      color: COLORS[idx % COLORS.length],
    })
  );

  return (
    <div className={`space-y-6 ${colors.primary} ${colors.text} lg:-mb-5`}>
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-[#729bde]">
        {[
          {
            title: "Gross Salary",
            value: `₹${stats.grossSalary.toLocaleString()}`,
            icon: <FaMoneyBillWave size={24} />,
          },
          {
            title: "Allowances",
            value: `₹${stats.allowances.toLocaleString()}`,
            icon: <FaPlusCircle size={24} />,
          },
          {
            title: "Deductions",
            value: `₹${stats.deductions.toLocaleString()}`,
            icon: <FaWallet size={24} />,
          },
          {
            title: "Net Salary",
            value: `₹${stats.netSalary.toLocaleString()}`,
            icon: <FaCoins size={24} className="text-slate-400 dark:text-slate-300" />,
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center p-4 rounded-lg transition-transform duration-300 text-center ${
              isDarkMode
                ? colors.card
                : "bg-gray-100 shadow-lg transform hover:-translate-y-2"
            }`}
            style={
              !isDarkMode
                ? {
                    boxShadow:
                      "0.6em 0.6em 1.2em rgba(210, 220, 233, 0.8), -0.5em -0.5em 1em rgba(255, 255, 255, 0.8)",
                  }
                : {}
            }
          >
            <div className="mb-2">{card.icon}</div>
            <h3 style={{ color: CARD_COLORS[idx] }} className="text-lg font-semibold">
              {card.title}
            </h3>
            <p className={`text-2xl font-bold mt-2 ${isDarkMode ? "text-white" : "text-gray-500"}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Pie chart */}
        <div
          className={`p-3.5 rounded-lg transition-transform duration-300 ${
            isDarkMode ? colors.card : "bg-gray-100 shadow-lg transform hover:-translate-y-0"
          }`}
          style={
            !isDarkMode
              ? {
                  boxShadow:
                    "0.6em 0.6em 1.2em rgba(210, 220, 233, 0.8), -0.5em -0.5em 1em rgba(255, 255, 255, 0.8)",
                }
              : {}
          }
        >
          <h3 style={{ color: "#0e7490" }} className="mb-3.5 font-semibold text-sm sm:text-xl">
            Salary Breakdown
          </h3>
      <ResponsiveContainer width="100%" height={isMobile ? 180 : 200}>
  <PieChart>
    <Pie
      data={pieData}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={isMobile ? 55 : 75}
      innerRadius={isMobile ? 30 : 40}
      labelLine={true}
      label={({ cx, cy, midAngle, outerRadius, percent, name }) => {
        const RADIAN = Math.PI / 180;
       
        const r = outerRadius + 15; 
        const x = cx + r * Math.cos(-midAngle * RADIAN);
        const y = cy + r * Math.sin(-midAngle * RADIAN);

        const shortNameMap = {
          "Gross Salary": "G_SAL",
          "Allowances": "ALLOW",
          "Deductions": "DEDUCT",
          "Net Salary": "N_SAL",
        };

        return (
          <text
            x={x}
            y={y}
            fill={isDarkMode ? "#fff" : "#000"}
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
            fontSize={isMobile ? 9 : 16}
            fontWeight="600"
          >
            {`${shortNameMap[name] || name}: ${(percent * 100).toFixed(0)}%`}
          </text>
        );
      }}
    >
      {pieData.map((_, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>

    <Tooltip
      contentStyle={{
        backgroundColor: isDarkMode ? "#1e293b" : "#f1f5f9",
        border: "none",
      }}
      itemStyle={{
        color: isDarkMode ? "white" : "black",
        fontSize: isMobile ? 9 : 16,
      }}
      labelStyle={{ color: isDarkMode ? "white" : "black" }}
    />
  </PieChart>
</ResponsiveContainer>

        </div>

        {/* Bar chart */}
        <div
          className={`p-3.5 rounded-lg transition-transform duration-300 ${
            isDarkMode ? colors.card : "bg-gray-100 shadow-lg transform hover:-translate-y-0"
          }`}
          style={
            !isDarkMode
              ? {
                  boxShadow:
                    "0.6em 0.6em 1.2em rgba(210, 220, 233, 0.8), -0.5em -0.5em 1em rgba(255, 255, 255, 0.8)",
                }
              : {}
          }
        >
          <h3 style={{ color: "#14b8a6" }} className="mb-3.5 font-semibold text-sm sm:text-xl">
            Salary Components Distribution
          </h3>
          <ResponsiveContainer width="100%" height={isMobile ? 216 : 198}>
            <BarChart
              data={barData}
              layout={isMobile ? "vertical" : "horizontal"}
              margin={{
                top: 9,
                right: isMobile ? 9 : 18,
                left: isMobile ? 13 : 9,
                bottom: isMobile ? 9 : 36,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#334155" : "#e2e8f0"} />
              {isMobile ? (
                <>
                  <XAxis
                    type="number"
                    stroke={isDarkMode ? "#94a3b8" : "#475569"}
                    tick={{ fontSize: 7 }}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke={isDarkMode ? "#94a3b8" : "#475569"}
                    tick={{ fontSize: 7 }}
                    width={54}
                  />
                </>
              ) : (
                <>
                  <XAxis
                    dataKey="name"
                    stroke={isDarkMode ? "#94a3b8" : "#475569"}
                    tick={{ fontSize: 11 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    padding={{ left: 0, right: 5 }}
                  />
                  <YAxis
                    stroke={isDarkMode ? "#94a3b8" : "#475569"}
                    tick={{ fontSize: 11 }}
                    tickMargin={7}
                    allowDecimals={false}
                  />
                </>
              )}
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#1e293b" : "#f1f5f9",
                  border: "none",
                }}
                itemStyle={{
                  color: isDarkMode ? "white" : "black",
                  fontSize: isMobile ? 9 : 11,
                }}
                labelStyle={{ color: isDarkMode ? "white" : "black" }}
              />
              <Bar dataKey="amount" radius={[3, 3, 0, 0]} maxBarSize={isMobile ? 12 : 31}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-bar-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StaffHome;
