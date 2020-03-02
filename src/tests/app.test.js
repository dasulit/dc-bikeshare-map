import React from 'react';
import { shallow } from 'enzyme';
import shallowToJson from 'enzyme-to-json';
import App from '../components/app';

describe('App', () => {
  test('renders', () => {
    const wrapper = shallow(React.createElement(App));
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  test('fetches bike data and sets state', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            features: [{ id: 'feature-1' }],
            type: 'FeatureCollection'
          }),
        status: 200
      })
    );
    const wrapper = shallow(React.createElement(App));
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('/bikes');
    setTimeout(() => {
      expect(wrapper.state()).toEqual({
        bikeData: {
          features: [{ id: 'feature-1' }],
          type: 'FeatureCollection'
        }
      });
    });
  });
});
