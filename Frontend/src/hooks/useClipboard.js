import { useCallback, useState } from "react";

export function useClipboard(resetAfter = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), resetAfter);
        return true;
      } catch {
        setCopied(false);
        return false;
      }
    },
    [resetAfter]
  );

  return { copied, copy };
}
