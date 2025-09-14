import { useEffect, useState } from "react";
import api, { get, post } from "@/utils/ApiClient";

interface ApiState<T> {
  response: T | null;
  loading: boolean;
  error: string | null;
}

export const useGet = <ResponseType,>(
  url: string,
  config: Record<string, any> = {},
  onSuccess?: (data: ResponseType) => void,
  onFail?: () => void
) => {
  const [state, setState] = useState<ApiState<ResponseType>>({
    response: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        const response = await get(url, config);
        if (isMounted) {
          setState({ response: response.data, loading: false, error: null });
          if (onSuccess) {
            onSuccess(response.data);
          }
        }
      } catch (error) {
        if (isMounted) {
          setState({
            response: null,
            loading: false,
            error: (error as Error).message,
          });
          if (onFail) {
            onFail();
          }
        }
      }
    };
    fetchData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, JSON.stringify(config)]);
  return state;
};

export const usePost = <ResponseType, ResponseBodyType = unknown>(
  url: string,
  config: Record<string, any> = {},
  onSuccess?: (data: ResponseType) => void,
  onFail?: () => void
) => {
  const [state, setState] = useState<ApiState<ResponseType>>({
    data: null,
    loading: false,
    error: null,
  });

  const postData = async (body: ResponseBodyType) => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const response = await post(url, body, config);
      setState({ data: response.data, loading: false, error: null });
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: (err as Error).message,
      });
      if (onFail) {
        onFail();
      }
      throw err;
    }
  };

  return { ...state, postData };
};
