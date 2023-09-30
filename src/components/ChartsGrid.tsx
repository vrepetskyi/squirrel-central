import { count } from "d3";
import EChartsReact from "echarts-for-react";
import React from "react";
import { Activity, Interaction, type Observation } from "~/utils";
import { DensityPlot } from "./DensityPlot";
import { WithCaption } from "./WithCaption";

const activityValues = Object.values(Activity).slice(5, 10);
const interactionValues = Object.values(Interaction).slice(8, 16);

const ChartsGrid: React.FC<{ filtered: Observation[] }> = ({ filtered }) => {
  const altitude = filtered
    .map((x) => x.location.z)
    .filter((x) => x !== undefined)
    .map((x) => x! * 0.3048);

  const juveniles = count(filtered, (x) => (x.isJuvenile === true ? 1 : null));
  const adults = count(filtered, (x) => (x.isJuvenile === false ? 1 : null));

  const age = [
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
  ].filter((x) => x.value);

  const activities = activityValues
    .map((activity) => ({
      name: Activity[activity as Activity],
      value: count(filtered, (x) =>
        x.activities.list.includes(activity as Activity) ? 1 : null,
      ),
    }))
    .filter((x) => x.value);

  const interactions = interactionValues
    .map((interaction) => ({
      name: Interaction[interaction as Interaction],
      value: count(filtered, (x) =>
        x.interactions.list.includes(interaction as Interaction) ? 1 : null,
      ),
    }))
    .filter((x) => x.value);

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
                data: age,
              },
            ],
          }}
          opts={{ renderer: "svg" }}
        />
      </WithCaption>
      <WithCaption caption="Activity distribution">
        <EChartsReact
          className="w-[400px]"
          theme="dark"
          option={{
            series: [
              {
                type: "pie",
                data: activities,
              },
            ],
          }}
          opts={{ renderer: "svg" }}
        />
      </WithCaption>
      <WithCaption caption="Interaction distribution">
        <EChartsReact
          className="w-[400px]"
          theme="dark"
          option={{
            series: [
              {
                type: "pie",
                data: interactions,
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
