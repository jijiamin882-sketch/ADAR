// src/hooks/useAgencies.js
import { useQuery } from "react-query";
import { getAllAgencies } from "../utils/api";

const useAgencies = () => {
  const { data, isLoading, isError, refetch } = useQuery(
    "allAgencies",
    getAllAgencies,
    { refetchOnWindowFocus: false }
  );

  return { data, isError, isLoading, refetch };
};

export default useAgencies;