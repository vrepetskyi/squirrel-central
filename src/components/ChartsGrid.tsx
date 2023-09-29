import React from "react";
import { type Observation } from "~/utils";
import { DensityPlot } from "./DensityPlot";
import { WithCaption } from "./WithCaption";

const ChartsGrid: React.FC<{ filtered: Observation[] }> = ({ filtered }) => {
  const altitude = filtered
    .map((x) => x.location.z)
    .filter((x) => x !== undefined)
    .map((x) => x! * 0.3048);

  return (
    <WithCaption
      caption={
        "Squirrel altitude distribution\n(X in metres, Y on log scale)\nNegative values are only caused\nby the kerneling algorithm"
      }
    >
      <DensityPlot width={400} height={200} data={altitude} min={-5} max={60} />
    </WithCaption>
  );
};

const Memoized = React.memo(ChartsGrid);

export { Memoized as ChartsGrid };
