import { withGoogleMap, GoogleMap as ReactGoogleMap } from 'react-google-maps';
import React, { PureComponent } from 'react';
import { compose } from 'recompose';

import withGoogleMapsApi from 'components/hoc/withGoogleMapsApi';

export const defaultLocation = {
  lat: 48.133333,
  lng: 11.566667,
};

class GoogleMap extends PureComponent {
  render() {
    const { mapLoaded, ...props } = this.props;
    return (
      <ReactGoogleMap
        defaultZoom={16}
        defaultCenter={defaultLocation}
        {...props}
        ref={mapLoaded}
      />
    );
  }
}

export default compose(withGoogleMapsApi, withGoogleMap)(GoogleMap);
