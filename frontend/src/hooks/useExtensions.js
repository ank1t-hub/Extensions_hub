import { useState, useCallback } from "react";
import * as service from "../services/extensionService.js";

export default function useExtensions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getExtensionDetails = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      return await service.getExtension(id);
    } catch (err) {
      setError(err.message || "Failed to fetch extension.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getExtensionDetails,
  };
}
