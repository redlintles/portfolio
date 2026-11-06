"use client";

import { useState } from "react";
import { SiRust, SiTypescript, SiLinux, SiPython, SiDocker, SiPhp, SiC } from "react-icons/si";
import { FiCloud, FiCpu, FiCoffee, FiStar } from "react-icons/fi";
import site from "@/locale/site.json";
import type { Dictionary } from "@/lib/content";

/** Icon order follows the editable technology list in site.json. */
const icons = [
  SiRust,
  SiTypescript,
  SiLinux,
  SiPython,
  SiDocker,
  FiCloud,
  FiCpu,
  SiPhp,
  FiCoffee,
  SiC,
];

/** Mouse, keyboard focus, and touch all select the same experience panel. */
export function Technologies({ copy }: { copy: Dictionary }) {
  const [selected, setSelected] = useState(0);
  const technology = site.technologies[selected];
  return (
    <div className="technologies">
      <div className="technologies__list">
        {site.technologies.map((item, index) => {
          const Icon = icons[index] || FiCpu;
          return (
            <button
              type="button"
              className="technologies__button"
              key={item.name}
              aria-pressed={selected === index}
              onMouseEnter={() => setSelected(index)}
              onFocus={() => setSelected(index)}
              onClick={() => setSelected(index)}
            >
              <Icon aria-hidden="true" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>
      <div className="technologies__detail" aria-live="polite">
        <div>
          <h3>{technology.name}</h3>
          <p>
            {
              copy.technologyDescriptions[
                technology.name as keyof typeof copy.technologyDescriptions
              ]
            }
          </p>
        </div>
        <div className="technologies__rating" aria-label={`${copy.rating}: ${technology.rating}/5`}>
          <span aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <FiStar
                className={
                  index < technology.rating
                    ? "technologies__star technologies__star--filled"
                    : "technologies__star"
                }
                key={index}
              />
            ))}
          </span>
          <small>
            {copy.rating} · {technology.rating}/5
          </small>
        </div>
      </div>
    </div>
  );
}
