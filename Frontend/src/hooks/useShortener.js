import { useState } from "react";
import { shortenUrl } from "../services/api";

export function useShortener() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const shorten = async (longUrl, customSlug) => {
    setLoading(true);
    setError(null);
    try {
      const data = await shortenUrl(longUrl, customSlug);
      setResult(data);
      return data;
    } catch (err) {
      setError(err.message);
      setResult(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { shorten, reset, result, loading, error };
}
