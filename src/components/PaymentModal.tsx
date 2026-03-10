import { useState, useEffect } from "react";
import { useAuth } from "../lib/auth-context";
import { useNavigate, Link } from "react-router";
import { X, CreditCard, Building, AlertCircle, CheckCircle, Award } from "lucide-react";
import { useLanguage } from "../lib/language-context";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tournamentTitle: string;
  fee: number;
}

export function PaymentModal({ isOpen, onClose, onConfirm, tournamentTitle, fee }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "qpay">("qpay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
    const { user } = useAuth();
      const { t } = useLanguage();
        const navigate = useNavigate();


  useEffect(() => {
    if (isOpen && paymentMethod === "qpay") {
      generateQRCode();
    }
  }, [isOpen, paymentMethod]);  useEffect(() => {
    if (!user || user.role !== "student") {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user || user.role !== "student") {
    return null;
  }


  const generateQRCode = () => {

    const randomData = `QPAY-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(randomData)}`;
    setQrCodeUrl(qrApiUrl);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setIsSuccess(true);
    
    // Wait a moment to show success, then confirm
    setTimeout(() => {
      onConfirm();
      setIsSuccess(false);
    }, 1500);
  };

  if (!isOpen) return null;

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        {!isSuccess ? (
          <>
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Төлбөр төлөх
                </h2>
                <p className="text-gray-600 text-sm">
                  {tournamentTitle}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="size-6" />
              </button>
            </div>

            {/* Amount */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-600 mb-1">Бүртгэлийн хураамж</div>
              <div className="text-3xl font-bold text-gray-900">
                {fee.toLocaleString()}₮
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-3">
                Төлбөрийн хэрэгсэл сонгох
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMethod("qpay")}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    paymentMethod === "qpay"
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Building className="size-6 mx-auto mb-2 text-purple-600" />
                  <div className="text-sm font-medium">QPay</div>
                </button>
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    paymentMethod === "card"
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <CreditCard className="size-6 mx-auto mb-2 text-purple-600" />
                  <div className="text-sm font-medium">Карт</div>
                </button>
              </div>
            </div>

            {/* Payment Info */}
            {paymentMethod === "qpay" && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-3">
                  QPay-ээр төлбөр төлсний дараа бүртгэл баталгаажна.
                  Энэ нь дараах банкуудаар боломжтой: Хаан банк, Хас банк, Төрийн банк гэх мэт.
                </p>
                {qrCodeUrl && (
                  <div className="mt-4 flex justify-center">
                    <img 
                      src={qrCodeUrl} 
                      alt="QPay QR Code" 
                      className="w-48 h-48 border-2 border-gray-200 rounded-lg" 
                    />
                  </div>
                )}
              </div>
            )}

            {paymentMethod === "card" && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Картын мэдээллээ оруулснаар аюулгүй төлбөр төлөх боломжтой.
                  Виза болон Мастеркарт картуудыг дэмждэг.
                </p>
              </div>
            )}

            {/* Warning */}
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="size-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-800">
                <strong>Анхааруулга:</strong> Энэ нь туршилтын төлбөр юм. 
                Бодит төлбөр авахгүй бөгөөд "Төлбөр төлөх" товч дарснаар 
                бүртгэл баталгаажна.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Төлж байна..." : "Төлбөр төлөх"}
              </button>
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Цуцлах
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="size-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="size-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Амжилттай!
            </h3>
            <p className="text-gray-600">
              Төлбөр амжилттай төлөгдлөө.
              <br />
              Бүртгэл баталгаажлаа.
            </p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}