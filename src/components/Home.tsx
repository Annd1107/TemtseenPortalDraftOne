import { Link } from "react-router";
import { Trophy, Users, Award, Calendar, CheckCircle, Shield, Bell } from "lucide-react";
import { useAuth } from "../lib/auth-context";
import { useLanguage } from "../lib/language-context";
import logo from "figma:asset/f903ce71512caff8e98ba718ecc02ebdf4aae725.png";

export function Home() {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="TemtseenPortal Logo" className="h-32 w-32" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {t("home.title")}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
          {t("home.subtitle")}
        </p>
        <p className="text-lg text-gray-500 dark:text-gray-500 mb-8">
          {t("home.description")}
        </p>
        {!user && (
          <div className="flex gap-4 justify-center">
            <Link 
              to="/signup" 
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {t("nav.signup")}
            </Link>
            <Link 
              to="/login" 
              className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {t("nav.login")}
            </Link>
          </div>
        )}
        {user && (
          <Link 
            to={user.role === "organizer" ? "/organizer" : "/student"} 
            className="inline-block px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            {t("nav.dashboard")}
          </Link>
        )}
      </div>

      {/* User Type Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="size-16 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
            <Users className="size-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            {t("home.studentTitle")}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t("home.studentDesc")}
          </p>
          {!user && (
            <Link 
              to="/signup" 
              className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {t("nav.signup")}
            </Link>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="size-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
            <Trophy className="size-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            {t("home.organizerTitle")}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t("home.organizerDesc")}
          </p>
          {!user && (
            <Link 
              to="/signup" 
              className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {t("nav.signup")}
            </Link>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12">{t("home.features")}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <div className="size-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="size-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {t("home.feature1")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t("home.feature1Desc")}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <div className="size-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="size-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {t("home.feature2")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t("home.feature2Desc")}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <div className="size-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Bell className="size-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {t("home.feature3")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t("home.feature3Desc")}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-8">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">1,200+</div>
            <div className="text-purple-100">{t("student.title")}</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">45+</div>
            <div className="text-purple-100">{t("student.availableTournaments")}</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">25+</div>
            <div className="text-purple-100">{t("organizer.title")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}