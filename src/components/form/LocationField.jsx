import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Marker } from 'react-google-maps';
import { StandaloneSearchBox } from 'react-google-maps/lib/components/places/StandaloneSearchBox';
import { Button } from 'primereact/components/button/Button';
import _trim from 'lodash/trim';
import _compact from 'lodash/compact';
import _isEmpty from 'lodash/isEmpty';
import _isUndefined from 'lodash/isUndefined';
import axios from 'axios';

import TextField from 'components/form/TextField';
import GoogleMap, { defaultLocation } from 'components/common/GoogleMap';
import withGoogleMapsApi from 'components/hoc/withGoogleMapsApi';

const isEmptyLocation = location => !(location && location.lat && location.lng);

class LocationField extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.shape({
      street: PropTypes.string,
      postal_code: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      city: PropTypes.string,
      position: PropTypes.shape({
        lng: PropTypes.number,
        lat: PropTypes.number,
      }),
    }),
  };

  state = {};

  onMarkerPositionChanged = () => {
    const { locale } = this.props.intl;

    const markerPosition = this.marker.getPosition();
    const position = { lat: markerPosition.lat(), lng: markerPosition.lng() };

    axios
      .get(
        'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +
          `${position.lat},${position.lng}` +
          `&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}` +
          '&language=' +
          (locale.startsWith('de') ? 'de' : 'en')
      )
      .then(response => {
        const place = response.data.results[0];
        if (_isEmpty(place.geometry)) {
          place.geometry = { location: position };
        }
        this.placeToValue(place);
      })
      .catch(error => {
        console.error(error);
      });
  };

  onPlacesChanged = () => {
    const places = this.searchBox.getPlaces();
    if (!places.length) {
      return;
    }

    this.placeToValue(places[0]);
  };

  placeToValue({ geometry = {}, address_components, formatted_address }) {
    const place = {
      position: {},
    };

    if (geometry && !_isEmpty(geometry.location)) {
      place.position =
        typeof geometry.location.lat === 'function'
          ? { lat: geometry.location.lat(), lng: geometry.location.lng() }
          : geometry.location;
    }

    if (address_components) {
      for (let component of address_components) {
        if (component.types.includes('locality')) {
          place.city = component.long_name;
        } else if (component.types.includes('route')) {
          place.route = component.long_name;
        } else if (component.types.includes('street_number')) {
          place.street_number = component.long_name;
        } else if (component.types.includes('postal_code')) {
          place.postal_code = component.long_name;
        }
      }

      place.street = _trim(`${place.route || ''} ${place.street_number || ''}`);
      place.formattedAddress = formatted_address;
    }

    this.handleChange(place);
  }

  handleAddressChange = e => {
    this.handleChange({ formattedAddress: e.target.value });
  };

  handleChange(value) {
    this.props.onChange &&
      this.props.onChange({ ...this.props.value, ...value });
  }

  onSearchBoxMounted = ref => {
    this.searchBox = ref;
  };

  onMakerMounted = ref => {
    this.marker = ref;
  };

  toggleMap = () => {
    this.setState(({ visible }) => ({
      visible: !visible,
    }));
  };

  render() {
    const { visible } = this.state;
    const {
      value: { street, postal_code, city, position, formattedAddress },
      trans,
    } = this.props;

    const location = isEmptyLocation(position) ? defaultLocation : position;
    const addressValue = _isUndefined(formattedAddress)
      ? _compact([street, postal_code, city]).join(', ') || ''
      : formattedAddress;

    return (
      <Fragment>
        <div className="form-item row">
          <div className="col">
            <StandaloneSearchBox
              ref={this.onSearchBoxMounted}
              onPlacesChanged={this.onPlacesChanged}
            >
              <TextField
                label={trans('app.location.address')}
                placeholder="Halliserweg 3, 95885, Nürnberg"
                value={addressValue}
                onChange={this.handleAddressChange}
              />
            </StandaloneSearchBox>
          </div>
          <div className="col-auto">
            <Button
              className="location-button green-light-btn"
              icon="ui-icon-near-me"
              type="button"
              onClick={this.toggleMap}
            />
          </div>
        </div>
        {visible && (
          <div className="form-item">
            <GoogleMap zoom={position ? 18 : 12} center={location}>
              <Marker
                position={location}
                ref={this.onMakerMounted}
                draggable
                onDragEnd={this.onMarkerPositionChanged}
              />
            </GoogleMap>
          </div>
        )}
      </Fragment>
    );
  }
}

export default withGoogleMapsApi(LocationField);
