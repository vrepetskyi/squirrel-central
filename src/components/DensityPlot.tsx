// Based on https://www.react-graph-gallery.com/density-plot

import { curveBasis, line, mean, scaleLinear, type ScaleLinear } from "d3";
import React from "react";

const kernelDensityEstimator =
  (kernel: (v: number) => number, X: number[]) => (V: number[]) =>
    X.map((x) => [x, mean(V, (v) => kernel(x - v))]) as [number, number][];

const kernelEpanechnikov = (k: number) => (v: number) =>
  Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;

const DensityPlot: React.FC<{
  width: number;
  height: number;
  data: number[];
  min?: number;
  max?: number;
}> = ({ width, height, data, min, max }) => {
  let xScale: ScaleLinear<number, number, never>;
  if (min !== undefined && max !== undefined) {
    xScale = scaleLinear().domain([min, max]).range([0, width]);
  } else {
    const dataMin = Math.min(...data);
    const dataMax = Math.max(...data);
    const dataRange = dataMax - dataMin;

    xScale = scaleLinear()
      .domain([dataMin - dataRange * 0.2, dataMax + dataRange * 0.2])
      .range([0, width])
      .nice();
  }

  const densityGenerator = kernelDensityEstimator(
    kernelEpanechnikov(2),
    xScale.ticks(100),
  );

  const density: [number, number][] = densityGenerator(data).map(([x, y]) => {
    const log = y ? Math.log(y * 10000) : 0;
    return [x, log < 0 ? 0 : log];
  });

  const yMax = Math.max(...density.map((x) => x[1]!));

  const yScale = scaleLinear()
    .range([height - 17.5, 0])
    .domain([0, yMax]);

  const pathGenerator = line()
    .x((d) => xScale(d[0]))
    .y((d) => yScale(d[1]))
    .curve(curveBasis);

  const range = xScale.range();
  const tickWidth = range[1]! - range[0]!;
  const ticksNumber = Math.floor(tickWidth / 40);

  const ticks = xScale
    .ticks(ticksNumber)
    .map((value) => ({ value, xOffset: xScale(value) }));

  return (
    <svg width={width} height={height}>
      <path
        d={pathGenerator(density)!}
        className="translate-y  -[0.5px] fill-ag-450 stroke-ag-200 stroke-2"
      />
      <g style={{ transform: `translateY(${height - 16.5}px)` }}>
        <path
          d={["M", range[0], 0, "L", range[1], 0].join(" ")}
          className="stroke-ag-400"
        />
        {ticks.map(({ value, xOffset }, i) => (
          <g
            key={value}
            transform={`translate(${
              xOffset + (i === 0 ? 0.5 : i === ticks.length - 1 ? -0.5 : 0)
            }, 0.4)`}
            className="[&:first-of-type>text]:[text-anchor:start] [&:last-of-type>text]:[text-anchor:end] "
          >
            <line y2={4} className="stroke-ag-400" />
            <text
              key={value}
              className="translate-y-4 fill-ag-400 text-[0.6rem] [text-anchor:middle]"
            >
              {value}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
};

const Memoized = React.memo(DensityPlot);

export { Memoized as DensityPlot };
