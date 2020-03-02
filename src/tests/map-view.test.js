import React from 'react';
import { shallow } from 'enzyme';
import shallowToJson from 'enzyme-to-json';
import MapView from '../components/map-view';

describe('MapView', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      React.createElement(MapView, {
        bikeData: { features: [] }
      })
    );
  });

  test('renders', () => {
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  test('only adds source when bike data is available', () => {
    wrapper.instance().addBikeDataToMap = jest.fn();
    expect(wrapper.instance().addBikeDataToMap).toHaveBeenCalledTimes(0);
    wrapper.setProps({
      bikeData: { features: [('id': 'feature-1')] }
    });
    wrapper.update();
    expect(wrapper.instance().addBikeDataToMap).toHaveBeenCalledTimes(1);
  });
});
