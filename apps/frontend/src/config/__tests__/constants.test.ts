import { API_BASE_URL, API_ENDPOINTS } from "../constants";

describe("constants", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("API_BASE_URL", () => {
    it("should use default URL when env var is not set", () => {
      expect(API_BASE_URL).toBe("http://localhost:4000");
    });
  });

  describe("API_ENDPOINTS", () => {
    it("should have generate report endpoint", () => {
      expect(API_ENDPOINTS.GENERATE_REPORT).toContain("/api/reports/generate");
    });

    it("should have export PDF endpoint", () => {
      expect(API_ENDPOINTS.EXPORT_PDF).toContain("/api/reports/export/pdf");
    });

    it("should have health endpoint", () => {
      expect(API_ENDPOINTS.HEALTH).toContain("/api/health");
    });

    it("should use base URL in all endpoints", () => {
      Object.values(API_ENDPOINTS).forEach((endpoint) => {
        expect(endpoint).toContain(API_BASE_URL);
      });
    });
  });
});
