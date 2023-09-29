import React from "react";

const FilterButton: React.FC<{ text: string; onClick: () => void }> = ({
  text,
  onClick,
}) => (
  <button
    className="rounded-full border-ag-200 bg-ag-400 px-3 py-1 text-xs"
    onClick={onClick}
  >
    {text}
  </button>
);

const Memoized = React.memo(FilterButton);

export { Memoized as FilterButton };
