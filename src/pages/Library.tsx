import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listAssetsByOwner } from "@/api/assets";
import { useOwnerId } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type SortDir = "ASC" | "DESC";

export default function Library() {
  const ownerId = useOwnerId();
  const qc = useQueryClient();
  const online = typeof navigator !== "undefined" ? navigator.onLine : true;

  const { data, isPending, isError, isFetching } = useQuery({
    queryKey: ["assets", ownerId, { page: 0, size: 50, sortDir: "DESC" as SortDir }],
    queryFn: () => listAssetsByOwner(ownerId, { page: 0, size: 50, sortDir: "DESC" }),
    enabled: !!ownerId,
    retry: false,
    networkMode: "offlineFirst",
  });

  const assets = data?.assets ?? [];
  const total = data?.totalCount ?? 0;

  return (
    <div className="grid gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Library</h1>
        <div className="flex items-center gap-2">
          {isFetching && <span className="text-xs text-muted-foreground">Refreshing…</span>}
          <Button
            variant="outline"
            size="sm"
            onClick={() => qc.invalidateQueries({ queryKey: ["assets", ownerId] })}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Banners */}
      {!online && (
        <div className="rounded-lg border border-yellow-700/40 bg-yellow-900/20 p-3 text-sm text-yellow-200">
          Tryb offline — brak połączenia. Pokażę ostatnio zbuforowane dane, jeśli są.
        </div>
      )}
      {isError && online && (
        <div className="rounded-lg border border-red-700/40 bg-red-900/20 p-3 text-sm text-red-200">
          Błąd połączenia z serwerem. Spróbuj ponownie.
        </div>
      )}

      {/* Loading skeleton */}
      {isPending && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border p-3 animate-pulse">
              <div className="h-5 w-40 bg-muted rounded mb-3" />
              <div className="w-full aspect-square bg-muted rounded-lg" />
              <div className="h-4 w-24 bg-muted rounded mt-3" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isPending && !isError && assets.length === 0 && (
        <div className="rounded-xl border p-6 text-sm text-muted-foreground">
          Brak danych do wyświetlenia. Dodaj najpierw zdjęcia w wybranej sesji.
        </div>
      )}

      {/* Grid z kartami */}
      {assets.length > 0 && (
        <>
          <div className="text-sm text-muted-foreground">{total} plików</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {assets.map((a) => (
              <Card key={a.assetPublicId} className="border-border/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span className="truncate max-w-[70%]">{a.assetPublicId}</span>
                    <Badge className="bg-blue-900/20 text-grey-200 border-blue-700/40">
                      {a.assetType}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {/* Miniatura — placeholder, dopóki backend nie zwraca thumbUrl w AssetsResponse */}
                  <div className="mt-1 w-full aspect-square bg-muted rounded-xl grid place-items-center text-xs">
                    thumbnail TBD
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs">{new Date(a.createdAt).toLocaleString()}</span>
                    <Badge className="bg-green-900/20 text-grey-200 border-green-700/40">
                      {a.assetStatus}
                    </Badge>
                  </div>

                  {/* Lokalizacja (jeśli jest) */}
                  {a.geoLocation?.lat && a.geoLocation?.lng && (
                    <div className="mt-2 text-xs">
                      {a.geoLocation.lat}, {a.geoLocation.lng}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
