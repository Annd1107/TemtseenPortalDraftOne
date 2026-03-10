import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { setLocalStorage, getLocalStorage } from "./storage-utils";

type Language = "mn" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  mn: {
    // Navigation
    "nav.home": "Нүүр",
    "nav.about": "Бидний тухай",
    "nav.dashboard": "Хяналтын самбар",
    "nav.tournaments": "Тэмцээнүүд",
    "nav.login": "Нэвтрэх",
    "nav.signup": "Бүртгүүлэх",
    "nav.logout": "Гарах",
    "nav.profile": "Профайл",
    "nav.notifications": "Мэдэгдэл",
    "nav.darkMode": "Харанхуй горим",
    "nav.lightMode": "Гэрэл горим",
    "nav.achievements": "Амжилт",
    
    // Home Page
    "home.title": "TemtseenPortal",
    "home.subtitle": "Монголын сурагчдад зориулсан олимпиад, тэмцээний систем",
    "home.description": "Математик, физик, хими болон бусад олимпиадад онлайнаар бүртгүүлж, амжилтаа хянаарай.",
    "home.studentTitle": "Сурагчийн хэсэг",
    "home.studentDesc": "Боломжтой тэмцээнүүдэд үзэж, бртгүүлж, өөрийн амжилтаа хянаарай",
    "home.organizerTitle": "Зохион байгуулагчийн хэсэг",
    "home.organizerDesc": "Тэмцээн үүсгэж, удирдаж, оролцогчдыг бүртгүүлээрэй",
    "home.features": "Онцлог боломжууд",
    "home.feature1": "Хялбар бүртгэл",
    "home.feature1Desc": "Хэдхэн дарцаар олимпиадад бүртгүүлээрэй",
    "home.feature2": "Найдвартай төлбөр",
    "home.feature2Desc": "Аюулгүй, найдвартай төлбөрийн систем",
    "home.feature3": "Мэдээлэл цаг тухайд нь",
    "home.feature3Desc": "Тэмцээний шинэчлэлтийг шуурхай хүлээн авах",
    
    // Student Dashboard
    "student.title": "Сурагчийн хяналтын самбар",
    "student.welcome": "Сайн байна уу",
    "student.availableTournaments": "Боломжтой тэмцээн",
    "student.myRegistrations": "Миний бүртгэл",
    "student.categories": "Ангилал",
    "student.allCategories": "Бүх ангилал",
    "student.search": "Тэмцээн хайх...",
    "student.noTournaments": "Тэмцээн олдсонгүй",
    "student.noRegistrations": "Бүртгэлтэй тэмцээн байхгүй байна",
    "student.noRegistrationsDesc": "Боломжтой тэмцээнээс сонгож бүртгүүлээрэй",
    "student.tryDifferentSearch": "Өөр нөхцлөөр хайж үзнэ үү",
    "student.registered": "Бүртгэлтэй",
    "student.full": "Дүүрсэн",
    "student.details": "Дэлгэрэнгүй",
    "student.register": "Бүртгүүлэх",
    "student.unregister": "Бүртгэл цуцлах",
    "student.finished": "Дууссан",
    "student.confirmUnregister": "Бүртгэлээ цуцлах уу?",
    "student.registrationFailed": "Бүртгэл амжилтгүй боллоо. Тэмцээн дүүрсэн байж магадгүй.",
    "student.grade": "анги",
    
    // Organizer Dashboard
    "organizer.title": "Зохион байгуулагчийн хяналтын самбар",
    "organizer.welcome": "Сайн байна уу",
    "organizer.myTournaments": "Миний тэмцээнүүд",
    "organizer.totalRegistrations": "Нийт бүртгэл",
    "organizer.revenue": "Орлого",
    "organizer.createTournament": "Шинэ тэмцээн үүсгэх",
    "organizer.noTournaments": "Тэмцээн байхгүй байна",
    "organizer.createFirst": "Эхлээд тэмцээн үүсгээрэй",
    "organizer.edit": "Засах",
    "organizer.delete": "Устгах",
    "organizer.viewRegistrations": "Бүртгэлүүдийг харах",
    "organizer.confirmDelete": "Энэ тэмцээнийг устгах уу?",
    
    // Tournament Form
    "tournament.title": "Тэмцээний нэр",
    "tournament.description": "Тайлбар",
    "tournament.category": "Ангилал",
    "tournament.date": "Огноо",
    "tournament.location": "Байршил",
    "tournament.maxParticipants": "Хамгийн их оролцогч",
    "tournament.registrationFee": "Бүртгэлийн төлбөр (₮)",
    "tournament.pdfFile": "Бэлтгэл материал / Туршилтын тест (PDF)",
    "tournament.downloadMaterial": "Материал татах",
    "tournament.create": "Тэмцээн үүсгэх",
    "tournament.update": "Шинэчлэх",
    "tournament.cancel": "Цуцлах",
    
    // Tournament Detail
    "detail.tournamentDetails": "Тэмцээний дэлгэрэнгүй",
    "detail.about": "Тэмцээний тухай",
    "detail.organizer": "Зохион байгуулагч",
    "detail.registrationInfo": "Бүртгэлийн мэдээлэл",
    "detail.spotsLeft": "Үлдсэн орон зай",
    "detail.spots": "орон зай",
    "detail.payment": "Төлбөр",
    "detail.status": "Статус",
    "detail.open": "Нээлттэй",
    "detail.closed": "Хаагдсан",
    "detail.backToDashboard": "Хяналтын самбар руу буцах",
    "detail.notFound": "Тэмцээн олдсонгүй",
    "detail.notFoundDesc": "Таны хайсан тэмцээн олдсонгүй эсвэл устгагдсан байна",
    
    // Payment Modal
    "payment.title": "Бүртгэлийн төлбөр төлөх",
    "payment.tournament": "Тэмцээн",
    "payment.amount": "Дүн",
    "payment.cardNumber": "Картын дугаар",
    "payment.expiryDate": "Хүчинтэй хугацаа (ММ/ЖЖ)",
    "payment.cvv": "CVV",
    "payment.confirmPayment": "Төлбөр төлөх",
    "payment.processing": "Боловсруулж байна...",
    "payment.success": "Төлбөр амжилттай төлөгдлөө!",
    "payment.successMessage": "Та амжилттай бүртгэгдлээ.",
    "payment.error": "Төлбөр амжилтгүй боллоо",
    "payment.tryAgain": "Дахин оролдоно уу",
    
    // Auth
    "auth.studentLogin": "Сурагч нэвтрэх",
    "auth.organizerLogin": "Зохион байгуулагч нэвтрэх",
    "auth.email": "Имэйл",
    "auth.password": "Нууц үг",
    "auth.login": "Нэвтрэх",
    "auth.noAccount": "Бүртгэлгүй юу?",
    "auth.signupHere": "Энд бүртгүүлэх",
    "auth.invalidCredentials": "Имэйл эсвэл нууц үг буруу байна",
    "auth.studentSignup": "Сурагч бүртгүүлэх",
    "auth.organizerSignup": "Зохион байгуулагч бүртгүүлэх",
    "auth.name": "Нэр",
    "auth.school": "Сургууль",
    "auth.grade": "Анги",
    "auth.organization": "Байгууллага",
    "auth.signup": "Бүртгүүлэх",
    "auth.haveAccount": "Бүртгэлтэй юу?",
    "auth.loginHere": "Энд нэвтрэх",
    
    // About Page
    "about.title": "Бидний тухай",
    "about.mission": "Бидний эрхэм зорилго",
    "about.missionText": "TemtseenPortal нь Монголын сурагчдад олимпиад, тэмцээнд хялбархан бүртгүүлэх боломжийг олгохоор зорьж байна. Бид боловсролын салбарт дижитал шийдлээр дэмжлэг үзүүлж, сурагчдын ур чадварыг хөгжүүлэхэд хувь нэмэр оруулж байна.",
    "about.howItWorks": "Хэрхэн ажилладаг вэ?",
    "about.forStudents": "Сурагчдад",
    "about.forStudentsText": "Боломжтой тэмцээнүүдийг хайж олж, хэдхэн дарцаар бүртгүүлээрэй. Найдвартай төлбөрийн системээр бүртгэлийн төлбөрөө төлж, өөрийн амжилтаа хянаарай.",
    "about.forOrganizers": "Зохион байгуулагчдад",
    "about.forOrganizersText": "Тэмцээн үүсгэж, оролцогчдыг удирдаж, бүртгэлийн төлбөрийг хянаарай. Бүх процессыг нэг платформ дээр хялбараар удирдаарай.",
    "about.contact": "Холбоо барих",
    "about.contactText": "Асуулт, санал хүсэлт байвал бидэнтэй холбогдоорой:",
    "about.email": "Имэйл: info@temtseenportal.mn",
    "about.phone": "Утас: +976 7000-0000",
    
    // Footer
    "footer.copyright": "© 2026 TemtseenPortal. Монголын сурагчдад зориулсан олимпиад, тэмцээний бүртгэлийн систем",
    
    // Profile
    "profile.title": "Хувийн мэдээлэл",
    "profile.subtitle": "өрийн профайл мэдээллээ засаарай",
    "profile.back": "Буцах",
    "profile.edit": "Засах",
    "profile.save": "Хадгалах",
    "profile.saveChanges": "Өөрчлөлт хадгалах",
    "profile.cancel": "Цуцлах",
    "profile.saveSuccess": "Амжилттай хадгалагдлаа!",
    "profile.name": "Нэр",
    "profile.email": "Имэйл",
    "profile.phone": "Утас",
    "profile.school": "Сургууль",
    "profile.grade": "Анги",
    "profile.organization": "Байгууллага",
    "profile.address": "Хаяг",
    
    // Notifications
    "notifications.title": "Мэдэгдлүүд",
    "notifications.back": "Буцах",
    "notifications.unreadCount": "{count} уншаагүй мэдэгдэл",
    "notifications.noUnread": "Уншаагүй мэдэгдэл байхгүй",
    "notifications.markAllRead": "Бүгдийг унших",
    "notifications.clearAll": "Бүгдийг устгах",
    "notifications.all": "Бүгд",
    "notifications.unread": "Уншаагүй",
    "notifications.markRead": "Унших",
    "notifications.noNotifications": "Мэдэгдэл байхгүй байна",
    "notifications.noNotificationsDesc": "Та шинэ мэдэгдэл хүлээн авахад энд харагдана",
    "notifications.confirmClear": "Бүх мэдэгдлийг устгах уу?",
    "notifications.registrationSuccess": "Бүртгэл амжилттай!",
    "notifications.registrationSuccessMsg": "Та тэмцээнд амжилттай бүртгэгдлээ.",
    "notifications.tournamentReminder": "Тэмцээний сануулга",
    "notifications.tournamentReminderMsg": "Таны тэмцээн 3 өдрийн дараа эхэлнэ.",
    "notifications.paymentPending": "Төлбөр хүлээгдэж байна",
    "notifications.paymentPendingMsg": "Таны бүртгэлийн төлбөр төлөгдөөгүй байна.",
    "notifications.tournamentCreated": "Тэмцээн үүсгэгдлээ",
    "notifications.tournamentCreatedMsg": "Таны тэмцээн амжилттай үүсгэгдлээ.",
    
    // Achievements
    "achievements.title": "Миний амжилтууд",
    "achievements.subtitle": "Таны олимпиад, тэмцээний түүх",
    "achievements.back": "Буцах",
    "achievements.total": "Нийт",
    "achievements.gold": "Алт",
    "achievements.silver": "Мөнгө",
    "achievements.bronze": "Хүрэл",
    "achievements.avgPlace": "Дундаж байр",
    "achievements.allCategories": "Бүх ангилал",
    "achievements.noAchievements": "Амжилт байхгүй байна",
    "achievements.noAchievementsDesc": "Тэмцээнд оролцож, амжилт бүртгүүлээрэй",
    "achievements.first": "1-р байр",
    "achievements.second": "2-р байр",
    "achievements.third": "3-р байр",
    "achievements.place": "-р байр",
    "achievements.participants": "оролцогч",
    "achievements.score": "Оноо",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About",
    "nav.dashboard": "Dashboard",
    "nav.tournaments": "Tournaments",
    "nav.login": "Login",
    "nav.signup": "Sign Up",
    "nav.logout": "Logout",
    "nav.profile": "Profile",
    "nav.notifications": "Notifications",
    "nav.darkMode": "Dark Mode",
    "nav.lightMode": "Light Mode",
    "nav.achievements": "Achievements",
    
    // Home Page
    "home.title": "TemtseenPortal",
    "home.subtitle": "Olympiad and Tournament System for Mongolian Students",
    "home.description": "Register online for math, physics, chemistry, and other olympiads, and track your progress.",
    "home.studentTitle": "For Students",
    "home.studentDesc": "Browse available tournaments, register, and track your achievements",
    "home.organizerTitle": "For Organizers",
    "home.organizerDesc": "Create and manage tournaments, register participants",
    "home.features": "Key Features",
    "home.feature1": "Easy Registration",
    "home.feature1Desc": "Register for olympiads with just a few clicks",
    "home.feature2": "Secure Payments",
    "home.feature2Desc": "Safe and reliable payment system",
    "home.feature3": "Real-time Updates",
    "home.feature3Desc": "Receive tournament updates instantly",
    
    // Student Dashboard
    "student.title": "Student Dashboard",
    "student.welcome": "Welcome",
    "student.availableTournaments": "Available Tournaments",
    "student.myRegistrations": "My Registrations",
    "student.categories": "Categories",
    "student.allCategories": "All Categories",
    "student.search": "Search tournaments...",
    "student.noTournaments": "No tournaments found",
    "student.noRegistrations": "No registrations yet",
    "student.noRegistrationsDesc": "Browse available tournaments and register",
    "student.tryDifferentSearch": "Try a different search",
    "student.registered": "Registered",
    "student.full": "Full",
    "student.details": "Details",
    "student.register": "Register",
    "student.unregister": "Cancel Registration",
    "student.finished": "Finished",
    "student.confirmUnregister": "Cancel registration?",
    "student.registrationFailed": "Registration failed. Tournament may be full.",
    
    // Organizer Dashboard
    "organizer.title": "Organizer Dashboard",
    "organizer.welcome": "Welcome",
    "organizer.myTournaments": "My Tournaments",
    "organizer.totalRegistrations": "Total Registrations",
    "organizer.revenue": "Revenue",
    "organizer.createTournament": "Create New Tournament",
    "organizer.noTournaments": "No tournaments yet",
    "organizer.createFirst": "Create your first tournament",
    "organizer.edit": "Edit",
    "organizer.delete": "Delete",
    "organizer.viewRegistrations": "View Registrations",
    "organizer.confirmDelete": "Delete this tournament?",
    
    // Tournament Form
    "tournament.title": "Tournament Title",
    "tournament.description": "Description",
    "tournament.category": "Category",
    "tournament.date": "Date",
    "tournament.location": "Location",
    "tournament.maxParticipants": "Max Participants",
    "tournament.registrationFee": "Registration Fee (₮)",
    "tournament.pdfFile": "Competition Material / Test (PDF)",
    "tournament.downloadMaterial": "Download Material",
    "tournament.create": "Create Tournament",
    "tournament.update": "Update",
    "tournament.cancel": "Cancel",
    
    // Tournament Detail
    "detail.tournamentDetails": "Tournament Details",
    "detail.about": "About Tournament",
    "detail.organizer": "Organizer",
    "detail.registrationInfo": "Registration Information",
    "detail.spotsLeft": "Spots Left",
    "detail.spots": "spots",
    "detail.payment": "Payment",
    "detail.status": "Status",
    "detail.open": "Open",
    "detail.closed": "Closed",
    "detail.backToDashboard": "Back to Dashboard",
    "detail.notFound": "Tournament Not Found",
    "detail.notFoundDesc": "The tournament you're looking for doesn't exist or has been deleted",
    
    // Payment Modal
    "payment.title": "Pay Registration Fee",
    "payment.tournament": "Tournament",
    "payment.amount": "Amount",
    "payment.cardNumber": "Card Number",
    "payment.expiryDate": "Expiry Date (MM/YY)",
    "payment.cvv": "CVV",
    "payment.confirmPayment": "Confirm Payment",
    "payment.processing": "Processing...",
    "payment.success": "Payment Successful!",
    "payment.successMessage": "You have been successfully registered.",
    "payment.error": "Payment Failed",
    "payment.tryAgain": "Please try again",
    
    // Auth
    "auth.studentLogin": "Student Login",
    "auth.organizerLogin": "Organizer Login",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.login": "Login",
    "auth.noAccount": "Don't have an account?",
    "auth.signupHere": "Sign up here",
    "auth.invalidCredentials": "Invalid email or password",
    "auth.studentSignup": "Student Sign Up",
    "auth.organizerSignup": "Organizer Sign Up",
    "auth.name": "Name",
    "auth.school": "School",
    "auth.grade": "Grade",
    "auth.organization": "Organization",
    "auth.signup": "Sign Up",
    "auth.haveAccount": "Already have an account?",
    "auth.loginHere": "Login here",
    
    // About Page
    "about.title": "About Us",
    "about.mission": "Our Mission",
    "about.missionText": "TemtseenPortal aims to provide Mongolian students with easy access to olympiad and tournament registration. We support the education sector with digital solutions and contribute to developing students' skills.",
    "about.howItWorks": "How It Works",
    "about.forStudents": "For Students",
    "about.forStudentsText": "Browse available tournaments and register with just a few clicks. Pay registration fees through our secure payment system and track your achievements.",
    "about.forOrganizers": "For Organizers",
    "about.forOrganizersText": "Create tournaments, manage participants, and track registration fees. Manage the entire process easily on one platform.",
    "about.contact": "Contact Us",
    "about.contactText": "If you have any questions or suggestions, please contact us:",
    "about.email": "Email: info@temtseenportal.mn",
    "about.phone": "Phone: +976 7000-0000",
    
    // Footer
    "footer.copyright": "© 2026 TemtseenPortal. Olympiad and Tournament Registration System for Mongolian Students",
    
    // Profile
    "profile.title": "Profile",
    "profile.subtitle": "Edit your profile information",
    "profile.back": "Back",
    "profile.edit": "Edit",
    "profile.save": "Save",
    "profile.saveChanges": "Save Changes",
    "profile.cancel": "Cancel",
    "profile.saveSuccess": "Saved successfully!",
    "profile.name": "Name",
    "profile.email": "Email",
    "profile.phone": "Phone",
    "profile.school": "School",
    "profile.grade": "Grade",
    "profile.organization": "Organization",
    "profile.address": "Address",
    
    // Notifications
    "notifications.title": "Notifications",
    "notifications.back": "Back",
    "notifications.unreadCount": "{count} unread notifications",
    "notifications.noUnread": "No unread notifications",
    "notifications.markAllRead": "Mark all as read",
    "notifications.clearAll": "Clear all",
    "notifications.all": "All",
    "notifications.unread": "Unread",
    "notifications.markRead": "Mark as read",
    "notifications.noNotifications": "No notifications",
    "notifications.noNotificationsDesc": "You will see new notifications here",
    "notifications.confirmClear": "Clear all notifications?",
    "notifications.registrationSuccess": "Registration successful!",
    "notifications.registrationSuccessMsg": "You have been successfully registered for the tournament.",
    "notifications.tournamentReminder": "Tournament Reminder",
    "notifications.tournamentReminderMsg": "Your tournament starts in 3 days.",
    "notifications.paymentPending": "Payment pending",
    "notifications.paymentPendingMsg": "Your registration payment is pending.",
    "notifications.tournamentCreated": "Tournament Created",
    "notifications.tournamentCreatedMsg": "Your tournament has been successfully created.",
    
    // Achievements
    "achievements.title": "My Achievements",
    "achievements.subtitle": "Your olympiad and tournament history",
    "achievements.back": "Back",
    "achievements.total": "Total",
    "achievements.gold": "Gold",
    "achievements.silver": "Silver",
    "achievements.bronze": "Bronze",
    "achievements.avgPlace": "Average Place",
    "achievements.allCategories": "All Categories",
    "achievements.noAchievements": "No achievements yet",
    "achievements.noAchievementsDesc": "Participate in tournaments to earn achievements",
    "achievements.first": "1st Place",
    "achievements.second": "2nd Place",
    "achievements.third": "3rd Place",
    "achievements.place": "Place",
    "achievements.participants": "Participants",
    "achievements.score": "Score",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("mn");

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = getLocalStorage("temtseen_language");
    if (savedLanguage === "mn" || savedLanguage === "en") {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage when it changes
  useEffect(() => {
    setLocalStorage("temtseen_language", language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}