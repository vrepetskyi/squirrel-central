import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import SplitPane from "react-split-pane";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { ObservationsGrid } from "~/components/ObservationsGrid";
import { fetchObservations, type Observation } from "~/utils";

export default function Home() {
  const [observations, setObservations] = useState<Observation[]>([]);

  useEffect(() => {
    fetchObservations((x) => {
      setObservations(x);
    });
  }, []);

  return (
    <>
      <Head>
        <title>Squirrel Central</title>
        <meta
          name="description"
          content="An interactive data visualization about squirrels of New York City's Central Park"
        />
        <link rel="icon" href="/logo-small.png" />
      </Head>
      <div className="box-border flex h-screen flex-col">
        <header className="box-content flex items-center gap-4 border-[1px] bg-ag-header px-3 py-2">
          <Image
            src="/logo-small.png"
            alt="Squirrel Central's logo"
            width={48}
            height={48}
          />
          <h1 className="text-xl font-bold">Squirrel Central</h1>
          <span className="h-4/5 w-[1px] bg-ag-border" />
          <div className="flex-1">Filter</div>
          <span className="h-4/5 w-[1px] bg-ag-border" />
          <button className="text-3xl">🆘</button>
        </header>
        <main className="flex-1">
          {/* @ts-expect-error react-split-pane children */}
          <SplitPane
            split="horizontal"
            className="[&>div:nth-child(3)]:!max-h-full"
          >
            <div className="h-full border-x-[1px] bg-ag-background">Map</div>
            <Tabs className="flex h-full flex-col border-[1px]">
              <TabList className="flex border-b-[1px] bg-ag-background">
                <Tab
                  className="px-4 py-2 text-sm focus:outline-none"
                  selectedClassName="bg-ag-header border-r-[1px]"
                >
                  Individual
                </Tab>
                <Tab
                  className="px-4 py-2 text-sm focus:outline-none"
                  selectedClassName="bg-ag-header border-x-[1px]"
                >
                  Aggregated
                </Tab>
              </TabList>
              <TabPanel selectedClassName="react-tabs__tab-panel--selected flex-1 m-[-1px]">
                <ObservationsGrid observations={observations} />
              </TabPanel>
              <TabPanel
                className="bg-ag-background"
                selectedClassName="react-tabs__tab-panel--selected flex-1"
              >
                Charts
              </TabPanel>
            </Tabs>
          </SplitPane>
        </main>
      </div>
    </>
  );
}
