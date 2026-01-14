import { useEffect, useState } from "react";
import { getProjectsByCategory } from "../services/projectService";

const useCategoryProjects = (categoryKey) => {
  const [projects, setProjects] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [activeSub, setActiveSub] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const data = await getProjectsByCategory(categoryKey);

      setProjects(data);

      const subs = [
        { id: "all", title: "همه" },
        ...Array.from(
          new Map(
            data
              .filter((p) => p.SubCategory)
              .map((p) => [p.SubCategory.id, p.SubCategory])
          ).values()
        ),
      ];

      setSubCategories(subs);
      setLoading(false);
    };

    loadData();
  }, [categoryKey]);

  const filteredProjects =
    activeSub === "all"
      ? projects
      : projects.filter((p) => p.SubCategory?.id === activeSub);

  return {
    loading,
    projects: filteredProjects,
    subCategories,
    activeSub,
    setActiveSub,
  };
};

export default useCategoryProjects;
