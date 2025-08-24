import { motion } from "framer-motion";
import {
  CalculatorIcon,
  Cog6ToothIcon,
  DocumentChartBarIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../contexts/ThemeContext";

const Features = () => {
  const { isDarkMode } = useTheme();

  const features = [
    {
      title: "Automated Salary Calculation",
      subtitle: "Based on effective dates, rules & deductions",
      icon: CalculatorIcon,
      component: (
        <div className="w-full max-w-md h-40 overflow-hidden">
          <svg viewBox="0 0 320 100" className="w-full h-full">
            <motion.path
              d={`M ${[70, 60, 80, 50, 75, 60, 85]
                .map((y, i) => `${i * 50},${100 - y}`)
                .join(" L ")}`}
              stroke="orange"
              strokeWidth="4"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          </svg>
        </div>
      ),
    },
    {
      title: "Dynamic Rule Engine",
      subtitle: "Update salary components anytime with date tracking",
      icon: Cog6ToothIcon,
      component: (
        <div className="w-full max-w-md h-40 overflow-hidden">
          <svg viewBox="0 0 300 100" className="w-full h-full">
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <motion.path
              fill="url(#grad)"
              stroke="orange"
              strokeWidth="2"
              d="M0,80 C40,60 80,40 120,50 C160,60 200,30 240,40 C280,50 300,30 300,30 L300,100 L0,100 Z"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          </svg>
        </div>
      ),
    },
    {
      title: "Monthly & Custom Reports",
      subtitle: "Generate acquittance reports & salary slips easily",
      icon: DocumentChartBarIcon,
      component: (
        <div className="w-full max-w-md h-40 overflow-hidden flex items-end justify-center gap-2">
          <svg viewBox="0 0 200 100" className="w-full h-full">
            {[50, 70, 60, 80, 40].map((h, i) => (
              <motion.rect
                key={i}
                x={i * 35 + 10}
                y={100 - h}
                width="20"
                height={h}
                fill="orange"
                initial={{ y: 100, height: 0 }}
                animate={{ y: 100 - h, height: h }}
                transition={{
                  delay: i * 0.2,
                  duration: 0.8,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            ))}
          </svg>
        </div>
      ),
    },
    {
      title: "Role-Based Access Control",
      subtitle: "Ensure secure access for Admin, HR & Management",
      icon: UserGroupIcon,
      component: (
        <div className="relative w-36 h-36 overflow-hidden flex items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full bg-orange-500 opacity-30"
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-orange-400 text-white font-bold text-xl text-center px-2">
            Admin / HR
          </div>
        </div>
      ),
    },
    {
      title: "Audit Logs & Change Tracking",
      subtitle: "Every update is tracked for transparency",
      icon: ClipboardDocumentCheckIcon,
      component: (
        <div className="w-36 h-36 overflow-hidden flex items-center justify-center">
          <motion.div
            className="w-32 h-32 border-8 border-t-orange-500 border-orange-300 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          />
        </div>
      ),
    },
  ];

  return (
    <div
      className={`min-h-screen py-16 px-6 lg:px-20 space-y-20 transition-colors
        ${isDarkMode ? "bg-slate-900 text-gray-100" : "bg-white text-gray-800"}`}
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-3xl lg:text-4xl font-bold text-center bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-transparent drop-shadow-lg"
      >
        Core Features of Our Salary Acquittance System
      </motion.h1>

      {features.map((feature, index) => (
        <motion.div
          key={index}
          className={`flex flex-col-reverse lg:flex-row items-center gap-10 min-h-[250px] ${
            index % 2 !== 0 ? "lg:flex-row-reverse" : ""
          }`}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.2 }}
        >
          {/* Text Section with Icon */}
          <div className="flex-1 space-y-4 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start items-center gap-3">
              <feature.icon className="w-8 h-8 text-orange-400" />
              <h2
                className={`text-2xl md:text-3xl font-semibold ${
                  isDarkMode ? "text-slate-200" : "text-gray-900"
                }`}
              >
                {feature.title}
              </h2>
            </div>
            <p
              className={`text-lg ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {feature.subtitle}
            </p>
          </div>

          {/* Animated Visual */}
          <div className="flex-1 flex justify-center">{feature.component}</div>
        </motion.div>
      ))}
    </div>
  );
};

export default Features;
