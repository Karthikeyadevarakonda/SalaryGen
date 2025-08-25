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
import { FaUsers, FaMoneyBillWave, FaWallet, FaCoins } from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";
import DashboardShimmer from "../shimmers/DashboardShimmer";


const CARD_COLORS = ["#14b8a6", "#0e7490", "#94a3b8", "#14b8a6"];

const Dashboard = () => {
  const { data, get } = useApi("http://localhost:8081/api/hr/staff");
  const { colors, isDarkMode } = useTheme();
  const COLORS = isDarkMode
  ? ["#14B8A6", "#94a3b8", "#cbd5e1", "#0e7490"] 
  : ["#729bde", "#94a3b8", "#cbd5e1", "#0e7490"]; 

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

          let deductionComponents = ["PF", "ESI", "PT", "TDS", "OTHER_DEDUCTIONS"];
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
  { name: "Salaries", value: stats.totalSalaries },
  { name: "Deductions", value: stats.totalDeductions },
];

  const barData = Object.entries(stats.componentTotals).map(
    ([key, value], idx) => {
      let shortName = key;

      if (key.replace(/[_\s]/g, "").toLowerCase() === "medicalallowance") {
        shortName = "MEDICAL";
      } else if (key.replace(/[_\s]/g, "").toLowerCase() === "specialallowance") {
        shortName = "SPECIAL";
      } else if (key.length > 10) {
        shortName = key.slice(0, 10) + "…";
      }

      return {
        name: shortName,
        count: value,
        color: COLORS[idx % COLORS.length],
      };
    }
  );

  return (
    <div className={`space-y-6 ${colors.primary} ${colors.text} lg:-mb-5`}>
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-[#729bde]">
  {[
    {
      title: "Total Staff",
      value: stats.totalStaff,
      icon: <FaUsers size={24} />,
    },
    {
      title: "Total Salaries",
      value: `₹${stats.totalSalaries.toLocaleString()}`,
      icon: <FaMoneyBillWave size={24} />,
    },
    {
      title: "Total Deductions",
      value: `₹${stats.totalDeductions.toLocaleString()}`,
      icon: <FaWallet size={24} />,
    },
    {
      title: "Net Gross",
      value: `₹${stats.netGross.toLocaleString()}`,
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


     
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 ">
        
<div
  className={`p-3.5 rounded-lg transition-transform duration-300 ${
    isDarkMode
      ? colors.card
      : "bg-gray-100 shadow-lg transform hover:-translate-y-0"
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
  <h3
    style={{ color: "#0e7490" }}
    className="mb-3.5 font-semibold text-sm sm:text-xl"
  >
    Salaries vs Deductions
  </h3>
  <ResponsiveContainer width="100%" height={isMobile ? 162 : 180}>
   


<PieChart>
  <Pie
    data={pieData}
    dataKey="value"
    nameKey="name"
    cx="50%"
    cy="50%"
    outerRadius={isMobile ? 50 : 81}
    label={({ name }) => name} // 👈 Show only names
  >
    {pieData.map((_, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>

  <Tooltip
    formatter={(value, name) => [name]}
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
</PieChart>

  </ResponsiveContainer>
</div>


<div
  className={`p-3.5 rounded-lg transition-transform duration-300 ${
    isDarkMode
      ? colors.card
      : "bg-gray-100 shadow-lg transform hover:-translate-y-0"
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
  <h3
    style={{ color: "#14b8a6" }}
    className="mb-3.5 font-semibold text-sm sm:text-xl"
  >
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
      <CartesianGrid
        strokeDasharray="3 3"
        stroke={isDarkMode ? "#334155" : "#e2e8f0"}
      />
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
      <Bar dataKey="count" radius={[3, 3, 0, 0]} maxBarSize={isMobile ? 12 : 31}>
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

export default Dashboard;
