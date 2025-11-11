import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { xhrUpload } from "@/lib/xhrUpload";
import { toast } from "sonner";

type Row = {
  file: File;
  progress: number;
  status: "queued" | "uploading" | "done" | "error";
};

export default function Uploader({
  sessionId,
  ownerId,
}: {
  sessionId: string;
  ownerId: string;
}) {
  const [rows, setRows] = useState<Row[]>([]);

  const onDrop = useCallback((accepted: File[]) => {
    const add = accepted.map((f) => ({
      file: f,
      progress: 0,
      status: "queued" as const,
    }));
    setRows((prev) => [...prev, ...add]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  async function start() {
    const snapshot = [...rows];

    for (const [i, item] of snapshot.entries()) {
      if (item.status !== "queued") continue;
      setRows((prev) =>
        prev.map((r, idx) =>
          idx === i ? { ...r, status: "uploading", progress: 0 } : r
        )
      );

      const form = new FormData();
      form.append("file", item.file);

      const qs = new URLSearchParams({ ownerId, type: "IMAGE" }).toString();
      const url = `${
        import.meta.env.VITE_API_BASE_URL
      }/sessions/${sessionId}/assets?${qs}`;

      try {
        await xhrUpload({
          url,
          formData: form,
          onProgress: (p) =>
            setRows((prev) =>
              prev.map((r, idx) => (idx === i ? { ...r, progress: p } : r))
            ),
        });

        setRows((prev) =>
          prev.map((r, idx) =>
            idx === i ? { ...r, status: "done", progress: 100 } : r
          )
        );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        setRows((prev) =>
          prev.map((r, idx) => (idx === i ? { ...r, status: "error" } : r))
        );
        toast.error(`Upload failed: ${item.file.name}`);
      }
    }

    toast.success("Queue finished");
  }

  return (
    <div className="grid gap-3">
      <div
        {...getRootProps()}
        className={`rounded-2xl border border-dashed p-6 text-sm text-muted-foreground transition ${
          isDragActive
            ? "border-foreground/40 bg-muted/40"
            : "border-border bg-muted/30"
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <b>Drop images or click here to select</b>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={start}
          disabled={!rows.some((r) => r.status === "queued")}
        >
          Start upload
        </Button>
      </div>

      <div className="grid gap-2">
        {rows.map((r, i) => (
          <div key={i} className="rounded-xl border p-3">
            <div className="flex items-center justify-between text-sm">
              <div className="truncate max-w-[60%]">{r.file.name}</div>
              <div className="text-muted-foreground">{r.progress}%</div>
            </div>
            <Progress value={r.progress} className="mt-2 h-2" />
            <div className="mt-1 text-xs text-muted-foreground">{r.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
