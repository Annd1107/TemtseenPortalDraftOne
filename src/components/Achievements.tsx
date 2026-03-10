import { useState } from "react";
import { useNavigate } from "react-router";
import { Trophy, Medal, Award, Calendar, MapPin, Users, Target, ArrowLeft, TrendingUp } from "lucide-react";
import { useAuth } from "../lib/auth-context";
import { useLanguage } from "../lib/language-context";
import { useAchievements } from "../lib/achievement-context";

export function Achievements() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { getStudentAchievements } = useAchievements();
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState<string>("all");

  if (!user) {
    navigate("/login");
    return null;
  }

  if (user.role !== "student") {
    navigate("/");
    return null;
  }

  const achievements = getStudentAchievements(user.id);
  
  // Filter achievements
  const filteredAchievements = filterCategory === "all" 
    ? achievements 
    : achievements.filter(a => a.category === filterCategory);

  // Calculate statistics
  const totalAchievements = achievements.length;
  const goldMedals = achievements.filter(a => a.medal === "gold").length;
  const silverMedals = achievements.filter(a => a.medal === "silver").length;
  const bronzeMedals = achievements.filter(a => a.medal === "bronze").length;
  const averagePlacement = achievements.length > 0 
    ? (achievements.reduce((sum, a) => sum + a.placement, 0) / achievements.length).toFixed(1)
    : "0";

  // Get unique categories
  const categories = Array.from(new Set(achievements.map(a => a.category)));

  const getMedalIcon = (medal?: string) => {
    switch (medal) {
      case "gold":
        return <Trophy className="size-6 text-yellow-500" />;
      case "silver":
        return <Medal className="size-6 text-gray-400" />;
      case "bronze":
        return <Award className="size-6 text-orange-600" />;
      default:
        return <Trophy className="size-6 text-gray-400" />;
    }
  };

  const getMedalBg = (medal?: string) => {
    switch (medal) {
      case "gold":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      case "silver":
        return "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700";
      case "bronze":
        return "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800";
      default:
        return "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700";
    }
  };

  const getPlacementBadge = (placement: number) => {
    if (placement === 1) {
      return <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-sm font-semibold">🥇 {t("achievements.first")}</span>;
    } else if (placement === 2) {
      return <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full text-sm font-semibold">🥈 {t("achievements.second")}</span>;
    } else if (placement === 3) {
      return <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-sm font-semibold">🥉 {t("achievements.third")}</span>;
    } else {
      return <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-semibold">{placement}{t("achievements.place")}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 mb-4 transition-colors"
          >
            <ArrowLeft className="size-4" />
            {t("achievements.back")}
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {t("achievements.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("achievements.subtitle")}
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="size-8 text-purple-600 dark:text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalAchievements}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t("achievements.total")}</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg shadow-sm border border-yellow-200 dark:border-yellow-800 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="size-8 text-yellow-600 dark:text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{goldMedals}</div>
                <div className="text-sm text-yellow-700 dark:text-yellow-300">{t("achievements.gold")}</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-sm border border-gray-300 dark:border-gray-600 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Medal className="size-8 text-gray-600 dark:text-gray-400" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{silverMedals}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t("achievements.silver")}</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg shadow-sm border border-orange-200 dark:border-orange-800 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Award className="size-8 text-orange-600 dark:text-orange-400" />
              <div>
                <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{bronzeMedals}</div>
                <div className="text-sm text-orange-700 dark:text-orange-300">{t("achievements.bronze")}</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="size-8 text-green-600 dark:text-green-400" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{averagePlacement}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t("achievements.avgPlace")}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterCategory("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterCategory === "all"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {t("achievements.allCategories")} ({achievements.length})
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterCategory === category
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {category} ({achievements.filter(a => a.category === category).length})
              </button>
            ))}
          </div>
        </div>

        {/* Achievements List */}
        {filteredAchievements.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Trophy className="size-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {t("achievements.noAchievements")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t("achievements.noAchievementsDesc")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`rounded-lg shadow-sm border p-6 transition-all hover:shadow-md ${getMedalBg(achievement.medal)}`}
              >
                <div className="flex items-start gap-6">
                  {/* Medal Icon */}
                  <div className="flex-shrink-0">
                    {getMedalIcon(achievement.medal)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                          {achievement.tournamentTitle}
                        </h3>
                        <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm">
                          {achievement.category}
                        </span>
                      </div>
                      {getPlacementBadge(achievement.placement)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar className="size-4" />
                        {new Date(achievement.date).toLocaleDateString('mn-MN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin className="size-4" />
                        {achievement.location}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Users className="size-4" />
                        {achievement.totalParticipants} {t("achievements.participants")}
                      </div>
                      {achievement.score && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Target className="size-4" />
                          {t("achievements.score")}: {achievement.score}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
