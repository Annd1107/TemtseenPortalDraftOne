import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Plus, Calendar, MapPin, Users, Trophy, Edit, Trash2, FileText, Upload } from "lucide-react";
import { useAuth } from "../lib/auth-context";
import { useTournaments } from "../lib/tournament-context";
import { useLanguage } from "../lib/language-context";

export function OrganizerDashboard() {
  const { user } = useAuth();
  const { getOrganizerTournaments, addTournament, deleteTournament } = useTournaments();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(100);
  const [registrationFee, setRegistrationFee] = useState(10000);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState("");

  useEffect(() => {
    if (!user || user.role !== "organizer") {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user || user.role !== "organizer") {
    return null;
  }

  const myTournaments = getOrganizerTournaments(user.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tournamentData: any = {
      title,
      description,
      category,
      date,
      location,
      maxParticipants,
      registrationFee,
      organizerId: user.id,
      organizerName: user.name,
      organizerOrganization: user.organization || "",
    };

    // Add preparation material if PDF was uploaded
    if (pdfFile) {
      tournamentData.preparationMaterial = {
        fileName: pdfFile.name,
        fileUrl: URL.createObjectURL(pdfFile), // In a real app, this would be uploaded to a server
      };
    }

    addTournament(tournamentData);

    // Reset form
    setTitle("");
    setDescription("");
    setCategory("");
    setDate("");
    setLocation("");
    setMaxParticipants(100);
    setRegistrationFee(10000);
    setPdfFile(null);
    setPdfFileName("");
    setShowAddForm(false);
  };

  const handleDelete = (tournamentId: string) => {
    if (confirm(t("organizer.confirmDelete"))) {
      deleteTournament(tournamentId);
    }
  };

  const categories = [
    { mn: "Математик", en: "Mathematics" },
    { mn: "Физик", en: "Physics" },
    { mn: "Хими", en: "Chemistry" },
    { mn: "Биологи", en: "Biology" },
    { mn: "Англи хэл", en: "English" },
    { mn: "Программчлал", en: "Programming" },
    { mn: "Бусад", en: "Other" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {t("organizer.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("organizer.welcome")}, {user.name} - {user.organization}
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400">{t("organizer.myTournaments")}</span>
            <Trophy className="size-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{myTournaments.length}</div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400">{t("organizer.totalRegistrations")}</span>
            <Users className="size-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {myTournaments.reduce((sum, t) => sum + t.registeredCount, 0)}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400">{t("organizer.revenue")}</span>
            <Calendar className="size-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {myTournaments.reduce((sum, t) => sum + (t.registeredCount * t.registrationFee), 0).toLocaleString()}₮
          </div>
        </div>
      </div>

      {/* Add Tournament Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="size-5" />
          {t("organizer.createTournament")}
        </button>
      </div>

      {/* Add Tournament Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("organizer.createTournament")}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">
                  {t("tournament.title")} *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder={t("tournament.title")}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  {t("tournament.category")} *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent appearance-none bg-white"
                  required
                >
                  <option value="">{t("student.allCategories")}</option>
                  {categories.map((cat) => (
                    <option key={cat.en} value={cat.mn}>
                      {cat.mn} / {cat.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                {t("tournament.description")} *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                rows={3}
                placeholder={t("tournament.description")}
                required
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">
                  {t("tournament.date")} *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  {t("tournament.location")} *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder={t("tournament.location")}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  {t("tournament.maxParticipants")} *
                </label>
                <input
                  type="number"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                {t("tournament.registrationFee")} *
              </label>
              <input
                type="number"
                value={registrationFee}
                onChange={(e) => setRegistrationFee(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="10000"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                {t("tournament.pdfFile")}
              </label>
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-gray-500" />
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setPdfFile(file);
                      setPdfFileName(file.name);
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
                {pdfFileName && (
                  <span className="text-gray-500 text-sm">
                    {pdfFileName}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {t("tournament.create")}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {t("tournament.cancel")}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* My Tournaments */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("organizer.myTournaments")}</h2>
        
        {myTournaments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Trophy className="size-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t("organizer.noTournaments")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("organizer.createFirst")}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myTournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="mb-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-gray-900 text-lg line-clamp-2">
                      {tournament.title}
                    </h3>
                  </div>
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs mb-3">
                    {tournament.category}
                  </span>
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

                <div className="flex gap-2 pt-3 border-t border-gray-200">
                  <button className="flex-1 p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                    <Edit className="size-4 mx-auto" />
                  </button>
                  <button
                    className="flex-1 p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    onClick={() => handleDelete(tournament.id)}
                  >
                    <Trash2 className="size-4 mx-auto" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}