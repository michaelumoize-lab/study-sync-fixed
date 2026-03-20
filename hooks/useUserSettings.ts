import { useState, useEffect } from "react";

interface UserSettings {
  theme: string;
  defaultView: string;
  editorFont: string;
  autoSaveInterval: number;
}

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings>({
    theme: "system",
    defaultView: "vault",
    editorFont: "outfit",
    autoSaveInterval: 30,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch(() => {}) // keep defaults on failure
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading };
}
