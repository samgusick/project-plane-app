import { useEffect, useState } from "react";

export const usePolling = (fetchFunction, interval) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const result = await fetchFunction();
        if (isMounted) setData(result);
      } catch (error) {
        console.error("Error during polling:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, interval);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [fetchFunction, interval]);
  
  return data;
};
