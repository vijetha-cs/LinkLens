import { useState, type FormEvent } from "react";

type Signal = {
  name: string;
  description: string;
  level: "low" | "medium" | "high";
};

type Analysis = {
  verdict: "low" | "caution" | "high";
  title: string;
  summary: string;
  host: string;
  signals: Signal[];
  nextSteps: string[];
};

const sampleUrl = "https://account.verify.example/sign-in";

const verdictStyles = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-950",
  caution: "border-amber-200 bg-amber-50 text-amber-950",
  high: "border-rose-200 bg-rose-50 text-rose-950",
};

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
      <path
        d="M12 2.8 19 5.6v5.8c0 4.5-2.9 8.1-7 9.8-4.1-1.7-7-5.3-7-9.8V5.6l7-2.8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<Analysis | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function analyzeUrl(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = (await response.json()) as Analysis | { message?: string };

      if (!response.ok) {
        throw new Error(
          "message" in data && data.message
            ? data.message
            : "Could not analyze that URL.",
        );
      }

      setResult(data as Analysis);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function tryExample() {
    setUrl(sampleUrl);
    setResult(null);
    setError("");
  }

  function clearForm() {
    setUrl("");
    setResult(null);
    setError("");
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-[#18233a]">
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-white px-4 py-3 font-semibold focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <a
            href="#"
            className="flex items-center gap-3"
            aria-label="LinkLens home"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#18345b] text-white">
              <ShieldIcon />
            </span>
            <span>
              <span className="block text-lg font-extrabold tracking-tight">
                LinkLens
              </span>
              <span className="block text-xs text-slate-600">
                Understand link warning signs
              </span>
            </span>
          </a>

          <nav
            aria-label="Main navigation"
            className="flex items-center gap-5 text-sm font-semibold"
          >
            <a
              className="text-slate-700 hover:text-[#1763a6]"
              href="#how-it-works"
            >
              How it works
            </a>
            <a className="text-slate-700 hover:text-[#1763a6]" href="#safety">
              Safety tips
            </a>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="mx-auto max-w-6xl px-5 pb-14 pt-12 sm:px-8 sm:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-blue-900">
              <span className="h-2 w-2 rounded-full bg-blue-600" />A link-safety
              learning tool
            </p>
            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-6xl">
              Pause before you
              <span className="text-[#1763a6]"> click.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
              Paste a link to see clues that may deserve a closer look. LinkLens
              explains each signal so you can make a more informed choice.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 sm:p-8">
            <form onSubmit={analyzeUrl}>
              <label htmlFor="url-input" className="block text-sm font-bold">
                Link to review
              </label>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <input
                  id="url-input"
                  type="text"
                  inputMode="url"
                  autoComplete="off"
                  spellCheck={false}
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="Paste a URL, such as https://example.com"
                  className="min-h-14 min-w-0 flex-1 rounded-xl border border-slate-300 px-4 text-base outline-none placeholder:text-slate-500 focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                  aria-describedby="privacy-note"
                  required
                />
                <button
                  type="submit"
                  disabled={loading || !url.trim()}
                  className="min-h-14 rounded-xl bg-[#18345b] px-6 font-bold text-white transition hover:bg-[#245184] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Reviewing…" : "Review link"}
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={tryExample}
                  className="text-sm font-bold text-[#145b97] underline decoration-blue-300 underline-offset-4 hover:text-[#0d3d69]"
                >
                  Try a safe example
                </button>
                {url && (
                  <button
                    type="button"
                    onClick={clearForm}
                    className="text-sm font-semibold text-slate-700 underline underline-offset-4 hover:text-slate-950"
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>

            <p
              id="privacy-note"
              className="mt-5 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-600"
            >
              LinkLens reviews the URL text only. It does not open the site or
              guarantee that a link is safe.
            </p>

            {error && (
              <p
                role="alert"
                className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-900"
              >
                {error}
              </p>
            )}

            {result && (
              <section
                aria-live="polite"
                aria-labelledby="result-title"
                className={`mt-7 rounded-2xl border p-5 sm:p-6 ${verdictStyles[result.verdict]}`}
              >
                <p className="text-xs font-bold uppercase tracking-[0.15em]">
                  Educational review · {result.host}
                </p>
                <h2 id="result-title" className="mt-2 text-2xl font-extrabold">
                  {result.title}
                </h2>
                <p className="mt-2 leading-6">{result.summary}</p>

                <h3 className="mt-6 font-bold">Signals we found</h3>
                <ul className="mt-3 space-y-3">
                  {result.signals.map((signal) => (
                    <li
                      key={signal.name}
                      className="rounded-xl bg-white/80 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-bold">{signal.name}</span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold capitalize text-slate-800">
                          {signal.level} signal
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-5 text-slate-700">
                        {signal.description}
                      </p>
                    </li>
                  ))}
                </ul>

                <h3 className="mt-6 font-bold">What you can do</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6">
                  {result.nextSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </section>

        <section
          id="how-it-works"
          className="border-y border-slate-200 bg-white"
        >
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
            <p className="text-center text-xs font-bold uppercase tracking-[0.16em] text-[#1763a6]">
              Simple, explainable checks
            </p>
            <h2 className="mt-3 text-center text-3xl font-extrabold tracking-tight">
              How LinkLens works
            </h2>
            <div className="mt-9 grid gap-4 md:grid-cols-3">
              {[
                [
                  "01",
                  "Paste a link",
                  "Review the address without opening it.",
                ],
                [
                  "02",
                  "See the clues",
                  "Read plain-language explanations for each signal.",
                ],
                [
                  "03",
                  "Choose carefully",
                  "Use practical steps to verify a link independently.",
                ],
              ].map(([number, title, description]) => (
                <article
                  key={number}
                  className="rounded-2xl border border-slate-200 bg-[#f8faff] p-6"
                >
                  <span className="text-sm font-extrabold text-[#1763a6]">
                    {number}
                  </span>
                  <h3 className="mt-3 text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="safety" className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <div className="rounded-3xl bg-[#18345b] p-7 text-white sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-200">
              Stay in control
            </p>
            <h2 className="mt-3 text-2xl font-extrabold">
              A warning sign is a reason to pause—not proof by itself.
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-blue-50">
              Check important requests through a website or phone number you
              find independently. Never enter a password or payment details just
              because a message asks you to.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white px-5 py-6 text-center text-xs text-slate-600">
        LinkLens is an educational demo. Its heuristic review cannot confirm
        whether a website is safe or malicious.
      </footer>
    </div>
  );
}
