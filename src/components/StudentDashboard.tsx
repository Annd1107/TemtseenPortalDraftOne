import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { Trophy, Calendar, MapPin, Users, Search, Filter, CheckCircle, Banknote, Award, FileText, Download } from "lucide-react";
import { useAuth } from "../lib/auth-context";
import { useTournaments } from "../lib/tournament-context";
import { useLanguage } from "../lib/language-context";
import { PaymentModal } from "./PaymentModal";

export function StudentDashboard() {
  const { user } = useAuth();
  const { tournaments, getStudentRegistrations, registerForTournament, unregisterFromTournament } = useTournaments();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"available" | "registered">("available");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<{ id: string; title: string; fee: number } | null>(null);

  useEffect(() => {
    if (!user || user.role !== "student") {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user || user.role !== "student") {
    return null;
  }

  const myRegistrations = getStudentRegistrations(user.id);

  // Filter tournaments
  const filteredTournaments = tournaments.filter((tournament) => {
    const matchesSearch = tournament.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tournament.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || tournament.category === categoryFilter;
    
    if (activeTab === "registered") {
      return myRegistrations.some(r => r.id === tournament.id);
    }
    
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(tournaments.map(t => t.category)))];

  const handleRegister = (tournamentId: string) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (tournament) {
      setSelectedTournament({
        id: tournament.id,
        title: tournament.title,
        fee: tournament.registrationFee
      });
      setShowPaymentModal(true);
    }
  };

  const handlePaymentConfirm = () => {
    if (selectedTournament) {
      const success = registerForTournament(selectedTournament.id, user.id);
      if (!success) {
        alert(t("student.registrationFailed"));
      }
      setShowPaymentModal(false);
      setSelectedTournament(null);
    }
  };

  const handlePaymentClose = () => {
    setShowPaymentModal(false);
    setSelectedTournament(null);
  };

  const handleUnregister = (tournamentId: string) => {
    if (confirm(t("student.confirmUnregister"))) {
      unregisterFromTournament(tournamentId, user.id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {t("student.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("student.welcome")}, {user.name} - {user.school} ({user.grade})
          </p>
        </div>
        <Link
          to="/achievements"
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Award className="size-5" />
          <span className="hidden sm:inline">{t("nav.achievements")}</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">{t("student.availableTournaments")}</span>
            <Trophy className="size-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{tournaments.length}</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">{t("student.myRegistrations")}</span>
            <CheckCircle className="size-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{myRegistrations.length}</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">{t("student.categories")}</span>
            <Filter className="size-5 text-indigo-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{categories.length - 1}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("available")}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === "available"
              ? "border-purple-600 text-purple-600 font-semibold"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          {t("student.availableTournaments")}
        </button>
        <button
          onClick={() => setActiveTab("registered")}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === "registered"
              ? "border-purple-600 text-purple-600 font-semibold"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          {t("student.myRegistrations")}
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
            <input
              type="text"
              placeholder={t("student.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">{t("student.allCategories")}</option>
              {categories.slice(1).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tournament Grid */}
      {filteredTournaments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Trophy className="size-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {activeTab === "available" ? t("student.noTournaments") : t("student.noRegistrations")}
          </h3>
          <p className="text-gray-600">
            {activeTab === "available" ? t("student.checkBack") : t("student.browseAvailable")}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => {
            const isRegistered = myRegistrations.some(r => r.id === tournament.id);
            const isFull = tournament.registeredCount >= tournament.maxParticipants;
            const isPast = new Date(tournament.date) < new Date();

            return (
              <div
                key={tournament.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="mb-4 flex-1">
                  <div className="mb-2">
                    <h3 className="font-bold text-gray-900 text-lg line-clamp-2 mb-2">
                      {tournament.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                        {tournament.category}
                      </span>
                      {isRegistered && (
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center gap-1">
                          <CheckCircle className="size-3" />
                          {t("student.registered")}
                        </span>
                      )}
                      {isFull && !isRegistered && (
                        <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                          {t("student.full")}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-3">{tournament.description}</p>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="size-4 flex-shrink-0" />
                    <span className="truncate">{new Date(tournament.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="size-4 flex-shrink-0" />
                    <span className="truncate">{tournament.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="size-4 flex-shrink-0" />
                    <span>
                      {tournament.registeredCount} / {tournament.maxParticipants}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Banknote className="size-4 flex-shrink-0" />
                    <span className="font-semibold">{tournament.registrationFee.toLocaleString()}₮</span>
                  </div>
                  {tournament.preparationMaterial && (
                    <a
                      href={tournament.preparationMaterial.fileUrl}
                      download={tournament.preparationMaterial.fileName}
                      className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
                      title={t("tournament.downloadMaterial")}
                    >
                      <FileText className="size-4 flex-shrink-0" />
                      <span className="truncate text-xs">{tournament.preparationMaterial.fileName}</span>
                      <Download className="size-3 flex-shrink-0" />
                    </a>
                  )}
                </div>

                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min((tournament.registeredCount / tournament.maxParticipants) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-3 border-t border-gray-200">
                  <Link
                    to={`/tournament/${tournament.id}`}
                    className="w-full px-4 py-2 text-center text-purple-600 hover:bg-purple-50 rounded-lg transition-colors text-sm"
                  >
                    {t("student.details")}
                  </Link>
                  {isRegistered ? (
                    <button
                      onClick={() => handleUnregister(tournament.id)}
                      className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                    >
                      {t("student.unregister")}
                    </button>
                  ) : isPast ? (
                    <button
                      disabled
                      className="w-full px-4 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed text-sm"
                    >
                      {t("student.finished")}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRegister(tournament.id)}
                      disabled={isFull}
                      className={`w-full px-4 py-2 rounded-lg transition-colors text-sm ${
                        isFull
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-purple-600 text-white hover:bg-purple-700"
                      }`}
                    >
                      {t("student.register")}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {showPaymentModal && selectedTournament && (
        <PaymentModal
          isOpen={showPaymentModal}
          tournamentTitle={selectedTournament.title}
          fee={selectedTournament.fee}
          onConfirm={handlePaymentConfirm}
          onClose={handlePaymentClose}
        />
      )}
    </div>
  );
}