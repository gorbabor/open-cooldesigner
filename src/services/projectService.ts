import type { Artifact, Project, ProjectVersion } from "@/types";
import { nowIso, uid } from "@/lib/utils";

export interface ProjectArchive {
  project: Project;
  artifact: Artifact;
  versions: ProjectVersion[];
  exportedAt: string;
}

export function createSnapshot(
  project: Project,
  artifact: Artifact,
  label: string,
): ProjectVersion {
  return {
    id: uid("ver"),
    projectId: project.id,
    artifact: structuredClone(artifact),
    label,
    createdAt: nowIso(),
  };
}

export function exportProjectArchive(input: {
  project: Project;
  artifact: Artifact;
  versions: ProjectVersion[];
}): ProjectArchive {
  return {
    project: structuredClone(input.project),
    artifact: structuredClone(input.artifact),
    versions: structuredClone(input.versions),
    exportedAt: nowIso(),
  };
}

export function serializeArchive(archive: ProjectArchive): string {
  return JSON.stringify(archive, null, 2);
}
