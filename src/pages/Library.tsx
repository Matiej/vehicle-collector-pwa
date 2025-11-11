import { useQuery } from "@tanstack/react-query";
import { listAssetsByOwner } from "../api/assets";
import { ownerId } from "../lib/api";
 

export default function Library() {
 
  const { data, isPending, isError, isFetching } = useQuery({
    queryKey: ["assets", ownerId()],
    queryFn: () => listAssetsByOwner(ownerId(), { page: 0, size: 50, sortDir: "DESC" }),
    retry: false,
    networkMode: "offlineFirst",
  });

  const assets = data?.assets ?? [];

  return (
    <div>
      <h1>My Library</h1>

      {!navigator.onLine && (
        <p style={{ color: "goldenrod" }}>Tryb offline – brak połączenia</p>
      )}

      {isError && navigator.onLine && (
        <p style={{ color: "tomato" }}>Błąd połączenia z serwerem</p>
      )}

      {assets.length === 0 && !isPending && !isError && (
        <p>Brak danych do wyświetlenia</p>
      )}

      {assets.length > 0 && (
        <>
          {isFetching && <p style={{ opacity: 0.6 }}>Aktualizuję…</p>}
          <ul>…</ul>
        </>
      )}
    </div>
  );
}