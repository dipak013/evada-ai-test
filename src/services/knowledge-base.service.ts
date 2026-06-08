import { api } from "@/lib/axios";
import { SCAN_ROUTES } from "@/config/api-routes";

export interface KnowledgeBaseEntry {
  id: number;
  cve: string;
  cwe: string | null;
  title: string | null;
  description: string | null;
  cvss_score: number | null;
  severity: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface KnowledgeBasePagination {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface KnowledgeBaseResponse {
  success: boolean;
  data: KnowledgeBaseEntry[];
  pagination: KnowledgeBasePagination;
}

export interface KnowledgeBaseParams {
  page?: number;
  page_size?: number;
  search?: string;
}

export const KnowledgeBaseService = {
  async list(params: KnowledgeBaseParams = {}): Promise<KnowledgeBaseResponse> {
    const res = await api.post<KnowledgeBaseResponse>(SCAN_ROUTES.aiScannerKnowledgeBase, {
      page: params.page ?? 1,
      page_size: params.page_size ?? 30,
      ...(params.search ? { search: params.search } : {}),
    });
    return res.data;
  },
};
