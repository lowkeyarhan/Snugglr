import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getCurrentUser, updateUserSettings } from "../utils/api";

export default function Settings() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [showActiveStatus, setShowActiveStatus] = useState(true);
  const [hideDP, setHideDP] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Load current settings from backend
  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await getCurrentUser(token);
        const user = res.data?.user as any;
        if (user) {
          setUserEmail(user.email || "");
          setPushNotifications(!!user?.settings?.pushNotifications);
          setEmailNotifications(!!user?.settings?.emailNotifications);
          setShowActiveStatus(!!user?.privacy?.showActiveStatus);
          setHideDP(!!user?.privacy?.hideDisplayPicture);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Optimistically update localStorage user object
  const updateUserInStorage = (path: string[], value: any) => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);
      let cursor = user;
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        cursor[key] = cursor[key] ?? {};
        cursor = cursor[key];
      }
      cursor[path[path.length - 1]] = value;
      localStorage.setItem("user", JSON.stringify(user));
    } catch {
      // ignore
    }
  };

  // Generic toggle handler
  const handleToggle = async (
    key:
      | "pushNotifications"
      | "emailNotifications"
      | "showActiveStatus"
      | "hideDisplayPicture",
    checked: boolean,
    setter: (v: boolean) => void,
    storagePath: string[]
  ) => {
    const prev = !checked;
    setter(checked);
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await updateUserSettings({ [key]: checked } as any, token);
      updateUserInStorage(storagePath, checked);
    } catch (e) {
      // revert on error
      setter(prev);
    }
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log("Logout clicked");
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
      <div className="flex h-full w-full">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto h-screen">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="w-full max-w-3xl mx-auto">
              <div className="space-y-8">
                {/* Header with Profile */}
                <div className="flex flex-col items-center gap-4 pb-4">
                  <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                    Settings
                  </h1>
                </div>

                <div className="space-y-5">
                  {/* Account Settings */}
                  <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft overflow-hidden border border-slate-100 dark:border-slate-800">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-2xl">
                          account_circle
                        </span>
                        <h2 className="text-xl font-bold">Account Settings</h2>
                      </div>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      <button className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="text-left">
                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                              Email
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {userEmail || ""}
                            </p>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                          chevron_right
                        </span>
                      </button>
                      <button className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group cursor-pointer">
                        <div className="flex items-center gap-4">
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            Change Password
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                          chevron_right
                        </span>
                      </button>
                      <button className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group cursor-pointer">
                        <div className="flex items-center gap-4">
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            Linked College Accounts
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                          chevron_right
                        </span>
                      </button>
                    </div>
                  </section>

                  {/* Privacy & Safety */}
                  <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft overflow-hidden border border-slate-100 dark:border-slate-800">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-2xl">
                          shield
                        </span>
                        <h2 className="text-xl font-bold">Privacy & Safety</h2>
                      </div>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                              Show Active Status
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Let others see when you're online
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showActiveStatus}
                            disabled={loading}
                            onChange={(e) =>
                              handleToggle(
                                "showActiveStatus",
                                e.target.checked,
                                setShowActiveStatus,
                                ["privacy", "showActiveStatus"]
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-12 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                              Hide Display Picture
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Keep your profile photo private
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={hideDP}
                            disabled={loading}
                            onChange={(e) =>
                              handleToggle(
                                "hideDisplayPicture",
                                e.target.checked,
                                setHideDP,
                                ["privacy", "hideDisplayPicture"]
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-12 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                        </label>
                      </div>
                      <button className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group cursor-pointer">
                        <div className="flex items-center gap-4">
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            Blocked & Reported Users
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                          chevron_right
                        </span>
                      </button>
                      <button className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group cursor-pointer">
                        <div className="flex items-center gap-4">
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            Data Sharing
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                          chevron_right
                        </span>
                      </button>
                    </div>
                  </section>

                  {/* App Preferences */}
                  <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft overflow-hidden border border-slate-100 dark:border-slate-800">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-2xl">
                          tune
                        </span>
                        <h2 className="text-xl font-bold">App Preferences</h2>
                      </div>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                              Push Notifications
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Get notified about messages and matches
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={pushNotifications}
                            disabled={loading}
                            onChange={(e) =>
                              handleToggle(
                                "pushNotifications",
                                e.target.checked,
                                setPushNotifications,
                                ["settings", "pushNotifications"]
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-12 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                              Email Notifications
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Receive weekly digest emails
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={emailNotifications}
                            disabled={loading}
                            onChange={(e) =>
                              handleToggle(
                                "emailNotifications",
                                e.target.checked,
                                setEmailNotifications,
                                ["settings", "emailNotifications"]
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-12 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                        </label>
                      </div>
                      <button className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group cursor-pointer">
                        <div className="flex items-center gap-4">
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            Theme Preferences
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                          chevron_right
                        </span>
                      </button>
                      <button className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group cursor-pointer">
                        <div className="flex items-center gap-4">
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            Sound Settings
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                          chevron_right
                        </span>
                      </button>
                    </div>
                  </section>

                  {/* Support & Help */}
                  <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft overflow-hidden border border-slate-100 dark:border-slate-800">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-2xl">
                          help
                        </span>
                        <h2 className="text-xl font-bold">Support & Help</h2>
                      </div>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      <button className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group cursor-pointer">
                        <div className="flex items-center gap-4">
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            FAQs
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                          chevron_right
                        </span>
                      </button>
                      <button className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group cursor-pointer">
                        <div className="flex items-center gap-4">
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            Contact Support
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                          chevron_right
                        </span>
                      </button>
                      <button className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group cursor-pointer">
                        <div className="flex items-center gap-4">
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            Terms of Service
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                          chevron_right
                        </span>
                      </button>
                      <button className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group cursor-pointer">
                        <div className="flex items-center gap-4">
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            Privacy Policy
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                          chevron_right
                        </span>
                      </button>
                    </div>
                  </section>

                  {/* Logout Button */}
                  <section className="pt-4 pb-8 flex justify-center">
                    <button
                      onClick={handleLogout}
                      className="w-full sm:w-auto min-w-[200px] px-8 py-3.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-full hover:from-red-600 hover:to-red-700 transition-all shadow-soft hover:shadow-lifted transform hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center justify-center gap-2 group"
                    >
                      <span className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">
                        logout
                      </span>
                      <span>Logout</span>
                    </button>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
