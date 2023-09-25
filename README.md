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
