import React from 'react';
import { shallow } from 'enzyme';
import shallowToJson from 'enzyme-to-json';
import Tooltip from '../components/tooltip';

describe('Tooltip', () => {
  test('renders null if no features provided', () => {
    const wrapper = shallow(
      React.createElement(Tooltip, {
        featureProperties: {}
      })
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  test('renders with Capital Bikeshare properties', () => {
    const wrapper = shallow(
      React.createElement(Tooltip, {
        featureProperties: {
          provider: 'capital-bikeshare',
          name: 'Florida Ave & R St NW',
          bikes: 12,
          docks: 3
        }
      })
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  test('renders with JUMP properties', () => {
    const wrapper = shallow(
      React.createElement(Tooltip, {
        featureProperties: {
          provider: 'jump',
          battery: '100%'
        }
      })
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
