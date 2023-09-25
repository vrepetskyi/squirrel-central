import { csvParse } from "d3";

const input = Bun.file("dataset.csv");
const output = Bun.file("../public/observations.bin");

const dataset = csvParse(await input.text());
const writer = output.writer();

const toBin = (source: boolean | string) =>
  source === true || source === "true" ? "1" : "0";

const encodePrimary = (primary: string) => {
  if (primary.includes("Black")) return "01";
  if (primary.includes("Gray")) return "10";
  if (primary.includes("Cinnamon")) return "11";
  return "00";
};

const encodeHighlights = (colors: string) =>
  toBin(colors.includes("Black")) +
  toBin(colors.includes("Gray")) +
  toBin(colors.includes("Cinnamon")) +
  toBin(colors.includes("White"));

const dayEncodings: Record<string, number> = {
  "06": 0,
  "07": 1,
  "08": 2,
  "10": 3,
  "12": 4,
  "13": 5,
  "14": 6,
  "17": 7,
  "18": 8,
  "19": 9,
  "20": 10,
};

const encodeDay = (day: string) =>
  dayEncodings[day].toString(2).padStart(4, "0");

const encodeHeight = (height: string) => {
  const value = parseInt(height);
  if (!Number.isNaN(value)) {
    return "1" + value.toString(2).padStart(8, "0");
  }
  return "0".repeat(9);
};

const encodeCoordinate = (coordinate: string) =>
  Math.round(parseInt(coordinate.split(".")[1].substring(0, 7)) / 10)
    .toString(2)
    .padStart(20, "0");

dataset.map((x) => {
  const bits =
    // Location
    encodeCoordinate(x.X) +
    encodeCoordinate(x.Y) +
    toBin(x.Location === "Ground Plane") +
    toBin(x.Location === "Above Ground") +
    encodeHeight(x["Above Ground Sighter Measurement"]) +
    // Time
    encodeDay(x.Date.substring(2, 4)) +
    toBin(x.Shift === "AM") +
    // Color
    encodePrimary(x["Primary Fur Color"]) +
    encodeHighlights(x["Highlight Fur Color"]) +
    // Age
    toBin(x.Age === "Adult") +
    toBin(x.Age === "Juvenile") +
    // Activities
    toBin(x.Running) +
    toBin(x.Chasing) +
    toBin(x.Climbing) +
    toBin(x.Eating) +
    toBin(x.Foraging) +
    // Interactions
    toBin(x.Kuks) +
    toBin(x.Quaas) +
    toBin(x.Moans) +
    toBin(x["Tail flags"]) +
    toBin(x["Tail twitches"]) +
    toBin(x.Approaches) +
    toBin(x.Indifferent) +
    toBin(x["Runs from"]);

  const fixed = Buffer.from(
    (bits.match(/.{1,8}/g) as string[]).map((x) => parseInt(x, 2)),
  );

  const notes =
    x["Specific Location"].trim() +
    "|" +
    (x["Color notes"].includes("selected") ? "" : x["Color notes"].trim()) +
    "|" +
    x["Other Activities"].trim() +
    "|" +
    x["Other Interactions"].trim() +
    "|";

  const encoded = Buffer.concat([fixed, Buffer.from(notes, "ascii")]);

  writer.write(encoded);
});

await writer.end();
