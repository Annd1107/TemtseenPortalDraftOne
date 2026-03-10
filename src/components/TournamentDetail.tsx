import { useParams, useNavigate, Link } from "react-router";
import { Calendar, MapPin, Users, Trophy, ArrowLeft, CheckCircle, Building, Banknote } from "lucide-react";
import { useAuth } from "../lib/auth-context";
import { useTournaments } from "../lib/tournament-context";
import { PaymentModal } from "./PaymentModal";
import { useState } from "react";

export function TournamentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getTournamentById, registerForTournament, unregisterFromTournament, getStudentRegistrations } = useTournaments();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const tournament = getTournamentById(id || "");

  if (!tournament) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Тэмцээн олдсонгүй</h1>
        <Link to="/" className="text-blue-600 hover:text-blue-700">
          Нүүр хуудас руу буцах
        </Link>
      </div>
    );
  }

  const isStudent = user?.role === "student";
  const myRegistrations = isStudent ? getStudentRegistrations(user.id) : [];
  const isRegistered = myRegistrations.some(r => r.id === tournament.id);
  const isFull = tournament.registeredCount >= tournament.maxParticipants;
  const isPast = new Date(tournament.date) < new Date();

  const handleRegister = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    // Show payment modal instead of directly registering
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    if (!user) return;
    const success = registerForTournament(tournament.id, user.id);
    setShowPaymentModal(false);
    if (!success) {
      alert("Бүртгэл амжилтгүй боллоо. Тэмцээн дүүрсэн байж магадгүй.");
    }
  };

  const handleUnregister = () => {
    if (!user) return;
    if (confirm("Бүртгэлээ цуцлах уу?")) {
      unregisterFromTournament(tournament.id, user.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="size-4" />
        Буцах
      </button>

      {/* Tournament Header */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold text-gray-900">
                {tournament.title}
              </h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                {tournament.category}
              </span>
            </div>
            {isRegistered && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg mb-4">
                <CheckCircle className="size-5" />
                <span>Та энэ тэмцээнд бүртгэлтэй байна</span>
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-700 text-lg mb-8 leading-relaxed">
          {tournament.description}
        </p>

        {/* Tournament Info Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-start gap-3">
            <div className="size-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="size-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Огноо</h3>
              <p className="text-gray-600">
                {new Date(tournament.date).toLocaleDateString('mn-MN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="size-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="size-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Байршил</h3>
              <p className="text-gray-600">{tournament.location}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="size-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="size-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Оролцогчид</h3>
              <p className="text-gray-600">
                {tournament.registeredCount} / {tournament.maxParticipants} бүртгэлтэй
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{
                    width: `${Math.min((tournament.registeredCount / tournament.maxParticipants) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="size-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building className="size-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Зохион байгуулагч</h3>
              <p className="text-gray-600">{tournament.organizerName}</p>
              <p className="text-gray-500 text-sm">{tournament.organizerOrganization}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="size-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Banknote className="size-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Бүртгэлийн хураамж</h3>
              <p className="text-gray-600 text-xl font-bold">{tournament.registrationFee.toLocaleString()}₮</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isStudent && (
          <div className="pt-6 border-t border-gray-200">
            {isRegistered ? (
              <button
                onClick={handleUnregister}
                className="w-full md:w-auto px-8 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Бүртгэл цуцлах
              </button>
            ) : (
              <button
                onClick={handleRegister}
                disabled={isFull || isPast}
                className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFull ? "Тэмцээн дүүрсэн" : isPast ? "Тэмцээн дууссан" : "Бүртгүүлэх"}
              </button>
            )}
          </div>
        )}

        {!user && (
          <div className="pt-6 border-t border-gray-200">
            <p className="text-gray-600 mb-4">
              Тэмцээнд бүртгүүлэхийн тулд эхлээд нэвтэрнэ үү
            </p>
            <Link
              to="/login"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Нэвтрэх
            </Link>
          </div>
        )}
      </div>

      {/* Additional Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Анхааруулга</h2>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Бүртгүүлэхдээ таны мэдээллийг үнэн зөв бөглөнө үү</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Тэмцээний өдөр эрт ирж бүртгэл хийлгэнэ үү</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Оюутны үнэмлэх болон бусад шаардлагатай материалаа бэлдэж ирнэ үү</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Тэмцээний дүрэм журмыг урьдчилан танилцана уу</span>
          </li>
        </ul>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onConfirm={handlePaymentSuccess}
          tournamentTitle={tournament.title}
          fee={tournament.registrationFee}
        />
      )}
    </div>
  );
}