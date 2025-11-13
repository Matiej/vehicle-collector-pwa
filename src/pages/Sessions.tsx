import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createSession, listSessions } from "@/api/sessions";
import { ownerId } from "@/lib/api";
import { Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export default function Sessions() {
  const navigate = useNavigate();
  const statusColors: Record<string, string> = {
    CREATED: "bg-green-400/20",
    OPEN: "bg-blue-400/30  ",
    CLOSED: "bg-orange-400/30",
    ERROR: "bg-red-400/30  ",
  };
  const qc = useQueryClient();
  const [sessionName, setSessionName] = useState("");
  const { data, isLoading, error } = useQuery({
    queryKey: ["sessions", ownerId()],
    queryFn: () => listSessions(ownerId()),
  });

  function formatTimestamp() {
    const now = new Date();

    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");

    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}_${hh}:${min}:${ss}`;
  }

  const saveSessionName: string =
    sessionName.trim() || `${formatTimestamp()}_My session`;

  const create = useMutation({
    mutationFn: () =>
      createSession({
        ownerId: ownerId(),
        mode: "BULK",
        device: navigator.userAgent + "_" + navigator.platform || "unknown",
        sessionName: saveSessionName,
      }),
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: ["sessions", ownerId()] });
      toast.success("Session created");
      if (created?.sessionPublicId) {
        navigate(`/sessions/${created.sessionPublicId}`);
      }
    },
    onError: () => toast.error("Failed to create session"),
  });

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Error</p>;

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Sessions</h1>
        {/* <Button disabled={create.isPending} onClick={() => create.mutate()}>
          + Create BULK session
        </Button> */}
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Session name (optional)"
            maxLength={100}
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            className="w-48"
          />
          {sessionName.length > 100 && (
            <p className="text-xs text-red-400">Maximum 100 characters</p>
          )}
          <Button
            disabled={create.isPending || sessionName.length > 100}
            onClick={() => create.mutate()}
          >
            + Create BULK session
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((s) => (
          <Card key={s.sessionPublicId} className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <Link
                  to={`/sessions/${s.sessionPublicId}`}
                  className="hover:underline"
                >
                  {s.sessionName || s.sessionPublicId}
                </Link>
                <Badge>{s.sessionMode}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-zinc-400">
              <div>
                {" "}
                Status:{" "}
                <span className={statusColors[s.sessionStatus] || ""}>
                  {s.sessionStatus}
                </span>
              </div>
              <div>{new Date(s.createdAt).toLocaleString()}</div>
              <div>Assets: {s.assetsCount}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
