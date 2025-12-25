
export interface ArticleReference {
  title: string;
  authors: string;
  year: string;
  journal: string;
  doi: string;
  url: string;
  summary: string;
  citationABNT: string;
  citationAPA: string;
}

export interface GroundingSource {
  title?: string;
  uri?: string;
}

export interface ResearchResponse {
  content: string;
  sources: GroundingSource[];
}

export type ItemType = 'search' | 'methodology' | 'formatter' | 'fichamento' | 'advisor' | 'project';

export interface SavedItem {
  id: string;
  type: ItemType;
  title: string;
  content: string;
  date: string;
  metadata?: any;
}

export type AppView = 'search' | 'methodology' | 'formatter' | 'fichamento' | 'library' | 'about' | 'advisor' | 'project';
