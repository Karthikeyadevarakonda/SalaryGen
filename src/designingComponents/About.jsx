import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCircleIcon,
  CodeBracketIcon,
  FireIcon,
  ServerStackIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useTheme } from "../contexts/ThemeContext";

const team = [
  {
    name: "Suchesh",
    role: "Team Lead",
    icon: UserCircleIcon,
    bio: "Leads direction, planning & QA.",
  },
  {
    name: "Manikanta",
    role: "Frontend Developer",
    icon: CodeBracketIcon,
    bio: "Builds delightful UI & components.",
  },
  {
    name: "Waseem",
    role: "Backend Developer",
    icon: ServerStackIcon,
    bio: "APIs, DBs and server reliability.",
  },
  {
    name: "Hitesh",
    role: "Git & Repo Management",
    icon: ClipboardDocumentCheckIcon,
    bio: "Repo hygiene and CI/CD.",
  },
  {
    name: "Karthikeya",
    role: "Full Stack Developer",
    icon: FireIcon,
    bio: "Full-stack workhorse (center of the team).",
  },
];

const colors = {
  light: {
    pageBg: "bg-gray-50",
    cardBg: "bg-white",
    cardText: "text-gray-900",
    iconBg: [
      "from-blue-400 to-cyan-400",
      "from-pink-500 to-rose-400",
      "from-teal-400 to-emerald-400",
      "from-indigo-500 to-purple-500",
      "from-yellow-400 to-yellow-300",
    ],
    buttonBg: "bg-transparent",
    buttonText: "text-black",
    buttonHover: "hover:bg-gray-100",
    textSecondary: "text-gray-700",
    textMuted: "text-gray-500",
    modalBg: "bg-white",
    modalText: "text-gray-900",
    overlay: "bg-black/40",
  },
  dark: {
    pageBg: "bg-slate-900",
    cardBg: "bg-[#2c313a]",
    cardText: "text-white",
    iconBg: [
      "from-cyan-400 to-teal-400",
      "from-rose-400 to-pink-500",
      "from-emerald-400 to-teal-400",
      "from-purple-500 to-indigo-500",
      "from-yellow-400 to-yellow-500",
    ],
    buttonBg: "bg-transparent",
    buttonText: "text-white",
    buttonHover: "hover:bg-gray-700",
    textSecondary: "text-gray-300",
    textMuted: "text-gray-400",
    modalBg: "bg-[#111216]",
    modalText: "text-white",
    overlay: "bg-black/60",
  },
};

const TeamCard = ({ member, idx, theme }) => {
  const Icon = member.icon;
  const t = colors[theme];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.08, duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
      className={`relative rounded-2xl p-6 w-[250px] h-[240px] flex flex-col items-center justify-center ${t.cardBg} shadow-md`}
    >
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gradient-to-r ${
          t.iconBg[idx % t.iconBg.length]
        } text-white shadow-md`}
      >
        <Icon className="w-7 h-7" />
      </div>
      <h3
        className={`text-lg sm:text-xl font-semibold mb-1 text-center ${t.cardText}`}
      >
        {member.name}
      </h3>
      <p className={`text-sm text-center ${t.textSecondary}`}>{member.role}</p>
      <p className={`text-xs text-center mt-3 px-2 ${t.textMuted}`}>
        {member.bio}
      </p>
    </motion.div>
  );
};

const CarouselItem = ({ member, idx, onOpen, theme }) => {
  const Icon = member.icon;
  const t = colors[theme];
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      className="snap-center flex-shrink-0 w-64 sm:w-72 p-4 rounded-xl"
    >
      <div
        className={`rounded-xl p-4 h-full flex flex-col items-center justify-between shadow-lg ${t.cardBg}`}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-r ${
              t.iconBg[idx % t.iconBg.length]
            } text-white text-xl shadow-inner`}
          >
            <Icon className="w-8 h-8" />
          </div>
          <div className="text-center">
            <h4 className={`text-lg font-semibold leading-tight ${t.cardText}`}>
              {member.name}
            </h4>
            <p className={`text-sm mt-1 ${t.textSecondary}`}>{member.role}</p>
          </div>
        </div>
        <button
          onClick={() => onOpen(member, idx)}
          className={`mt-4 w-full ${t.buttonBg} ${t.buttonText} font-semibold py-2 rounded ${t.buttonHover} transition`}
        >
          View
        </button>
      </div>
    </motion.div>
  );
};

const About = () => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? "dark" : "light";
  const [modal, setModal] = useState({ open: false, member: null, idx: 0 });
  const carouselRef = useRef(null);
  const t = colors[theme];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && modal.open)
        setModal({ open: false, member: null, idx: 0 });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal.open]);

  const openModal = (member, idx) => {
    setModal({ open: true, member, idx });
    if (carouselRef.current) {
      const container = carouselRef.current;
      const item = container.children[idx];
      if (item) {
        const offset =
          item.offsetLeft - (container.clientWidth - item.clientWidth) / 2;
        container.scrollTo({ left: offset, behavior: "smooth" });
      }
    }
  };

  return (
    <div className={`${t.pageBg} min-h-screen py-12 px-4 sm:px-6 lg:px-12`}>
      <header className="max-w-4xl mx-auto text-center mb-8">
        <div
          className={`inline-flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-teal-400 to-emerald-400 text-3xl sm:text-4xl font-bold`}
        >
          <UserGroupIcon className="w-7 h-7 text-slate-100" />
          Meet The Team
        </div>
        <p
          className={`mt-3 max-w-xl mx-auto text-sm sm:text-base ${t.textMuted}`}
        >
          We dream big, build fast, and keep it personal. Meet the people
          turning bold ideas into reality
        </p>
      </header>

      <section className="hidden md:flex md:items-center md:justify-center min-h-[80vh]">
        <div className="grid grid-cols-3 gap-4 max-w-5xl">
          {team.slice(0, 3).map((m, i) => (
            <TeamCard key={m.name} member={m} idx={i} theme={theme} />
          ))}
          {team.length > 3 && (
            <div className="col-span-3 flex justify-center gap-4">
              {team.slice(3).map((m, i) => (
                <TeamCard key={m.name} member={m} idx={i + 3} theme={theme} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="md:hidden mt-4">
        <div className="relative">
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto px-4 pb-4 scroll-smooth snap-x snap-mandatory"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {team.map((m, i) => (
              <CarouselItem
                key={m.name}
                member={m}
                idx={i}
                onOpen={openModal}
                theme={theme}
              />
            ))}
          </div>
          <div className="absolute -bottom-1 left-0 right-0 flex justify-center pointer-events-none">
            <div className="w-24 h-1 rounded-full bg-gray-300/40" />
          </div>
        </div>
      </section>

      <AnimatePresence>
        {modal.open && modal.member && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className={`${t.overlay}`}
              onClick={() => setModal({ open: false, member: null, idx: 0 })}
            />
            <motion.div
              className={`absolute z-50 p-6 rounded-xl max-w-sm w-full ${t.modalBg} shadow-lg`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <button
                onClick={() => setModal({ open: false, member: null, idx: 0 })}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
              <div className="flex flex-col items-center gap-3">
                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-r ${
                    t.iconBg[modal.idx % t.iconBg.length]
                  } text-white shadow-md`}
                >
                  <modal.member.icon className="w-10 h-10" />
                </div>
                <h3 className={`text-xl font-bold ${t.modalText}`}>
                  {modal.member.name}
                </h3>
                <p className={`text-sm ${t.textSecondary}`}>
                  {modal.member.role}
                </p>
                <p className={`text-center mt-2 ${t.textMuted}`}>
                  {modal.member.bio}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default About;
