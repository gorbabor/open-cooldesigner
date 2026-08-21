import Dialog from "./Dialog";

export default function PreviewDialog({
  title,
  subtitle,
  srcDoc,
  onClose,
}: {
  title: string;
  subtitle?: string;
  srcDoc: string;
  onClose: () => void;
}) {
  if (!srcDoc) return null;

  return (
    <Dialog
      title={title}
      subtitle={subtitle}
      onClose={onClose}
      ariaLabel={`Aperçu : ${title}`}
      maxWidth="max-w-[1100px]"
    >
      <iframe
        title={title}
        sandbox="allow-scripts"
        srcDoc={srcDoc}
        className="min-h-0 w-full flex-1 border-0"
      />
    </Dialog>
  );
}
