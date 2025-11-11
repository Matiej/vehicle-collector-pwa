import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createSession, listSessions } from "@/api/sessions";
import { ownerId } from "@/lib/api";
import { Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function Sessions() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["sessions", ownerId()],
    queryFn: () => listSessions(ownerId()),
  });

  const create = useMutation({
    mutationFn: () => createSession({ ownerId: ownerId(), mode: "BULK", device: "iphone" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sessions", ownerId()] });
      toast.success("Session created");
    },
    onError: () => toast.error("Failed to create session"),
  });

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Error</p>;

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Sessionss</h1>
        <Button disabled={create.isPending} onClick={() => create.mutate()}>
          + Create BULK session
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((s) => (
          <Card key={s.sessionId} className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <Link to={`/sessions/${s.sessionId}`} className="hover:underline">
                  {s.sessionId}
                </Link>
                <Badge>{s.sessionMode}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-zinc-400">
              <div> Status: <span className="text-zinc-200">{s.sessionStatus}</span></div>
              <div>{new Date(s.createdAt).toLocaleString()}</div>
              <div>Assets: {s.assetsCount}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}