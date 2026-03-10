import { Outlet, Link, useNavigate } from "react-router";
import { Trophy, LogOut, Home, User, Info, LayoutDashboard, Globe, Bell, Moon, Sun, Award } from "lucide-react";
import { useAuth } from "../lib/auth-context";
import { useLanguage } from "../lib/language-context";
import { useTheme } from "../lib/theme-context";
import logo from "figma:asset/f903ce71512caff8e98ba718ecc02ebdf4aae725.png";

export function Root() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleLanguage = () => {
    setLanguage(language === "mn" ? "en" : "mn");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="TemtseenPortal Logo" className="h-10 w-10" />
              <span className="text-xl font-semibold text-gray-900 dark:text-gray-100 w-40">{t("home.title")}</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <Link 
                to="/" 
                className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md transition-colors"
              >
                <Home className="size-4" />
                <span className="hidden sm:inline w-12">{t("nav.home")}</span>
              </Link>
              
              <Link 
                to="/about" 
                className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md transition-colors"
              >
                <Info className="size-4" />
                <span className="hidden sm:inline w-12">{t("nav.about")}</span>
              </Link>

              {user && (
                <>
                  <Link 
                    to={user.role === "organizer" ? "/organizer" : "/student"} 
                    className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md transition-colors"
                  >
                    <LayoutDashboard className="size-4" />
                    <span className="hidden sm:inline w-20">{t("nav.dashboard")}</span>
                  </Link>
                  <Link 
                    to="/notifications" 
                    className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md transition-colors"
                    title={t("nav.notifications")}
                  >
                    <Bell className="size-4" />
                  </Link>
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md transition-colors"
                    title={t("nav.profile")}
                  >
                    <User className="size-4" />
                  </Link>
                </>
              )}
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md transition-colors"
                title={theme === "light" ? t("nav.darkMode") : t("nav.lightMode")}
              >
                {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
              </button>

              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md transition-colors"
                title={language === "mn" ? "Switch to English" : "Монгол хэл рүү шилжих"}
              >
                <Globe className="size-4" />
                <span className="font-semibold w-6">{language === "mn" ? "EN" : "МН"}</span>
              </button>

              {user ? (
                <>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors ml-2"
                  >
                    <LogOut className="size-4" />
                    <span className="hidden sm:inline w-12">{t("nav.logout")}</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <span className="w-16 inline-block text-center">{t("nav.login")}</span>
                  </Link>
                  <Link 
                    to="/signup" 
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    <span className="w-20 inline-block text-center">{t("nav.signup")}</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 dark:text-gray-400">
            {t("footer.copyright")}
          </p>
        </div>
      </footer>
    </div>
  );
}