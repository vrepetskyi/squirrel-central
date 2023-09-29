import React from "react";
import { type Observation } from "~/utils";
import { DensityPlot } from "./DensityPlot";
import { WithCaption } from "./WithCaption";

const ChartsGrid: React.FC<{ observations: Observation[] }> = ({
  observations,
}) => {
  const altitude = observations
    .map((x) => x.location.z)
    .filter((x) => x !== undefined)
    .map((x) => x! * 0.3048);

  return (
    <WithCaption
      caption={"Squirrel altitude distribution\n(X in metres, Y on log scale)"}
    >
      <DensityPlot width={400} height={400} data={altitude} />
    </WithCaption>
  );
};

const Memoized = React.memo(ChartsGrid);

export { Memoized as ChartsGrid };
