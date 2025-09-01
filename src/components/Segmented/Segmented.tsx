import React from "react";
import "./Segmented.scss";

export type SegmentedOption<T extends string = string> = {
  label: string;
  value: T;
};

export type SegmentedProps<T extends string = string> = {
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
};

export default function Segmented<T extends string>({
  value,
  options,
  onChange,
}: SegmentedProps<T>) {
  return (
    <div className="segmented">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            className={`seg-item ${active ? "active" : ""}`}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
