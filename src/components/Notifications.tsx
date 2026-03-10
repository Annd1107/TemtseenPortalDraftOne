import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Bell, CheckCircle, XCircle, Info, AlertCircle, ArrowLeft, Trash2 } from "lucide-react";
import { useAuth } from "../lib/auth-context";
import { useLanguage } from "../lib/language-context";
import { setLocalStorage, getLocalStorage } from "../lib/storage-utils";

interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export function Notifications() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Load notifications from localStorage
    const stored = getLocalStorage(`temtseen_notifications_${user.id}`);
    if (stored && Array.isArray(stored)) {
      setNotifications(stored);
    } else {
      // Create mock notifications
      const mockNotifications: Notification[] = [
        {
          id: "1",
          type: "success",
          title: t("notifications.registrationSuccess"),
          message: t("notifications.registrationSuccessMsg"),
          date: new Date(Date.now() - 86400000).toISOString(),
          read: false,
        },
        {
          id: "2",
          type: "info",
          title: t("notifications.tournamentReminder"),
          message: t("notifications.tournamentReminderMsg"),
          date: new Date(Date.now() - 172800000).toISOString(),
          read: false,
        },
        {
          id: "3",
          type: "warning",
          title: t("notifications.paymentPending"),
          message: t("notifications.paymentPendingMsg"),
          date: new Date(Date.now() - 259200000).toISOString(),
          read: true,
        },
        {
          id: "4",
          type: "success",
          title: t("notifications.tournamentCreated"),
          message: t("notifications.tournamentCreatedMsg"),
          date: new Date(Date.now() - 345600000).toISOString(),
          read: true,
        },
      ];
      setNotifications(mockNotifications);
      setLocalStorage(`temtseen_notifications_${user.id}`, mockNotifications);
    }
  }, [user, navigate]);

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    if (user) {
      setLocalStorage(`temtseen_notifications_${user.id}`, updated);
    }
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    if (user) {
      setLocalStorage(`temtseen_notifications_${user.id}`, updated);
    }
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    if (user) {
      setLocalStorage(`temtseen_notifications_${user.id}`, updated);
    }
  };

  const clearAll = () => {
    if (confirm(t("notifications.confirmClear"))) {
      setNotifications([]);
      if (user) {
        setLocalStorage(`temtseen_notifications_${user.id}`, []);
      }
    }
  };

  const filteredNotifications = filter === "unread" 
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="size-6 text-green-600 dark:text-green-400" />;
      case "error":
        return <XCircle className="size-6 text-red-600 dark:text-red-400" />;
      case "warning":
        return <AlertCircle className="size-6 text-yellow-600 dark:text-yellow-400" />;
      default:
        return <Info className="size-6 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getBgColor = (type: string, read: boolean) => {
    if (read) {
      return "bg-gray-50 dark:bg-gray-800";
    }
    switch (type) {
      case "success":
        return "bg-green-50 dark:bg-green-900/20";
      case "error":
        return "bg-red-50 dark:bg-red-900/20";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900/20";
      default:
        return "bg-blue-50 dark:bg-blue-900/20";
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 mb-4 transition-colors"
        >
          <ArrowLeft className="size-4" />
          {t("notifications.back")}
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {t("notifications.title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {unreadCount > 0 ? (
                <>
                  {t("notifications.unreadCount").replace("{count}", unreadCount.toString())}
                </>
              ) : (
                t("notifications.noUnread")
              )}
            </p>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
              >
                {t("notifications.markAllRead")}
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                {t("notifications.clearAll")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 border-b-2 transition-colors ${
            filter === "all"
              ? "border-purple-600 text-purple-600 dark:text-purple-400 font-semibold"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          {t("notifications.all")} ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 border-b-2 transition-colors ${
            filter === "unread"
              ? "border-purple-600 text-purple-600 dark:text-purple-400 font-semibold"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          {t("notifications.unread")} ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Bell className="size-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {t("notifications.noNotifications")}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {t("notifications.noNotificationsDesc")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-lg border border-gray-200 dark:border-gray-700 p-4 transition-colors ${getBgColor(notification.type, notification.read)}`}
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0 pt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h3 className={`font-semibold ${notification.read ? "text-gray-700 dark:text-gray-300" : "text-gray-900 dark:text-gray-100"}`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
                        >
                          {t("notifications.markRead")}
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                  <p className={`text-sm mb-2 ${notification.read ? "text-gray-600 dark:text-gray-400" : "text-gray-700 dark:text-gray-300"}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {new Date(notification.date).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
