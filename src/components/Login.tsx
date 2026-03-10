import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { User, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "../lib/auth-context";
import { useLanguage } from "../lib/language-context";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "organizer">("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(email, password, role);
      if (success) {
        navigate(role === "organizer" ? "/organizer" : "/student");
      } else {
        setError(t("auth.invalidCredentials"));
      }
    } catch (err) {
      setError(t("auth.invalidCredentials"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
            {t("nav.login")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
            {t("home.title")}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="size-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-red-800 dark:text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                {role === "student" ? t("auth.studentLogin") : t("auth.organizerLogin")}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    role === "student"
                      ? "border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                      : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  {t("auth.studentLogin").replace(" нэвтрэх", "").replace(" Login", "")}
                </button>
                <button
                  type="button"
                  onClick={() => setRole("organizer")}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    role === "organizer"
                      ? "border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                      : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  {t("auth.organizerLogin").replace(" нэвтрэх", "").replace(" Login", "")}
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">
                {t("auth.email")}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder={role === "student" ? "bold@student.mn" : "sarnai@organizer.mn"}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-2">
                {t("auth.password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Demo Info */}
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <p className="text-sm text-purple-800 dark:text-purple-300">
                <strong>{t("auth.studentLogin")}:</strong> bold@student.mn<br />
                <strong>{t("auth.organizerLogin")}:</strong> sarnai@organizer.mn
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t("payment.processing") : t("auth.login")}
            </button>
          </form>

          <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
            {t("auth.noAccount")}{" "}
            <Link to="/signup" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium">
              {t("auth.signupHere")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}