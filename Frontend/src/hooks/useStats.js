import { useCallback, useEffect, useState } from "react";
import { fetchRecentLinks } from "../services/api";

export function useStats() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetchRecentLinks()
      .then((data) => {
        if (cancelled) return;
        setLinks(Array.isArray(data) ? data : (data?.links ?? []));
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const refresh = useCallback(() => {
    setLoading(true);
    setReloadKey((n) => n + 1);
  }, []);

  return { links, loading, error, refresh };
}
