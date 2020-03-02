import React from 'react';
import MapView from './map-view';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bikeData: {
        type: 'FeatureCollection',
        features: []
      }
    };
  }

  componentDidMount() {
    this.getBikes()
      .then(res => this.setState({ bikeData: res }))
      .catch(err => console.log(err));
  }

  getBikes = async () => {
    const response = await fetch('/bikes');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  render() {
    return (
      <div>
        <MapView bikeData={this.state.bikeData} />
        <div className="overlay">
          <h1 className="margin-bottom-10">Rentable Bikes in Washington, DC</h1>
          <p>
            Explore bikes available to rent from Capital Bikeshare and JUMP.
          </p>
        </div>
      </div>
    );
  }
}

export default App;
