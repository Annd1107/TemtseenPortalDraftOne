import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { User, Mail, Lock, School, Building, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "../lib/auth-context";
import { useLanguage } from "../lib/language-context";

export function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"student" | "organizer">("student");
  const [school, setSchool] = useState("");
  const [grade, setGrade] = useState<number>(9);
  const [organization, setOrganization] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (password !== confirmPassword) {
      setError(t("auth.invalidCredentials"));
      return;
    }

    if (password.length < 6) {
      setError(t("auth.invalidCredentials"));
      return;
    }

    if (role === "student" && !school) {
      setError(t("auth.school"));
      return;
    }

    if (role === "organizer" && !organization) {
      setError(t("auth.organization"));
      return;
    }

    setLoading(true);

    try {
      const success = await signup({
        name,
        email,
        password,
        role,
        school: role === "student" ? school : undefined,
        grade: role === "student" ? grade : undefined,
        organization: role === "organizer" ? organization : undefined,
      });

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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
            {t("nav.signup")}
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

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                {role === "student" ? t("auth.studentSignup") : t("auth.organizerSignup")}
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
                  {t("auth.studentSignup").replace(" бүртгүүлэх", "").replace(" Sign Up", "")}
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
                  {t("auth.organizerSignup").replace(" бүртгүүлэх", "").replace(" Sign Up", "")}
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-2">
                {t("auth.name")}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder={t("auth.name")}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">
                {t("auth.email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="example@email.mn"
                  required
                />
              </div>
            </div>

            {/* Student-specific fields */}
            {role === "student" && (
              <>
                <div>
                  <label htmlFor="school" className="block text-gray-700 dark:text-gray-300 mb-2">
                    {t("auth.school")}
                  </label>
                  <div className="relative">
                    <School className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                    <select
                      id="school"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      required
                    >
                      <option value="">{t("auth.school")}</option>
                      <option value="1-р сургууль">1-р сургууль</option>
                      <option value="5-р сургууль">5-р сургууль</option>
                      <option value="18-р сургууль">18-р сургууль</option>
                      <option value="23-р сургууль">23-р сургууль</option>
                      <option value="Өвлийн сургууль">Өвлийн сургууль</option>
                      <option value="Хүннү сургууль">Хүннү сургууль</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="grade" className="block text-gray-700 dark:text-gray-300 mb-2">
                    {t("auth.grade")}
                  </label>
                  <select
                    id="grade"
                    value={grade}
                    onChange={(e) => setGrade(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  >
                    <option value={9}>9-р анги</option>
                    <option value={10}>10-р анги</option>
                    <option value={11}>11-р анги</option>
                    <option value={12}>12-р анги</option>
                  </select>
                </div>
              </>
            )}

            {/* Organizer-specific fields */}
            {role === "organizer" && (
              <div>
                <label htmlFor="organization" className="block text-gray-700 dark:text-gray-300 mb-2">
                  {t("auth.organization")}
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <input
                    type="text"
                    id="organization"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder={t("auth.organization")}
                    required
                  />
                </div>
              </div>
            )}

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

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 dark:text-gray-300 mb-2">
                {t("auth.password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t("payment.processing") : t("auth.signup")}
            </button>
          </form>

          <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
            {t("auth.haveAccount")}{" "}
            <Link to="/login" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium">
              {t("auth.loginHere")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}