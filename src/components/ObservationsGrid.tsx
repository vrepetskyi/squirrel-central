import {
  type ICellRendererParams,
  type RowDoubleClickedEvent,
} from "ag-grid-community";
import {
  type ColDef,
  type ColGroupDef,
} from "ag-grid-community/dist/lib/entities/colDef";
import { AgGridReact } from "ag-grid-react/lib/agGridReact";
import React, { memo } from "react";
import { Activity, Color, Interaction, type Observation } from "~/utils";

const showOnMaps = ({
  data: observation,
}: RowDoubleClickedEvent<Observation>) => {
  if (!observation) return;
  const x = observation.location.x / 1000000;
  const xm = Math.floor(x * 60);
  const xs = Math.floor((x * 60 - xm) * 60);
  const y = observation.location.y / 1000000;
  const ym = Math.floor(y * 60);
  const ys = Math.floor((y * 60 - ym) * 60);
  const url = `https://www.google.com/maps/place/40°${ym}'${ys}"N+73°${xm}'${xs}"W`;
  window.open(url, "_blank");
};

const observationToColors = (observation?: Observation): Color[] =>
  observation?.color.primary
    ? [observation.color.primary, ...observation.color.highlights]
    : [];

const colorToClass: Record<Color, string> = {
  [Color.Black]: "bg-stone-950",
  [Color.Gray]: "bg-stone-600",
  [Color.Cinnamon]: "bg-amber-500",
  [Color.White]: "bg-white",
};

const ColorsRenderer: React.FC<ICellRendererParams<Observation>> = ({
  data,
}) => (
  <div className="flex h-full items-center gap-1">
    {observationToColors(data).map((x: Color, i) => (
      <span key={i} className={`${colorToClass[x]} h-6 w-6 rounded-sm`} />
    ))}
  </div>
);

