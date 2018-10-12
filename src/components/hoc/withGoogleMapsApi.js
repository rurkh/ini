import React from 'react';
import { withScriptjs } from 'react-google-maps';
import { compose } from 'redux';
import { defaultProps, mapProps } from 'recompose';

import withTrans from 'components/hoc/withTrans';

export default compose(
  withTrans,
  mapProps(props => ({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?key=' +
      process.env.REACT_APP_GOOGLE_MAPS_API_KEY +
      '&v=3.exp&libraries=geometry,places&language=' +
      (props.intl.locale.startsWith('de') ? 'de' : 'en'),
    ...props,
  })),
  defaultProps({
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px`, width: `100%` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs
);
