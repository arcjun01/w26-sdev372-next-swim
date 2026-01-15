export interface Resource {
  id: number;
  title: string;
  resource_type: string | null;
  difficulty_level: number | null;
  description: string | null;
  url: string | null;
  created_at: string;
}
