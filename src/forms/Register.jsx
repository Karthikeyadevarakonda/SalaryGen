import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useApi from "../customHooks/useApi";
import { useTheme } from "../contexts/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

const Register = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(null);

  // ✅ initialize useApi with base URL
  const { error, loading, post } = useApi("http://localhost:8080/register");

  async function handleRegister(e) {
    e.preventDefault();

    if (!username || !password) {
      setFormError("Username and password are required.");
      return;
    }

    try {
      await post("", { username, password }); // ✅ using post method from useApi
      setFormError(null);
      navigate("/login");
    } catch (err) {
      console.error("Register error", err);
      setFormError("Registration failed");
    }
  }

  return (
    <div className={`min-h-screen ${colors.primary} flex items-center justify-center px-4 transition-colors duration-300`}>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className={`relative w-full max-w-sm ${colors.card} rounded-xl shadow-md p-6 transition-colors duration-300`}>
        <div className={`absolute top-0 left-0 w-full h-1 rounded-t-xl bg-gradient-to-r ${colors.accent.includes('teal') ? 'from-white via-teal-400 to-white' : 'from-white via-blue-500 to-white'}`} />

        <h1 className={`text-center text-xl font-bold tracking-wide ${colors.text} mb-4`}>
          REGISTER
        </h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            type="text"
            placeholder="Username"
            className={`w-full px-3 py-2 ${colors.input} ${colors.text} ${colors.border} border rounded-md ${colors.textMuted.replace('text-', 'placeholder-')} focus:outline-none focus:ring-2 ${colors.accent.includes('teal') ? 'focus:ring-teal-400' : 'focus:ring-blue-500'} text-normal transition-colors duration-300`}
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            placeholder="Password"
            className={`w-full px-3 py-2 ${colors.input} ${colors.text} ${colors.border} border rounded-md ${colors.textMuted.replace('text-', 'placeholder-')} focus:outline-none focus:ring-2 ${colors.accent.includes('teal') ? 'focus:ring-teal-400' : 'focus:ring-blue-500'} text-normal transition-colors duration-300`}
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
            {loading ? "Registering..." : "REGISTER"}
          </button>

          <p className={`text-center text-xs ${colors.textMuted}`}>
            Already have an account?{" "}
            <Link to="/login" className={`${colors.accent.includes('teal') ? 'text-teal-400' : 'text-blue-500'} hover:underline`}>
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
