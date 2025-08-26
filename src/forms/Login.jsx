import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useApi from "../customHooks/useApi";
import { useTheme } from "../contexts/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(null);

  const { data, error, loading, post } = useApi(
    "https://salarygenbackend-3.onrender.com/api/auth/login"
  );

  async function handleLogin(e) {
    e.preventDefault();

    if (!name || !password) {
      setFormError("Username and password are required.");
      return;
    }

    try {
      const res = await post("", { username: name, password });

      const { id, token, username, role } = res;
      login(id, token, username, role);

      const activeRole = ["isStaff", "isAdmin", "isHr"].includes(role);

      if (!activeRole) {
        setFormError("Unexpected user role. Contact support.");
        return;
      }

      switch (role) {
        case "isAdmin":
          navigate("/adminDashboard", { replace: true });
          break;
        case "isStaff":
          navigate("/staffDashboard", { replace: true });
          break;
        case "isHr":
          navigate("/hrDashboard", { replace: true });
          break;
        default:
          navigate("/welcome", { replace: true });
      }
    } catch (err) {
      console.error("Login error", err);
      setFormError("Invalid username or password");
    }
  }

  return (
    <div
      className={`min-h-screen ${colors.primary} flex items-center justify-center px-4 transition-colors duration-300`}
    >
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div
        className={`w-full max-w-sm ${colors.card} border-t-4 ${
          colors.accent.includes("teal") ? "border-teal-400" : "border-blue-500"
        } rounded-xl shadow-md p-6 transition-colors duration-300`}
      >
        <h1
          className={`text-center text-xl font-bold tracking-wide ${colors.text} mb-4`}
        >
          LOGIN
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            type="text"
            placeholder="Username"
            className={`w-full px-3 py-2 ${colors.input} ${colors.text} ${
              colors.border
            } border rounded-md ${colors.textMuted.replace(
              "text-",
              "placeholder-"
            )} focus:outline-none focus:ring-2 ${
              colors.accent.includes("teal")
                ? "focus:ring-teal-400"
                : "focus:ring-blue-500"
            } transition-colors duration-300`}
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            placeholder="Password"
            className={`w-full px-3 py-2 ${colors.input} ${colors.text} ${
              colors.border
            } border rounded-md ${colors.textMuted.replace(
              "text-",
              "placeholder-"
            )} focus:outline-none focus:ring-2 ${
              colors.accent.includes("teal")
                ? "focus:ring-teal-400"
                : "focus:ring-blue-500"
            } transition-colors duration-300`}
          />

          {(formError || error) && (
            <p className="text-red-500 text-center text-sm">
              {formError || error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 ${colors.button} text-white tracking-wide rounded font-bold transition-colors`}
          >
            {loading ? "Logging in..." : "LOG-IN"}
          </button>

          <p className={`text-center text-xs ${colors.textMuted}`}>
            Don't have an account?{" "}
            <Link
              to="/register"
              className={`${
                colors.accent.includes("teal")
                  ? "text-teal-400"
                  : "text-blue-500"
              } hover:underline`}
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
