import { analyzeUrl } from "../src/analyzeUrl";

type ApiRequest = {
  method?: string;
  body?: { url?: unknown };
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (data: unknown) => void;
};

export default function handler(request: ApiRequest, response: ApiResponse) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Use POST to analyze a URL." });
  }

  const url = request.body?.url;

  if (typeof url !== "string" || url.trim().length === 0) {
    return response
      .status(400)
      .json({ error: "Please provide a URL to analyze." });
  }

  return response.status(200).json(analyzeUrl(url));
}
