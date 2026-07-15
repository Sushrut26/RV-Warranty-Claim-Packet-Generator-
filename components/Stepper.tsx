"use client";

const STEPS = ["Filing", "Unit", "Work", "Evidence", "Review"];

export function Stepper({
  current,
  onJump,
}: {
  current: number; // 0-based
  onJump: (index: number) => void;
}) {
  return (
    <nav aria-label="Progress" className="mb-6">
      <ol className="flex items-center">
        {STEPS.map((label, i) => {
          const done = i < current;
          const active = i === current;
          const reachable = i <= current;
          return (
            <li key={label} className="flex flex-1 items-center last:flex-none">
              <button
                type="button"
                onClick={() => reachable && onJump(i)}
                disabled={!reachable}
                className="flex flex-col items-center gap-1 focus:outline-none"
                aria-current={active ? "step" : undefined}
              >
                <span
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition",
                    active
                      ? "bg-brand text-white ring-4 ring-brand/20"
                      : done
                        ? "bg-brand text-white"
                        : "bg-slate-200 text-slate-500",
                  ].join(" ")}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span
                  className={[
                    "hidden text-xs font-medium sm:block",
                    active ? "text-brand" : "text-slate-500",
                  ].join(" ")}
                >
                  {label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <span
                  className={[
                    "mx-1 h-0.5 flex-1 sm:mx-2",
                    i < current ? "bg-brand" : "bg-slate-200",
                  ].join(" ")}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
