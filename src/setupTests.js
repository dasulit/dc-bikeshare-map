import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

jest.mock('mapbox-gl', () => ({
  Map: jest.fn(),
  Marker: jest.fn(() => ({
    setLngLat: jest.fn(),
    addTo: jest.fn()
  }))
}));
