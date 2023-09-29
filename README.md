## [squirrels.vrepetskyi.codes](https://squirrels.vrepetskyi.codes)

# Squirrel Central

An interactive data visualization about squirrels of New York City's Central Park

The dataset: https://data.cityofnewyork.us/Environment/2018-Central-Park-Squirrel-Census-Squirrel-Data/vfnx-vebw

## Preprocessing

**Compressed** the dataset by more than **11 times**

Original: 732 kB<br />Compressed: 64 kB (32 kB of fixed-length data + 32 kB of observer notes)

Performed actions:

- Removed the CSV header and redundant attributes
- Trimmed date and coordinates
- Enumerated day and primary color
- One-hot encoded highlight colors
- Used bitfields for binary attributes
- Served as a binary file; decoded on frontend

Observer notes may be compressed even further by limiting the character set to Base64/applying LZW algorithm

## SOS

### Features

- Moveable split pane layout (map/tabs ratio is dynamic)
- Observations table tooltips
- Sorting available on each attribute (SHIFT to sort on multiple)
- Columns may be reordered
- Google Maps by double-click on observation's coordinates
- Filtering on time of day and age
- Reactive density plot

### Activities description

- Running: squirrel was seen running.
- Chasing: squirrel was seen chasing another squirrel.
- Climbing: squirrel was seen climbing a tree or other environmental landmark.
- Eating: squirrel was seen eating.
- Foraging: squirrel was seen foraging for food.

### Interactions description

- Kuks: squirrel was heard kukking, a chirpy vocal communication used for a variety of reasons.
- Quaas: squirrel was heard quaaing, an elongated vocal communication which can indicate the presence of a ground predator such as a dog.
- Moans: squirrel was heard moaning, a high-pitched vocal communication which can indicate the presence of an air predator such as a hawk.
- Tail Flags: squirrel was seen flagging its tail. Flagging is a whipping motion used to exaggerate squirrel's size and confuse rivals or predators. Looks as if the squirrel is scribbling with tail into the air.
- Tail Twitches: squirrel was seen twitching its tail. Looks like a wave running through the tail, like a breakdancer doing the arm wave. Often used to communicate interest, curiosity.
- Approaches: squirrel was seen approaching human, seeking food.
- Indifferent: squirrel was indifferent to human presence.
- Runs From: squirrel was seen running from humans, seeing them as a threat.

## Ideas for improvement

- Interactive map allowing for selection of hectares, displaying a heatmap and individual observations on hover
- More filters: days, altitude range, particular activities, number of activities, particular interactions, number of interactions, kind of notes
- More aggregated visualizations: pie charts and histograms
- Functional pinned tab
- Extract continuous attributes specifying squirrel's distance from various environments (water, park paths, tenis courts, etc.)
- Jump to arbitrary table page
- Pick interesting cases, improve notes about them, attach AI-generated images of those squirrels
