import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Tooltip from './tooltip';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN } from '../constants.js';

mapboxgl.accessToken = MAPBOX_TOKEN;

class MapView extends React.Component {
  mapRef = React.createRef();
  map;
  tooltipContainer;
  tooltip;

  static propTypes = {
    bikeData: PropTypes.object.isRequired
  };

  componentDidMount() {
    // Prepare a container for dynamic tooltip content
    this.tooltipContainer = document.createElement('div');
    this.initializeMap();
  }

  componentDidUpdate(prevProps) {
    const { bikeData } = this.props;
    const { bikeData: prevBikeData } = prevProps;
    // Wait until data is ready before adding to map
    if (bikeData.features.length > 0 && prevBikeData.features.length === 0) {
      this.addBikeDataToMap();
    }
  }

  initializeMap = () => {
    this.map = new mapboxgl.Map({
      container: this.mapRef.current,
      style: 'mapbox://styles/dasulit/ck79dhrwd20lb1imsq1ism9b5?fresh=true',
      center: [-77.0383, 38.8927], // Washington, DC
      zoom: 11,
      minZoom: 10
    });

    this.tooltip = new mapboxgl.Marker(this.tooltipContainer, {
      offset: [15, -10]
    });
    this.tooltip.setLngLat([0, 0]);
    this.tooltip.addTo(this.map);
  };

  addBikeDataToMap = () => {
    const { map } = this;
    if (!map) return;

    map.addSource('bikes', {
      type: 'geojson',
      data: this.props.bikeData
    });

    map.addLayer({
      id: 'bikes',
      type: 'symbol',
      source: 'bikes',
      layout: {
        'icon-image': ['get', 'provider'], // Corresponds to IDs of icons in style
        'icon-allow-overlap': true
      }
    });

    map.on('click', this.handleMapClick);

    // Indicate that icons are clickable
    const canvas = map.getCanvas();
    map.on('mouseenter', 'bikes', () => (canvas.style.cursor = 'pointer'));
    map.on('mouseleave', 'bikes', () => (canvas.style.cursor = ''));
  };

  handleMapClick = e => {
    const clickedFeatures = this.map.queryRenderedFeatures(e.point, {
      layers: ['bikes']
    });

    if (clickedFeatures.length > 0) {
      const feature = clickedFeatures[0];
      const { coordinates } = feature.geometry;
      this.map.flyTo({ center: coordinates, zoom: 16 });
      this.tooltip.setLngLat(coordinates);

      // Add the Tooltip component to the Mapbox GL Marker
      ReactDOM.render(
        React.createElement(Tooltip, { featureProperties: feature.properties }),
        this.tooltipContainer
      );
    } else {
      // Clear the tooltip if no feature is clicked
      ReactDOM.unmountComponentAtNode(this.tooltipContainer);
    }
  };

  render() {
    return <div ref={this.mapRef} id="map" />;
  }
}

export default MapView;
