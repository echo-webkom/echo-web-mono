"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { LuLogIn as LogIn, LuSettings as Settings, LuWrench as Wrench } from "react-icons/lu";

import { devtoolsLogin } from "@/actions/devtools-login";
import { Text } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/utils/cn";

const STORAGE_KEY = "devtools-settings";

type DevtoolsPosition =
  | "bottom-center"
  | "bottom-left"
  | "bottom-right"
  | "left-center"
  | "right-center"
  | "top-center";

type DevtoolsSettings = {
  position: DevtoolsPosition;
};

const DEFAULT_SETTINGS: DevtoolsSettings = {
  position: "bottom-center",
};

function parseSettings(stored: string | null): DevtoolsSettings {
  if (!stored) return DEFAULT_SETTINGS;
  try {
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(stored) as Partial<DevtoolsSettings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function subscribe(callback: () => void) {
  const handler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback();
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

function getSnapshot(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

function getServerSnapshot(): string | null {
  return null;
}

function useDevtoolsSettings() {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return parseSettings(stored);
}

function saveSettings(settings: DevtoolsSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  // Trigger re-render since useSyncExternalStore only listens to cross-tab storage events
  window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
}

const POSITION_CLASSES: Record<DevtoolsPosition, string> = {
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  "bottom-left": "bottom-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "left-center": "-left-6 top-1/2 -translate-y-1/2 -rotate-90",
  "right-center": "-right-6 top-1/2 -translate-y-1/2 rotate-90",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
};

const POSITION_LABELS: Array<{ value: DevtoolsPosition; label: string }> = [
  { value: "top-center", label: "Topp" },
  { value: "left-center", label: "Venstre" },
  { value: "bottom-center", label: "Bunn senter" },
  { value: "bottom-left", label: "Bunn venstre" },
  { value: "bottom-right", label: "Bunn høyre" },
  { value: "right-center", label: "Høyre" },
];

const PREMADE_USERS = [
  { id: "student", label: "Student", description: "student@echo.uib.no" },
  { id: "admin", label: "Webkom (admin)", description: "admin@echo.uib.no" },
  { id: "hyggkom", label: "Hyggkom", description: "hyggkom@echo.uib.no" },
] as const;

const SIDEBAR_ITEMS = [
  { id: "login", label: "Innlogging", icon: LogIn },
  { id: "settings", label: "Innstillinger", icon: Settings },
] as const;

type Panel = (typeof SIDEBAR_ITEMS)[number]["id"];

function LoginPanel() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (userId: string) => {
    setIsLoading(userId);
    setError(null);

    try {
      const result = await devtoolsLogin(userId);

      if (result.success) {
        router.push("/");
        router.refresh();
      } else {
        setError(result.error);
      }
    } catch {
      setError("En feil oppstod.");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-semibold">Innlogging</h3>
        <Text size="sm" className="text-muted-foreground">
          Logg inn som en forhåndsdefinert bruker.
        </Text>
      </div>

      <div className="flex flex-col gap-2">
        {PREMADE_USERS.map((user) => (
          <Button
            key={user.id}
            variant="outline"
            className="w-full justify-between"
            disabled={isLoading !== null}
            onClick={() => handleLogin(user.id)}
          >
            <span>{user.label}</span>
            <span className="text-muted-foreground text-xs">{user.description}</span>
          </Button>
        ))}
      </div>

      {error && (
        <Text size="sm" className="text-red-600">
          {error}
        </Text>
      )}
    </div>
  );
}

function SettingsPanel({
  settings,
  onSettingsChange,
  onHide,
}: {
  settings: DevtoolsSettings;
  onSettingsChange: (settings: DevtoolsSettings) => void;
  onHide: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-semibold">Innstillinger</h3>
        <Text size="sm" className="text-muted-foreground">
          Konfigurer devtools-knappen.
        </Text>
      </div>

      <div className="flex flex-col gap-2">
        <Text size="sm" className="font-semibold">
          Posisjon
        </Text>
        <div className="flex flex-wrap gap-2">
          {POSITION_LABELS.map((pos) => (
            <Button
              key={pos.value}
              variant={settings.position === pos.value ? "default" : "outline"}
              size="sm"
              onClick={() => onSettingsChange({ ...settings, position: pos.value })}
            >
              {pos.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Text size="sm" className="font-semibold">
          Synlighet
        </Text>
        <Button variant="outline" onClick={onHide}>
          Skjul i 10 sekunder
        </Button>
      </div>
    </div>
  );
}

export function DevtoolsLoginDialog() {
  const [open, setOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<Panel>("login");
  const settings = useDevtoolsSettings();
  const [hidden, setHidden] = useState(false);

  const handleSettingsChange = useCallback((newSettings: DevtoolsSettings) => {
    saveSettings(newSettings);
  }, []);

  const handleHide = useCallback(() => {
    setOpen(false);
    setHidden(true);
    setTimeout(() => setHidden(false), 10_000);
  }, []);

  if (hidden) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          "fixed z-50 flex cursor-pointer items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-red-700",
          POSITION_CLASSES[settings.position],
        )}
      >
        <Wrench className="h-4 w-4" />
        Devtools
      </DialogTrigger>
      <DialogContent className="max-w-5xl p-0">
        <DialogTitle className="sr-only">Devtools</DialogTitle>
        <div className="flex h-150">
          <nav className="flex w-48 flex-col gap-1 border-r p-3">
            <Text size="sm" className="mb-2 px-2 font-semibold">
              Devtools
            </Text>
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePanel(item.id)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  activePanel === item.id
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex-1 overflow-y-auto p-6">
            {activePanel === "login" && <LoginPanel />}
            {activePanel === "settings" && (
              <SettingsPanel
                settings={settings}
                onSettingsChange={handleSettingsChange}
                onHide={handleHide}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
