import useHttp from "./useHttp";

const fetchData = (endpoint) => useHttp.get(`/${endpoint}`);

export default { fetchData };
