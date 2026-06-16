"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateSettingsBatch } from "@/actions/settings.actions";
import { Save, CheckCircle, AlertCircle, Loader2, Settings, Mail, Phone, MapPin, Globe } from "lucide-react";

interface SettingItem {
  id: number;
  key: string;
  value: string;
  group: string;
  valueType: string;
}

interface SettingsFormProps {
  initialSettingsGrouped: Record<string, SettingItem[]>;
}

export default function SettingsForm({ initialSettingsGrouped }: SettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [alertMessage, setAlertMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  
  // Flatten settings into a key-value state for easier form binding
  const getInitialFormState = () => {
    const state: Record<string, string> = {};
    Object.values(initialSettingsGrouped).forEach((groupItems) => {
      groupItems.forEach((item) => {
        state[item.key] = item.value;
      });
    });
    return state;
  };

  const [formState, setFormState] = useState<Record<string, string>>(getInitialFormState());
  const [activeTab, setActiveTab] = useState<string>(Object.keys(initialSettingsGrouped)[0] || "general");

  const triggerAlert = (text: string, type: "success" | "error") => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  const handleInputChange = (key: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    startTransition(async () => {
      try {
        const payload = Object.entries(formState).map(([key, value]) => ({
          key,
          value,
        }));
        
        const res = await updateSettingsBatch(payload);
        if (res.success) {
          triggerAlert(res.message || "Site settings updated successfully.", "success");
          router.refresh();
        } else {
          triggerAlert(res.error || "Failed to update settings.", "error");
        }
      } catch (err) {
        triggerAlert("An error occurred while saving settings.", "error");
      }
    });
  };

  // Helper to format setting label nicely
  const getSettingLabel = (key: string) => {
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getGroupIcon = (group: string) => {
    switch (group.toLowerCase()) {
      case "general":
        return <Settings className="h-4 w-4 mr-1.5" />;
      case "contact":
        return <Mail className="h-4 w-4 mr-1.5" />;
      default:
        return <Globe className="h-4 w-4 mr-1.5" />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Alert banner */}
      {alertMessage && (
        <div
          className={`fixed bottom-4 right-4 z-50 flex items-center space-x-2 px-4 py-3 rounded-2xl border shadow-lg text-sm font-semibold animate-slide-in-up ${
            alertMessage.type === "success"
              ? "bg-emerald-50 border-emerald-100 text-emerald-800"
              : "bg-red-50 border-red-100 text-red-800"
          }`}
        >
          {alertMessage.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          )}
          <span>{alertMessage.text}</span>
        </div>
      )}

      {/* Tabs list */}
      <div className="flex space-x-2 border-b border-kishtwar-cream-200 pb-2">
        {Object.keys(initialSettingsGrouped).map((groupName) => (
          <button
            key={groupName}
            type="button"
            onClick={() => setActiveTab(groupName)}
            className={`flex items-center px-4 py-2 text-xs sm:text-sm font-serif font-bold tracking-wide rounded-xl border transition-all cursor-pointer ${
              activeTab === groupName
                ? "bg-kishtwar-green-900 text-white border-kishtwar-green-950 shadow-sm"
                : "bg-white text-kishtwar-green-900 border-kishtwar-cream-250 hover:bg-kishtwar-cream/30"
            }`}
          >
            {getGroupIcon(groupName)}
            <span className="capitalize">{groupName}</span>
          </button>
        ))}
      </div>

      {/* Active Tab Panel */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-kishtwar-cream-200 p-6 shadow-sm space-y-6">
        <div className="space-y-4">
          {initialSettingsGrouped[activeTab]?.map((setting) => (
            <div key={setting.key} className="flex flex-col space-y-1.5">
              <label htmlFor={setting.key} className="text-xs font-serif font-bold text-kishtwar-green-950">
                {getSettingLabel(setting.key)}
              </label>
              
              {setting.key.includes("description") || setting.key.includes("address") ? (
                <textarea
                  id={setting.key}
                  value={formState[setting.key] || ""}
                  onChange={(e) => handleInputChange(setting.key, e.target.value)}
                  className="text-sm bg-white/70 border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl px-4 py-2.5 min-h-[100px] text-gray-750 transition-all focus:ring-1 focus:ring-kishtwar-green-900"
                  placeholder={`Enter ${getSettingLabel(setting.key).toLowerCase()}...`}
                />
              ) : (
                <div className="relative flex items-center">
                  {setting.key.includes("email") && (
                    <Mail className="absolute left-3.5 h-4 w-4 text-gray-400" />
                  )}
                  {setting.key.includes("phone") && (
                    <Phone className="absolute left-3.5 h-4 w-4 text-gray-400" />
                  )}
                  <input
                    id={setting.key}
                    type="text"
                    value={formState[setting.key] || ""}
                    onChange={(e) => handleInputChange(setting.key, e.target.value)}
                    className={`text-sm bg-white/70 border border-kishtwar-cream-200 focus:border-kishtwar-green-900 outline-none rounded-xl w-full py-2.5 text-gray-750 transition-all focus:ring-1 focus:ring-kishtwar-green-900 ${
                      setting.key.includes("email") || setting.key.includes("phone") ? "pl-10 pr-4" : "px-4"
                    }`}
                    placeholder={`Enter ${getSettingLabel(setting.key).toLowerCase()}...`}
                  />
                </div>
              )}
              <span className="text-[10px] text-gray-400">
                Setting Key: <code className="bg-kishtwar-cream/50 px-1 py-0.5 rounded text-[9px] font-mono font-bold text-kishtwar-green-900">{setting.key}</code>
              </span>
            </div>
          ))}
        </div>

        {/* Submit Section */}
        <div className="flex justify-end pt-4 border-t border-kishtwar-cream-200">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center space-x-2 px-5 py-2.5 bg-kishtwar-green-900 hover:bg-kishtwar-green-950 disabled:bg-kishtwar-green-800/80 text-white font-serif font-bold text-sm tracking-wide rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-kishtwar-gold" />
                <span>Saving Settings...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 text-kishtwar-gold shrink-0" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
