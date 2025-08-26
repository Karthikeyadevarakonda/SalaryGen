import { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

export default function useApi(baseUrl) {
  const {token} = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const cancelSourceRef = useRef(null);


  const request = useCallback(
    async (method, endpoint = "", payload = null, config = null) => {
     
      if (cancelSourceRef.current) {
        cancelSourceRef.current.cancel("Request canceled due to a new request.");
      }

      const source = axios.CancelToken.source();
      cancelSourceRef.current = source;

      const headers = token
  ? { Authorization: `Bearer ${token}` }
  : {};
      setLoading(true);
      setError(null);

      try {
        const res = await axios({
          method,
          url: `${baseUrl}${endpoint}`,
          data: payload,
          cancelToken: source.token,
          headers: {
            ...headers
          },
          ...config,
        });
        setData(res.data);
        return res.data;
      } catch (err) {
        if (axios.isCancel(err)) {
          console.warn("Request canceled:", err.message);
        } else {
          console.error(`ERROR IN ${method.toUpperCase()} REQUEST TO ${baseUrl}${endpoint}`, err);
          setError(err.response?.data?.message || err.message);
          throw err;
        }
      } finally {
        setLoading(false);
      }
    },
    [baseUrl,token]
  );

  const get = useCallback((endpoint = "", config) => request("get", endpoint, null, config), [request]);
  const post = useCallback((endpoint = "", payload, config) => request("post", endpoint, payload, config), [request]);
  const put = useCallback((endpoint = "", payload, config) => request("put", endpoint, payload, config), [request]);
  const del = useCallback((endpoint = "", config) => request("delete", endpoint, null, config), [request]);

  useEffect(() => {
    return () => {
      if (cancelSourceRef.current) {
        cancelSourceRef.current.cancel("Component unmounted.");
      }
    };
  }, []);

  return { data, loading, error, get, post, put, del };
}
