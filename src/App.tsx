import { useState } from "react";
import { useAppStore, useActiveArtifact, useActiveProject } from "@/store/appStore";
import ProjectSidebar from "@/ui/ProjectSidebar";
import ChatPanel from "@/ui/ChatPanel";
import CanvasPanel from "@/ui/CanvasPanel";
import SettingsDialog from "@/ui/SettingsDialog";
import AiUsageFooter from "@/ui/AiUsageFooter";
import { Settings } from "lucide-react";
import { cn } from "@/lib/cn";

export default function App() {
  const projects = useAppStore((s) => s.projects);
  const activeProject = useActiveProject();
  const activeArtifact = useActiveArtifact();
  const createProject = useAppStore((s) => s.createProject);
  const generating = useAppStore((s) => s.generating);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-12 shrink-0 items-center justify-between border-b bg-card px-4">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-primary text-xs font-bold text-primary-foreground">
            OC
          </span>
          <span className="font-semibold tracking-tight">Open-Cooldesigner</span>
          {activeProject && (
            <span className="ml-2 rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {activeProject.name}
            </span>
          )}
        </div>
        <button
          onClick={() => setSettingsOpen(true)}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          title="Paramètres IA"
        >
          <Settings size={16} />
          Paramètres
        </button>
      </header>

      <main className={cn("flex min-h-0 flex-1", !activeProject && "items-center justify-center")}>
        {!activeProject ? (
          <ProjectSidebar
            projects={projects}
            onCreate={createProject}
            empty
          />
        ) : (
          <>
            <ProjectSidebar
              projects={projects}
              onCreate={createProject}
              empty={false}
            />
            <CanvasPanel artifact={activeArtifact} generating={generating} />
            <ChatPanel />
          </>
        )}
      </main>

      <AiUsageFooter />
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
