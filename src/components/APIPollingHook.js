import { useState, useEffect, useRef } from "react";

export const usePolling = (fetchFunction, interval) => {
  const [data, setData] = useState(null);
  const intervalRef = useRef(null);
  const isPollingRef = useRef(true); // Ref to manage polling state

  const startPolling = () => {
    intervalRef.current = setInterval(async () => {
      const result = await fetchFunction();
      if (result !== null && result !== undefined) {
        setData(result);
      }
    }, interval);
  };

  useEffect(() => {
    const fetchDataUntilSuccess = async () => {
      while (isPollingRef.current) {
        const result = await fetchFunction();
        if (result !== null && result !== undefined) {
          setData(result);
          startPolling(); // Start the regular polling interval
          isPollingRef.current = false; // Stop the retry loop
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Retry every second
      }
    };

    fetchDataUntilSuccess();

    return () => {
      isPollingRef.current = false; // Clean up on unmount
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchFunction, interval]);

  return data;
};
