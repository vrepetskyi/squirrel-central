import { type RowDoubleClickedEvent } from "ag-grid-community";
import {
  type ColDef,
  type ColGroupDef,
} from "ag-grid-community/dist/lib/entities/colDef";
import { AgGridReact } from "ag-grid-react/lib/agGridReact";
import { memo } from "react";
import { Activity, Interaction, type Observation } from "~/utils";

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

const columnDefs: (ColGroupDef<Observation> | ColDef<Observation>)[] = [
  {
    headerName: "Time",
    children: [
      {
        field: "time.day",
        headerName: "Day",
        headerTooltip: "All the observations were made during October 2018",
        resizable: true,
      },
      {
        field: "time.isMorning",
        headerName: "Shift",
        valueGetter: ({ data }) =>
          data?.time.isMorning ? "Morning" : "Evening",
        resizable: true,
      },
    ],
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
        resizable: true,
        onCellDoubleClicked: showOnMaps,
      },
      {
        field: "location.y",
        headerName: "Y",
        valueFormatter: ({ value }) => `40.${value}`,
        resizable: true,
        onCellDoubleClicked: showOnMaps,
      },
      {
        field: "location.isAboveGround",
        headerName: "Z",
        valueFormatter: ({ value, data }) => {
          if (value === undefined) return "Unknown";
          if (!value) return "Ground plane";
          const height = data?.location.height;
          if (height) return `${height} feet above ground`;
          return "Above ground";
        },
        resizable: true,
        onCellDoubleClicked: showOnMaps,
      },
    ],
  },
  {
    headerName: "Squirrel",
    children: [
      {
        field: "color.primary",
        headerName: "Color",
        resizable: true,
      },
      {
        field: "color.highlights",
        headerName: "Highlights",
        resizable: true,
      },
      {
        field: "isJuvenile",
        headerName: "Age",
        valueFormatter: ({ value }) =>
          value === true ? "Juvenile" : value === false ? "Adult" : "Unknown",
        resizable: true,
      },
      {
        field: "activities.list",
        headerName: "Activities",
        headerTooltip: "See 🆘 page for clarification",
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
        resizable: true,
        cellClass: "text-2xl pt-1",
      },
      {
        field: "interactions.list",
        headerName: "Interactions",
        headerTooltip: "See 🆘 page for clarification",
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
        resizable: true,
        cellClass: "text-2xl pt-1",
      },
    ],
  },
  {
    headerName: "Notes",
    headerTooltip: "Double-click marked observations to see notes",
  },
];

const ObservationsGrid: React.FC<{ observations: Observation[] }> = ({
  observations,
}) => {
  return (
    <AgGridReact
      className="ag-theme-alpine-dark"
      rowData={observations}
      columnDefs={columnDefs}
      suppressDragLeaveHidesColumns
      pagination
      paginationPageSize={50}
      onFirstDataRendered={({ api, columnApi }) => {
        api.setHeaderHeight(36);
        setTimeout(() => {
          columnApi.autoSizeAllColumns();
        }, 0);
      }}
      tooltipShowDelay={300}
    />
  );
};

const Memoized = memo(ObservationsGrid);

export { Memoized as ObservationsGrid };
