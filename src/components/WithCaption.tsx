import React from "react";

const WithCaption: React.FC<React.PropsWithChildren<{ caption: string }>> = ({
  caption,
  children,
}) => (
  <figure className="flex h-min w-min flex-col p-4">
    {children}
    <figcaption className="mt-2 whitespace-pre-line text-center text-xs text-ag-300">
      {caption}
    </figcaption>
  </figure>
);

const Memoized = React.memo(WithCaption);

export { Memoized as WithCaption };
