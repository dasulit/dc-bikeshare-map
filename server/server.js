const express = require('express');
const axios = require('axios');

const app = express();
const port = 5000;

app.get('/bikes', (req, res) => {
  axios
    .get('https://gbfs.uber.com/v1/dcb/free_bike_status.json')
    .then(
      ({
        data: {
          data: { bikes }
        }
      }) => {
        return bikes.map(({ bike_id, lon, lat, jump_ebike_battery_level }) => {
          // Format as a GeoJSON feature
          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat]
            },
            properties: {
              id: bike_id,
              provider: 'jump',
              battery: jump_ebike_battery_level
            }
          };
        });
      }
    )
    .then(jumpFeatures => {
      return axios
        .get(
          'https://gbfs.capitalbikeshare.com/gbfs/en/station_information.json'
        )
        .then(
          ({
            data: {
              data: { stations }
            }
          }) => {
            return axios
              .get(
                'https://gbfs.capitalbikeshare.com/gbfs/en/station_status.json'
              )
              .then(
                ({
                  data: {
                    data: { stations: status }
                  }
                }) => {
                  const capitalBikeFeatures = stations.map(
                    ({ station_id, name, capacity, lon, lat }) => {
                      // Use unique ID to find the status for each station
                      const statusById = status.find(
                        s => s.station_id === station_id
                      );
                      // Format as a GeoJSON feature
                      return {
                        type: 'Feature',
                        geometry: {
                          type: 'Point',
                          coordinates: [lon, lat]
                        },
                        properties: {
                          name,
                          id: station_id,
                          provider: 'capital-bikeshare',
                          bikes: statusById.num_bikes_available,
                          docks: statusById.num_docks_available
                        }
                      };
                    }
                  );
                  // Concatenate features together for usage as one source layer
                  return capitalBikeFeatures.concat(jumpFeatures);
                }
              );
          }
        );
    })
    .then(allFeatures => {
      const bikeFeatureCollection = JSON.stringify({
        type: 'FeatureCollection',
        features: allFeatures
      });
      res.send(bikeFeatureCollection);
    })
    .catch(err => console.error(err));
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
