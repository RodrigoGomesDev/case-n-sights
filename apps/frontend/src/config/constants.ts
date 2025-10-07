export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const API_ENDPOINTS = {
  GENERATE_REPORT: `${API_BASE_URL}/api/reports/generate`,
  EXPORT_PDF: `${API_BASE_URL}/api/reports/export/pdf`,
  HEALTH: `${API_BASE_URL}/api/health`,
} as const;
