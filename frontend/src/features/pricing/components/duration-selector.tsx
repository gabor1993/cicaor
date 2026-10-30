import { hu, type Duration } from "@/content/hu";

type DurationSelectorProps = {
  name: string;
  options: readonly Duration[];
  value: Duration;
  onChange: (duration: Duration) => void;
};

export function DurationSelector({ name, options, value, onChange }: DurationSelectorProps) {
  return (
    <fieldset>
      <legend className="sr-only">{hu.packages.durationLabel}</legend>
      <div className="flex gap-2">
        {options.map((duration) => (
          <label key={duration} className="flex-1">
            <input
              type="radio"
              name={name}
              value={duration}
              checked={value === duration}
              onChange={() => onChange(duration)}
              className="peer sr-only"
            />
            <span className="block cursor-pointer rounded-full border border-line px-2 py-2 text-center text-xs text-muted transition peer-checked:border-accent peer-checked:bg-accent peer-checked:font-bold peer-checked:text-on-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
              {duration} {hu.packages.minutes}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