const columnDefs: (ColGroupDef<Observation> | ColDef<Observation>)[] = [
  {
    headerName: "Shift",
    headerTooltip: "All the observations were made during October 2018",
    sortable: true,
    sort: "asc",
    comparator: (va, vb, na, nb) => {
      const a = na.data!.time;
      const b = nb.data!.time;
      if (a.day === b.day && a.isMorning === b.isMorning) return 0;
      if (a.day > b.day) return 1;
      if (a.day < b.day) return -1;
      if (a.isMorning) return -1;
      return 1;
    },

    valueGetter: ({ data }) => {
      if (!data) return;
      return `${data.time.day.toString().padStart(2, "0")} ${
        data.time.isMorning ? "Morning" : "Evening"
      }`;
    },
    width: 123,
  },
  {
    headerName: "Location",
    headerTooltip:
      'Double-click an observation to show it on Google Maps. Enter Street View by right-clicking "What\'s here?" on the pinpoint base',
    children: [
      {
        field: "location.x",
        headerName: "X",
        valueFormatter: ({ value }) => `-73.${value}`,
        onCellDoubleClicked: showOnMaps,
        sortable: true,
        comparator: (a, b) => (a < b ? 1 : -1),
        width: 123,
      },
      {
        field: "location.y",
        headerName: "Y",
        valueFormatter: ({ value }) => `40.${value}`,
        onCellDoubleClicked: showOnMaps,
        sortable: true,
        width: 123,
      },
      {
        headerName: "Z",
        valueFormatter: ({ data }) => {
          if (data?.location.isAboveGround === undefined) return "";
          if (!data.location.isAboveGround) return "0 metres";
          const heightFeet = data.location.z;
          if (heightFeet === undefined) return "Over 0 m";
          const height = (heightFeet * 0.3048).toFixed(1);
          return `${height} metres`;
        },
        onCellDoubleClicked: showOnMaps,
        sortable: true,
        comparator: (va, vb, na, nb) => {
          const a = na.data!.location;
          const b = nb.data!.location;
          if (a.isAboveGround === b.isAboveGround && a.z === b.z) return 0;
          if (
            (a.isAboveGround === undefined && b.isAboveGround === false) ||
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            (a.isAboveGround === false && b.isAboveGround) ||
            (a.z === undefined && b.z !== undefined) ||
            a.z! < b.z!
          )
            return -1;
          return 1;
        },
        width: 132,
      },
    ],
  },
  {
    headerName: "Squirrel",
    children: [
      {
        headerName: "Colors",
        headerTooltip:
          "The primary color is first on the list. Further ordering does not indicate the quantity of the color",
        cellRenderer: ColorsRenderer,
        tooltipValueGetter: ({ data }) =>
          observationToColors(data)
            .map((x) => Color[x])
            .join(", "),
        sortable: true,
        comparator: (va, vb, na, nb) => {
          const a = observationToColors(na.data);
          const b = observationToColors(nb.data);
          if (a.length === b.length) {
            if (a.join() === b.join()) return 0;
            return a.join() > b.join() ? -1 : 1;
          }
          return a.length > b.length ? 1 : -1;
        },
        width: 138,
      },
      {
        field: "isJuvenile",
        headerName: "Age",
        valueFormatter: ({ value }) =>
          value === true ? "Juvenile" : value === false ? "Adult" : "",
        sortable: true,
        comparator: (a, b) => {
          if (a === b) return 0;
          if (a === undefined || (a && b === false)) return -1;
          return 1;
        },
        width: 105,
      },
      {
        field: "activities.list",
        headerName: "Activities",
        headerTooltip: "See SOS page for clarification",
        valueFormatter: ({ value }) =>
          (value as Activity[])
            .map(
              (x) =>
                ({
                  [Activity.Running]: "👟",
                  [Activity.Chasing]: "🚨",
                  [Activity.Climbing]: "🌳",
                  [Activity.Eating]: "🌰",
                  [Activity.Foraging]: "🔎",
                })[x],
            )
            .join(""),
        tooltipValueGetter: ({ value }) =>
          (value as Activity[]).map((x) => Activity[x]).join(", "),
        sortable: true,
        comparator: (a: Activity[], b: Activity[]) => {
          const lengthA = a.length;
          const lengthB = b.length;
          if (lengthA === lengthB) {
            if (a.join() === b.join()) return 0;
            return a.join() > b.join() ? -1 : 1;
          }
          return lengthA > lengthB ? 1 : -1;
        },
        sort: "desc",
        cellClass: "text-2xl",
        width: 197,
      },
      {
        field: "interactions.list",
        headerName: "Interactions",
        headerTooltip: "See SOS page for clarification",
        valueFormatter: ({ value }) =>
          (value as Interaction[])
            .map(
              (x) =>
                ({
                  [Interaction.Kuks]: "🗣️",
                  [Interaction.Quaas]: "🐶",
                  [Interaction.Moans]: "🦅",
                  [Interaction.Flags]: "👻",
                  [Interaction.Twitches]: "👀",
                  [Interaction.Approaches]: "🫴",
                  [Interaction.Indifferent]: "🪑",
                  [Interaction.Escapes]: "💨",
                })[x],
            )
            .join(""),
        tooltipValueGetter: ({ value }) =>
          (value as Interaction[]).map((x) => Interaction[x]).join(", "),
        sortable: true,
        comparator: (a: Interaction[], b: Interaction[]) => {
          const lengthA = a.length;
          const lengthB = b.length;
          if (lengthA === lengthB) {
            if (a.join() === b.join()) return 0;
            return a.join() > b.join() ? -1 : 1;
          }
          if (lengthA === lengthB) return 0;
          return lengthA > lengthB ? 1 : -1;
        },
        sort: "desc",
        cellClass: "text-2xl",
        width: 179,
      },
    ],
  },
  {
    headerName: "Notes",
    flex: 1,
    minWidth: 180,
    valueGetter: ({ data }) =>
      [
        data?.location.note,
        data?.color.note,
        data?.activities.note,
        data?.interactions.note,
      ].join(" "),
    tooltipValueGetter: ({ data }) =>
      [
        data?.location.note,
        data?.color.note,
        data?.activities.note,
        data?.interactions.note,
      ].join(" "),
    sortable: true,
    comparator: (a: string, b: string) => {
      if (a === b) return 0;
      if (a.length > b.length) return 1;
      if (a.length < b.length) return -1;
      if (a > b) return -1;
      return 1;
    },
    resizable: true,
  },
];

const ObservationsGrid: React.FC<{ filtered: Observation[] }> = ({
  filtered,
}) => (
  <AgGridReact
    className="ag-theme-alpine-dark"
    rowData={filtered}
    columnDefs={columnDefs}
    suppressDragLeaveHidesColumns
    pagination
    tooltipShowDelay={300}
  />
);

const Memoized = memo(ObservationsGrid);

export { Memoized as ObservationsGrid };
