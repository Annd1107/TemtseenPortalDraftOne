import { useState } from "react";
import { useNavigate } from "react-router";
import { User, Mail, School, GraduationCap, Building, Phone, MapPin, Save, ArrowLeft } from "lucide-react";
import { useAuth } from "../lib/auth-context";
import { useLanguage } from "../lib/language-context";

export function Profile() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    school: user.school || "",
    grade: user.grade || "",
    organization: user.organization || "",
    address: user.address || "",
  });

  const handleSave = () => {
    // In a real app, you would save to the backend here
    setIsEditing(false);
    // Show success message
    alert(t("profile.saveSuccess"));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 mb-4 transition-colors"
        >
          <ArrowLeft className="size-4" />
          {t("profile.back")}
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {t("profile.title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("profile.subtitle")}
            </p>
          </div>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            {isEditing ? (
              <>
                <Save className="size-4" />
                {t("profile.save")}
              </>
            ) : (
              <>
                {t("profile.edit")}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        {/* Avatar Section */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
          <div className="size-24 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
            <User className="size-12 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{user.name}</h2>
            <p className="text-gray-600 dark:text-gray-400 capitalize">{user.role}</p>
            <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">{user.email}</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <User className="size-4" />
              {t("profile.name")}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:disabled:bg-gray-800"
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Mail className="size-4" />
              {t("profile.email")}
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:disabled:bg-gray-800"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Phone className="size-4" />
              {t("profile.phone")}
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!isEditing}
              placeholder="+976 xxxx xxxx"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:disabled:bg-gray-800"
            />
          </div>

          {/* Conditional fields for students */}
          {user.role === "student" && (
            <>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <School className="size-4" />
                  {t("profile.school")}
                </label>
                <input
                  type="text"
                  value={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:disabled:bg-gray-800"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <GraduationCap className="size-4" />
                  {t("profile.grade")}
                </label>
                <input
                  type="text"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:disabled:bg-gray-800"
                />
              </div>
            </>
          )}

          {/* Conditional fields for organizers */}
          {user.role === "organizer" && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Building className="size-4" />
                {t("profile.organization")}
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:disabled:bg-gray-800"
              />
            </div>
          )}

          {/* Address */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="size-4" />
              {t("profile.address")}
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              disabled={!isEditing}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:disabled:bg-gray-800"
            />
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {t("profile.saveChanges")}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  name: user.name,
                  email: user.email,
                  phone: user.phone || "",
                  school: user.school || "",
                  grade: user.grade || "",
                  organization: user.organization || "",
                  address: user.address || "",
                });
              }}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {t("profile.cancel")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
