import React from "react";

const FilterButton: React.FC<{
  text: string;
  onClick: () => void;
  blank?: boolean;
}> = ({ text, onClick, blank }) => (
  <button
    className={`rounded-full border-ag-200 px-3 py-1 text-xs ${
      blank ? "bg-ag-450" : "bg-ag-400"
    }`}
    onClick={onClick}
  >
    {text}
  </button>
);

const Memoized = React.memo(FilterButton);

export { Memoized as FilterButton };
