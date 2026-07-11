"use client";
import { useState } from "react";

function classify(bmi) {
  if (bmi < 18.5) return { label: "Underweight", color: "text-signal-bright" };
  if (bmi < 25) return { label: "Healthy range", color: "text-sage" };
  if (bmi < 30) return { label: "Overweight", color: "text-ember" };
  return { label: "Obese range", color: "text-ember" };
}

export default function BMICalculator({ initialHeight, initialWeight }) {
  const [height, setHeight] = useState(initialHeight || "");
  const [weight, setWeight] = useState(initialWeight || "");

  const h = parseFloat(height);
  const w = parseFloat(weight);
  const valid = h > 0 && w > 0;
  const bmi = valid ? w / Math.pow(h / 100, 2) : null;
  const result = bmi ? classify(bmi) : null;

  return (
    <div className="card p-6">
      <h3 className="font-display font-semibold text-lg text-ink mb-1">BMI Calculator</h3>
      <p className="text-sm text-ink-muted mb-5">Quick body mass index estimate from height and weight.</p>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className="text-xs text-ink-muted block mb-1">Height (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full bg-base-raised border border-base-line rounded-md px-3 py-2 text-ink font-mono focus-ring"
            placeholder="175"
          />
        </div>
        <div>
          <label className="text-xs text-ink-muted block mb-1">Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full bg-base-raised border border-base-line rounded-md px-3 py-2 text-ink font-mono focus-ring"
            placeholder="70"
          />
        </div>
      </div>

      {valid ? (
        <div className="border border-base-line rounded-card p-4 flex items-center justify-between">
          <div>
            <p className="font-mono text-3xl text-ink">{bmi.toFixed(1)}</p>
            <p className={`text-sm ${result.color}`}>{result.label}</p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-ink-faint">Enter height and weight to see your BMI.</p>
      )}
    </div>
  );
}
