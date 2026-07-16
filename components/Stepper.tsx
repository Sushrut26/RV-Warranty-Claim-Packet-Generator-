"use client";

const STEPS = ["Filing", "Unit", "Work", "Evidence", "Review"];

export function Stepper({
  current,
  onJump,
}: {
  current: number; // 0-based
  onJump: (index: number) => void;
}) {
  const pct = (current / (STEPS.length - 1)) * 100;

  return (
    <nav aria-label="Progress" className="mb-6">
      {/* Compact status line — always legible on a phone. */}
      <div className="mb-3 flex items-baseline justify-between">
        <p className="eyebrow">
          Step <span className="tabnum">{current + 1}</span> / {STEPS.length}
        </p>
        <p className="font-display text-lg font-semibold leading-none text-ink">
          {STEPS[current]}
        </p>
      </div>

      {/* Rail with markers. The fill encodes completion; markers encode state. */}
      <div className="relative">
        <div className="absolute left-0 right-0 top-[13px] h-[3px] rounded-full bg-line" />
        <div
          className="absolute left-0 top-[13px] h-[3px] rounded-full bg-accent transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
        <ol className="relative flex justify-between">
          {STEPS.map((label, i) => {
            const done = i < current;
            const active = i === current;
            const reachable = i <= current;
            return (
              <li key={label}>
                <button
                  type="button"
                  onClick={() => reachable && onJump(i)}
                  disabled={!reachable}
                  aria-current={active ? "step" : undefined}
                  aria-label={`${label}${done ? " (done)" : ""}`}
                  className="group flex flex-col items-center gap-1.5 focus-visible:outline-none disabled:cursor-not-allowed"
                >
                  <span
                    className={[
                      "flex h-7 w-7 items-center justify-center rounded-full border-2 text-[0.72rem] font-bold transition",
                      active
                        ? "border-accent bg-accent text-white ring-4 ring-[var(--ring)]"
                        : done
                          ? "border-brand bg-brand text-[var(--on-brand)]"
                          : "border-line bg-surface text-muted",
                    ].join(" ")}
                  >
                    {done ? (
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    ) : (
                      <span className="tabnum">{i + 1}</span>
                    )}
                  </span>
                  <span
                    className={[
                      "hidden font-display text-[0.7rem] font-semibold uppercase tracking-wide sm:block",
                      active ? "text-brand-text" : "text-muted",
                    ].join(" ")}
                  >
                    {label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
