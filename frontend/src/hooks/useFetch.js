import { useEffect, useState } from "react";
import dataService from "@/services/dataService";

export default function useFetch(endpoint) {
  const [data, setData] = useState([]);

  useEffect(() => {
    dataService.fetchData(endpoint).then((res) => {
      const result = 
      res.data?.products ||
      res.data?.vehicleTypes ||
      res.data?.implementsList ||
      res.data?.brands ||
      res.data?.models ||
      res.data?.years ||
      [];
      setData(result);
    });
  }, [endpoint]);

  return { data };
}
