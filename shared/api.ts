/**
 * Types shared by the Express API (server/) and the React client (src/).
 * One definition, so the request and response shapes cannot drift apart.
 */

export type DocType = 'ordin' | 'circulara' | 'ghid' | 'regulament' | 'plan';
export type DocCategory = 'bac' | 'curriculum' | 'evaluare' | 'management' | 'incluziune';
export type InstitutionType = 'liceu' | 'gimnaziu' | 'scoala';

export const PAGE_SIZE_DEFAULT = 12;
export const PAGE_SIZE_MAX = 50;
export const SEARCH_LIMIT_DEFAULT = 20;

export interface InstitutionSummary {
  id: number;
  name: string;
  type: InstitutionType;
  raionId: string;
  locality: string;
  documentCount: number;
}

export interface InstitutionRef {
  id: number;
  name: string;
  locality: string;
}

export interface DocumentItem {
  id: number;
  title: string;
  type: DocType;
  category: DocCategory;
  number: string | null;
  /** ISO date, YYYY-MM-DD. */
  publishedAt: string;
  pages: number;
  sizeKb: number;
  fileUrl: string;
}

export interface Paginated<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface InstitutionSearchResponse {
  data: InstitutionSummary[];
}

export interface InstitutionDocumentsResponse extends Paginated<DocumentItem> {
  institution: InstitutionRef;
}
