import { useEffect, useState } from "react";
import { getResources } from "../services/api";
import type { Resource } from "../types/resource";
import AddResource from "./AddResourceForm";

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    getResources()
      .then((data) => {
        setResources(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading && resources.length === 0) return <p>Loading resources...</p>;
  if (error) return <p>Error: {error}</p>;

  // Group resources by difficulty_level
  const groupedResources: Record<number, Resource[]> = {};
  resources.forEach((r) => {
    const level = r.difficulty_level ?? 1; 
    if (!groupedResources[level]) groupedResources[level] = [];
    groupedResources[level].push(r);
  });

  return (
    <div className="resources-page">
      <h1>Aquatic Resources</h1>

      <AddResource onSuccess={loadData} />

      {Object.keys(groupedResources)
        .sort((a, b) => Number(a) - Number(b))
        .map((level) => (
          <details key={level} className="resource-level-group">
            <summary>Level {level} Resources</summary>
            <ul className="resources-list">
              {groupedResources[Number(level)].map((r) => (
                <li key={r.id} className="resource-item">
                  <h2 className="resource-title">{r.title}</h2>
                  {r.resource_type && (
                    <p className="resource-type">Type: {r.resource_type}</p>
                  )}
                  {r.description && (
                    <p className="resource-description">{r.description}</p>
                  )}
                  {r.url && (
                    <a
                      className="resource-link"
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Resource
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </details>
        ))}
    </div>
  );
}