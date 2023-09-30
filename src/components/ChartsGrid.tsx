import { count } from "d3";
import EChartsReact from "echarts-for-react";
import React from "react";
import { type Observation } from "~/utils";
import { DensityPlot } from "./DensityPlot";
import { WithCaption } from "./WithCaption";

const ChartsGrid: React.FC<{ filtered: Observation[] }> = ({ filtered }) => {
  const altitude = filtered
    .map((x) => x.location.z)
    .filter((x) => x !== undefined)
    .map((x) => x! * 0.3048);

  const juveniles = count(filtered, (x) => (x.isJuvenile === true ? 1 : null));

  const adults = count(filtered, (x) => (x.isJuvenile === false ? 1 : null));

  return (
    <div className="flex flex-wrap">
      <WithCaption
        caption={
          "Squirrel altitude distribution\n(X in metres, Y on log scale)\nNegative values are only caused\nby the kernelling algorithm"
        }
      >
        <DensityPlot
          width={400}
          height={200}
          data={altitude}
          min={-5}
          max={60}
        />
      </WithCaption>
      <WithCaption caption="Age distribution">
        <EChartsReact
          className="w-[400px]"
          theme="dark"
          option={{
            series: [
              {
                type: "pie",
                data: [
                  {
                    name: "Unknown",
                    value: filtered.length - juveniles - adults,
                  },
                  {
                    name: "Juvenile",
                    value: juveniles,
                  },
                  {
                    name: "Adult",
                    value: adults,
                  },
                ],
              },
            ],
          }}
          opts={{ renderer: "svg" }}
        />
      </WithCaption>
    </div>
  );
};

const Memoized = React.memo(ChartsGrid);

export { Memoized as ChartsGrid };
