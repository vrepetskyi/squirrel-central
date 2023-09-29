import Head from "next/head";
import { useEffect, useState } from "react";
import SplitPane from "react-split-pane";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { ChartsGrid } from "~/components/ChartsGrid";
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
        <header className="flex items-center bg-ag-500 px-3 py-2">
          <span className="relative -top-0.5 mr-3 text-3xl">🐿️</span>
          <h1 className="text-xl font-bold">Squirrel Central</h1>
          <span className="mx-3 h-4/5 w-[1px] bg-ag-400" />
          <div className="flex-1">Filter</div>
          <span className="mx-3 h-4/5 w-[1px] bg-ag-400" />
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
            minSize={0}
            maxSize={-285}
            resizerClassName="cursor-row-resize transition-colors duration-200 hover:bg-ag-500 basis-9 w-20 rounded-full self-center bg-ag-400 relative top-9 z-[1] -mt-9 border-[16px] box-border border-ag-600"
            pane2Style={{ overflow: "auto" }}
          >
            <div className="flex items-center overflow-hidden bg-ag-700">
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
                <Tab
                  className="px-4 py-2 text-sm focus:outline-none"
                  selectedClassName="bg-ag-500"
                >
                  Pinned
                </Tab>
              </TabList>
              <TabPanel selectedClassName="h-full !block">
                <ObservationsGrid observations={observations} />
              </TabPanel>
              <TabPanel selectedClassName="overflow-auto h-full !block">
                <ChartsGrid observations={observations} />
              </TabPanel>
              <TabPanel selectedClassName="h-full !block">
                <div className="flex h-full flex-col items-center justify-center gap-3 [&>span]:text-ag-300">
                  <span className="[&>em]:text-ag-200">
                    <em>Pin</em> a <em>chart</em> from the <em>Aggregated</em>{" "}
                    tab to get started
                  </span>
                  <span className="text-sm !text-ag-400 [&>em]:text-ag-300">
                    This feature <em>preserves</em> the <em>filter</em> and is
                    meant for side-by-side <em>comparison</em>
                  </span>
                </div>
              </TabPanel>
            </Tabs>
          </SplitPane>
        </main>
      </div>
    </>
  );
}
