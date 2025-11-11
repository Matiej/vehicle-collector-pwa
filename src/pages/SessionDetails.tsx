// import { useParams } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { closeSession, getSession } from "../api/sessions";
// import { ownerId } from "../lib/api";
// import Uploader from "../ui/Uploader";

// export default function SessionDetails() {
//   const { id = "" } = useParams();
//   const qc = useQueryClient();
//   const { data, isLoading } = useQuery({
//     queryKey: ["session", id],
//     queryFn: () => getSession(id),
//   });

//   const close = useMutation({
//     mutationFn: () => closeSession(id, "CLOSED"),
//     onSuccess: () => qc.invalidateQueries({ queryKey: ["session", id] }),
//   });

//   if (isLoading || !data) return <p>Loading…</p>;

//   return (
//     <div>
//       <h1>Session {data.sessionId}</h1>
//       <p>
//         Status: <b>{data.status}</b>
//       </p>
//       <Uploader sessionId={data.sessionId} ownerId={ownerId()} />

//       <button
//         disabled={close.isPending}
//         onClick={() => close.mutate()}
//         style={{ marginTop: 12 }}
//       >
//         Close session
//       </button>

//       <h3>Assets</h3>
//       <ul>
//         {data.assets?.map((a) => (
//           <li key={a.id}>
//             {a.id} • {a.type} • {a.status}
//             {a.thumbnailUrl ? (
//               <img
//                 src={a.thumbnailUrl}
//                 style={{
//                   width: 80,
//                   height: 80,
//                   objectFit: "cover",
//                   marginLeft: 8,
//                 }}
//               />
//             ) : null}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { closeSession, getSession } from "@/api/sessions";
import { ownerId } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import Uploader from "@/ui/Uploader";

export default function SessionDetails() {
  const statusColors: Record<string, string> = {
    CREATED: "bg-green-700/30 text-grey-200 border-green-700/40",
    OPEN: "bg-blue-700/30 text-grey-200 border-blue-700/40",
    CLOSED: "bg-orange-700/30 text-grey-200 border-orange-700/40",
    ERROR: "bg-red-700/30 text-grey-200 border-red-700/40",
  };
  const { id = "" } = useParams();
  const qc = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["session", id],
    queryFn: () => getSession(id),
    enabled: !!id,
  });

  const close = useMutation({
    mutationFn: () => closeSession(id, "CLOSED"),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["session", id] });
      toast.success("Session closed");
    },
    onError: () => toast.error("Failed to close session"),
  });

  if (isLoading) return <p>Loading…</p>;
  if (error || !data) return <p>Error</p>;

  return (
    <div className="grid gap-6">
      {/* Nagłówek sesji */}
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link to="/sessions">← Back to sessions</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="truncate">Session {data.sessionId}</span>
            <Badge className={statusColors[data.status] || ""}>
              {data.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <div>
            Owner: <span className="text-foreground">{data.ownerId}</span>
          </div>
          <div>
            Mode: <span className="text-foreground">{data.mode}</span>
          </div>
        </CardContent>
      </Card>

      {/* Upload plików */}
      <Card>
        <CardHeader>
          <CardTitle>Upload assets</CardTitle>
        </CardHeader>
        <CardContent>
          <Uploader sessionId={data.sessionId} ownerId={ownerId()} />
          <Separator className="my-4" />
          <Button
            disabled={close.isPending || data.status === "CLOSED"}
            onClick={() => close.mutate()}
          >
            Close session
          </Button>
        </CardContent>
      </Card>

      {/* Lista assetów */}
      <Card>
        <CardHeader>
          <CardTitle>Assets</CardTitle>
        </CardHeader>
        <CardContent>
          {data.assets?.length ? (
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.assets.map((a) => (
                <li key={a.id} className="rounded-xl border p-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{a.type}</span>
                    <Badge variant="secondary">{a.status}</Badge>
                  </div>
                  {a.thumbnailUrl ? (
                    <img
                      src={a.thumbnailUrl}
                      className="mt-2 w-full aspect-square object-cover rounded-lg"
                      alt=""
                    />
                  ) : (
                    <div className="mt-2 w-full aspect-square bg-muted rounded-lg grid place-items-center text-xs text-muted-foreground">
                      thumbnail TBD
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-muted-foreground">No assets yet.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
