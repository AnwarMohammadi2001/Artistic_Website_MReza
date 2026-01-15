import axiosInstance from "../utils/axiosInstance";

export const getProjectsByCategory = async (categoryKey) => {
  const res = await axiosInstance.get("/projects");
  return res.data.filter((p) => p.Category?.slug === categoryKey);
};
