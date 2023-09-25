export enum Color {
  Black,
  Gray,
  Cinnamon,
  White,
}

export enum Activity {
  Running,
  Chasing,
  Climbing,
  Eating,
  Foraging,
}

export enum Interaction {
  Kuks,
  Quaas,
  Moans,
  Flags,
  Twitches,
  Approaches,
  Indifferent,
  Escapes,
}

export type Observation = {
  time: {
    day: number;
    isMorning: boolean;
  };
  location: {
    x: number;
    y: number;
    isAboveGround?: boolean;
    height?: number;
    note: string;
  };
  color: {
    primary?: Color;
    highlights: Color[];
    note: string;
  };
  isJuvenile?: boolean;
  activities: {
    list: Activity[];
    note: string;
  };
  interactions: {
    list: Interaction[];
    note: string;
  };
};

const dayDecodings: Record<number, number> = {
  0: 6,
  1: 7,
  2: 8,
  3: 10,
  4: 12,
  5: 13,
  6: 14,
  7: 17,
  8: 18,
  9: 19,
  10: 20,
};

const colorDecodings: Record<number, Color> = {
  1: Color.Black,
  2: Color.Gray,
  3: Color.Cinnamon,
};

const decodeObservation = (fixed: Uint8Array, notes: string): Observation => {
  const bits = [...fixed].map((x) => x.toString(2).padStart(8, "0")).join("");

  const getInt = (from: number, to: number) =>
    parseInt(bits.substring(from, to), 2);
  const isTrue = (index: number) => bits[index] === "1";

  const x = getInt(0, 20);
  const y = getInt(20, 40);
  const isOnGround = isTrue(40);
  const isAboveGround = isTrue(41);
  const isHeightKnown = isTrue(42);
  const height = getInt(43, 51);

  const day = dayDecodings[getInt(51, 55)]!;
  const isMorning = isTrue(55);

  const primary = colorDecodings[getInt(56, 58)];
  const highlights = [];
  isTrue(58) && highlights.push(Color.Black);
  isTrue(59) && highlights.push(Color.Gray);
  isTrue(60) && highlights.push(Color.Cinnamon);
  isTrue(61) && highlights.push(Color.White);

  const isAdult = isTrue(62);
  const isJuvenile = isTrue(63);

  const activities: Activity[] = [];
  isTrue(64) && activities.push(Activity.Running);
  isTrue(65) && activities.push(Activity.Chasing);
  isTrue(66) && activities.push(Activity.Climbing);
  isTrue(67) && activities.push(Activity.Eating);
  isTrue(68) && activities.push(Activity.Foraging);

  const interactions: Interaction[] = [];
  isTrue(69) && interactions.push(Interaction.Kuks);
  isTrue(70) && interactions.push(Interaction.Quaas);
  isTrue(71) && interactions.push(Interaction.Moans);
  isTrue(72) && interactions.push(Interaction.Flags);
  isTrue(73) && interactions.push(Interaction.Twitches);
  isTrue(74) && interactions.push(Interaction.Approaches);
  isTrue(75) && interactions.push(Interaction.Indifferent);
  isTrue(76) && interactions.push(Interaction.Escapes);

  const [locationNote, colorNote, activityNote, interactionNote] =
    notes.split("|");

  return {
    location: {
      x,
      y,
      isAboveGround: isAboveGround ? true : isOnGround ? false : undefined,
      height: isHeightKnown ? height : undefined,
      note: locationNote ?? "",
    },
    time: {
      day,
      isMorning,
    },
    color: {
      primary,
      highlights,
      note: colorNote ?? "",
    },
    isJuvenile: isJuvenile ? true : isAdult ? false : undefined,
    activities: {
      list: activities,
      note: activityNote ?? "",
    },
    interactions: {
      list: interactions,
      note: interactionNote ?? "",
    },
  };
};

export const fetchObservations = (
  callback: (observations: Observation[]) => void,
) => {
  fetch("/observations.bin")
    .then(({ body }) => {
      if (!body) return;
      body
        .getReader()
        .read()
        .then(({ value: raw }) => {
          if (!raw) return;

          const observations: Observation[] = [];

          let pointer = 0;
          while (pointer < raw.length - 1) {
            const fixed = raw.subarray(pointer, (pointer += 10));

            const notesStart = pointer;
            for (let i = 0; i < 4; i++) {
              const delimiter = raw.indexOf(124, pointer);
              if (delimiter === pointer) pointer++;
              else pointer = delimiter + 1;
            }

            const notes = new TextDecoder().decode(
              raw.subarray(notesStart, pointer - 1),
            );

            const observation = decodeObservation(fixed, notes);

            observations.push(observation);
          }

          callback(observations);
        })
        .catch((e) => {
          throw e;
        });
    })
    .catch((e) => {
      throw e;
    });
};
