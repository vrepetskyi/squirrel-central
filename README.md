# Squirrel Central

An interactive data visualization about squirrels of New York City's Central Park

The dataset: https://data.cityofnewyork.us/Environment/2018-Central-Park-Squirrel-Census-Squirrel-Data/vfnx-vebw

## Preprocessing

**Compressed** the data by more than **10 times** (from 732 to 68 KB) by:

- Removing the header and redundant attributes
- Trimming redundant data (date, coordinates)
- Enumerating attributes with low dimensionality (day, color)
- Transforming binary attributes into a bitfield
- Applying GZIP compression
