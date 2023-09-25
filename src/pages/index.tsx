import { AgGridReact } from "ag-grid-react";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchObservations, type Observation } from "~/utils";

export default function Home() {
  const [observations, setObservations] = useState<Observation[]>([]);

  useEffect(() => {
    fetchObservations((x) => {
      setObservations(x);
    });
  }, []);

  return (
    <div className="box-border flex h-[100vh] flex-col">
      <Head>
        <title>Squirrel Central</title>
        <meta
          name="description"
          content="An interactive data visualization about squirrels of New York City's Central Park"
        />
        <link rel="icon" href="/logo-small.png" />
      </Head>
      <header className="flex items-center gap-4 bg-gray-900 px-4 py-1">
        <Image
          src="/logo-small.png"
          alt="Squirrel Central's logo"
          width={48}
          height={48}
        />
        <h1 className="text-2xl font-bold text-gray-200">Squirrel Central</h1>
      </header>
      <main className="flex-1 bg-gray-800">
        <AgGridReact />
      </main>
    </div>
  );
}
