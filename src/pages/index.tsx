import Head from "next/head";
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
        <link
          rel="icon"
          type="image/svg+xml"
          sizes="any"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐿️</text></svg>"
        />
      </Head>
      <div className="flex h-screen flex-col">
        <header className="bg-ag-500 flex items-center px-3 py-2">
          <span className="relative -top-0.5 mr-3 text-3xl">🐿️</span>
          <h1 className="text-xl font-bold">Squirrel Central</h1>
          <span className="bg-ag-400 mx-3 h-4/5 w-[1px]" />
          <div className="flex-1">Filter</div>
          <span className="bg-ag-400 mx-3 h-4/5 w-[1px]" />
          <a
            href="https://github.com/vrepetskyi/squirrel-central#SOS"
            target="_blank"
            className="relative -top-0.5 text-3xl"
          >
            🆘
          </a>
        </header>
        <main className="relative flex-1">
          {/* @ts-expect-error react-split-pane children */}
          <SplitPane
            split="horizontal"
            defaultSize="45%"
            resizerClassName="cursor-row-resize transition-colors duration-200 hover:bg-ag-500 h-9 w-20 rounded-full self-center bg-ag-400 relative top-9 z-[1] -mt-9 border-[16px] box-border border-ag-600"
            minSize={0}
            maxSize={-285}
          >
            <div className="bg-ag-700 flex items-center overflow-hidden">
              <img src="/map.png" />
            </div>
            <Tabs className="flex h-full w-full flex-col" forceRenderTabPanel>
              <TabList className="flex">
                <Tab
                  className="px-4 py-2 text-sm focus:outline-none"
                  selectedClassName="bg-ag-500"
                >
                  Individual
                </Tab>
                <Tab
                  className="px-4 py-2 text-sm focus:outline-none"
                  selectedClassName="bg-ag-500"
                >
                  Aggregated
                </Tab>
              </TabList>
              <TabPanel selectedClassName="h-full !block">
                <ObservationsGrid observations={observations} />
              </TabPanel>
              <TabPanel selectedClassName="h-full !block">Charts</TabPanel>
            </Tabs>
          </SplitPane>
        </main>
      </div>
    </>
  );
}
