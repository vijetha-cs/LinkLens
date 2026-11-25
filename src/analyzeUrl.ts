export type Signal = {
  name: string;
  description: string;
  level: "low" | "medium" | "high";
};

export type Analysis = {
  verdict: "low" | "caution" | "high";
  title: string;
  summary: string;
  host: string;
  signals: Signal[];
  nextSteps: string[];
};

export function analyzeUrl(input: string): Analysis {
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
        "If it came in a message, visit the organization’s official website yourself.",
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
        "These simple checks did not find the patterns this demo looks for. That does not prove the link is safe.",
      level: "low",
    });
  }

  const highCount = signals.filter((signal) => signal.level === "high").length;
  const mediumCount = signals.filter(
    (signal) => signal.level === "medium",
  ).length;

  const verdict = highCount > 0 ? "high" : mediumCount > 0 ? "caution" : "low";

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
