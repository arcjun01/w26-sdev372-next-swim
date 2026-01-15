import {useEffect, useState} from "react";
import {getResources} from "../services/api";
import {Resource} from "../types/resource";

export default function Resources() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        getResources().then((data: Resource[]) => {
            setResources(data);
            setLoading(false);
        })
        .catch(error => {
            setError(error.message);
            setLoading(false);
        });
    },[]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;


    //return
    return (
    <div>
      <h1>Aquatic Resources</h1>
      <ul>
        {resources.map((resource: Resource) => (
          <li key={resource.id}>
            <strong>{resource.title}</strong>{" "}
            {resource.difficulty_level && (
              <>— Level {resource.difficulty_level}</>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
