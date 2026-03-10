import { Mail, Phone, Users, Target, Lightbulb } from "lucide-react";
import { useLanguage } from "../lib/language-context";

export function About() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {t("about.title")}
        </h1>
      </div>

      {/* Mission */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Target className="size-8 text-purple-600 dark:text-purple-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t("about.mission")}</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
          {t("about.missionText")}
        </p>
      </div>

      {/* How It Works */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb className="size-8 text-purple-600 dark:text-purple-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t("about.howItWorks")}</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {t("about.forStudents")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {t("about.forStudentsText")}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {t("about.forOrganizers")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {t("about.forOrganizersText")}
            </p>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex items-center gap-3 mb-4">
          <Users className="size-8 text-purple-600 dark:text-purple-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t("about.contact")}</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{t("about.contactText")}</p>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <Mail className="size-5 text-purple-600 dark:text-purple-400" />
            <span>{t("about.email")}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <Phone className="size-5 text-purple-600 dark:text-purple-400" />
            <span>{t("about.phone")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}