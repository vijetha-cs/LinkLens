type ApiRequest = {
  method?: string;
  body?: { url?: unknown };
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (data: unknown) => void;
};

type Signal = {
  name: string;
  description: string;
  level: "low" | "medium" | "high";
};

function analyzeUrl(input: string) {
  const signals: Signal[] = [];
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(input.trim());
  } catch {
    return {
      verdict: "high",
      title: "This does not look like a complete URL",
      summary:
        "Check that the address is copied correctly before relying on it.",
      host: "Could not read the website address",
      signals: [
        {
          name: "Unrecognized format",
          description: "The text could not be parsed as a web address.",
          level: "high",
        },
      ],
      nextSteps: [
        "Do not open the address yet.",
        "Check for missing punctuation or spaces.",
        "Visit the organization’s official website directly.",
      ],
    };
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    signals.push({
      name: "Unexpected link type",
      description:
        "This address does not use the usual HTTP or HTTPS web protocol.",
      level: "high",
    });
  }

  if (parsedUrl.protocol === "http:") {
    signals.push({
      name: "No HTTPS",
      description:
        "The address uses HTTP, so the connection is not encrypted in the usual way.",
      level: "medium",
    });
  }

  if (parsedUrl.username || parsedUrl.password) {
    signals.push({
      name: "Extra text before the website name",
      description:
        "The address contains sign-in information before the host, which can make the destination misleading.",
      level: "high",
    });
  }

  const hostname = parsedUrl.hostname.toLowerCase();

  if (hostname.startsWith("xn--") || hostname.includes(".xn--")) {
    signals.push({
      name: "Internationalized domain",
      description:
        "Some domain names use look-alike characters that may be difficult to distinguish.",
      level: "medium",
    });
  }

  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
    signals.push({
      name: "Numeric website address",
      description:
        "This link uses a numeric IP address instead of a familiar domain name.",
      level: "medium",
    });
  }

  if (input.length > 120) {
    signals.push({
      name: "Unusually long address",
      description:
        "Long links can hide the part of the address that identifies the website.",
      level: "medium",
    });
  }

  if (signals.length === 0) {
    signals.push({
      name: "No basic warning signs found",
      description:
        "These checks found no common warning signs. That does not prove the link is safe.",
      level: "low",
    });
  }

  const hasHighSignal = signals.some((signal) => signal.level === "high");
  const hasMediumSignal = signals.some((signal) => signal.level === "medium");
  const verdict = hasHighSignal ? "high" : hasMediumSignal ? "caution" : "low";

  return {
    verdict,
    title:
      verdict === "high"
        ? "Pause before opening this link"
        : verdict === "caution"
          ? "Check this link carefully"
          : "No basic warning signs found",
    summary:
      verdict === "low"
        ? "The basic checks found no common warning signs. This is not a guarantee that the website is safe."
        : "This address has one or more patterns worth checking before you continue.",
    host: hostname,
    signals,
    nextSteps: [
      "Check the website name carefully for misspellings or extra words.",
      "Do not enter a password or payment details from an unexpected message.",
      "When in doubt, visit the organization’s official website directly.",
    ],
  };
}

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
