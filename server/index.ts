import express from "express";
import { analyzeUrl } from "../src/analyzeUrl";

const app = express();
const port = 3001;

app.use(express.json());

app.post("/api/analyze", (request, response) => {
  const { url } = request.body ?? {};

  if (typeof url !== "string" || url.trim().length === 0) {
    return response.status(400).json({
      error: "Please provide a URL to analyze.",
    });
  }

  return response.json(analyzeUrl(url));
});

app.listen(port, () => {
  console.log(`LinkLens API is running at http://localhost:${port}`);
});
