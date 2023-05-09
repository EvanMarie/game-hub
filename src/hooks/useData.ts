import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { AxiosRequestConfig, CanceledError } from "axios";

interface GetResponse<T> {
    count: number;
    results: T[];
}

const useData = <T>(endpoint: string, requestConfig?: AxiosRequestConfig, deps?: any[]) => {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    apiClient
      .get<GetResponse<T>>(endpoint, { signal: controller.signal, ...requestConfig })
      .then((response) => {
        setData(response.data.results);
        setLoading(false);
      })

      .catch((error) => {
        if (error instanceof CanceledError) return;
        setError(error.message)
        setLoading(false);
      })

    // cleanup function:
    return () => controller.abort();
  }, deps ? [...deps] : []);
  return { data, error, isLoading };
};

export default useData;