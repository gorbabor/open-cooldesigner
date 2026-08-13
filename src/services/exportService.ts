import type { Artifact } from "@/types";
import JSZip from "jszip";

export interface ExportResult {
  fileName: string;
  mimeType: string;
  blob: Blob;
  sizeBytes: number;
}

export function buildHtmlExport(artifact: Artifact): ExportResult {
  const main = artifact.files.find((f) => f.path === "index.html") ?? artifact.files[0];
  return {
    fileName: `${safeName(artifact.title)}.html`,
    mimeType: "text/html",
    blob: new Blob([main.content], { type: "text/html;charset=utf-8" }),
    sizeBytes: new Blob([main.content]).size,
  };
}

export function buildZipExportFileName(title: string): string {
  return `${safeName(title)}.zip`;
}

export async function buildZipExport(artifact: Artifact): Promise<ExportResult> {
  const zip = new JSZip();
  const root = zip.folder(safeName(artifact.title)) ?? zip;
  for (const file of artifact.files) {
    root.file(file.path, file.content);
  }
  const blob = await zip.generateAsync({ type: "blob" });
  return {
    fileName: buildZipExportFileName(artifact.title),
    mimeType: "application/zip",
    blob,
    sizeBytes: blob.size,
  };
}

export function downloadBlob(result: ExportResult): void {
  const url = URL.createObjectURL(result.blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = result.fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function safeName(title: string): string {
  const cleaned = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_ ]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
  return cleaned || "artifact";
}
