import React, { useEffect, useState } from "react";
import { type Observation } from "~/utils";
import { FilterButton } from "./FilterButton";

const FiltersPanel: React.FC<{
  observations: Observation[];
  setFiltered: React.Dispatch<React.SetStateAction<Observation[]>>;
}> = ({ observations, setFiltered }) => {
  const [isFilterMorning, setIsFilterMorning] = useState<boolean>();
  const [isFilterJuvenile, setIsFilterJuvenile] = useState<boolean>();

  useEffect(() => {
    let filtered = observations;

    if (isFilterMorning !== undefined)
      filtered = filtered.filter((x) => x.time.isMorning === isFilterMorning);

    if (isFilterJuvenile !== undefined)
      filtered = filtered.filter((x) => x.isJuvenile === isFilterJuvenile);

    setFiltered(filtered);
  }, [observations, isFilterMorning, isFilterJuvenile, setFiltered]);

  return (
    <section className="flex flex-1 items-center gap-3">
      <h2 className="text-sm">Filter</h2>
      <FilterButton
        text={
          isFilterMorning === undefined
            ? "Time of day"
            : isFilterMorning
            ? "Morning"
            : "Evening"
        }
        onClick={() => {
          setIsFilterMorning(
            isFilterMorning === undefined
              ? true
              : isFilterMorning
              ? false
              : undefined,
          );
        }}
      />
      <FilterButton
        text={
          isFilterJuvenile === undefined
            ? "Age"
            : isFilterJuvenile
            ? "Juvenile"
            : "Adult"
        }
        onClick={() => {
          setIsFilterJuvenile(
            isFilterJuvenile === undefined
              ? true
              : isFilterJuvenile
              ? false
              : undefined,
          );
        }}
      />
    </section>
  );
};

const Memoized = React.memo(FiltersPanel);

export { Memoized as FiltersPanel };
