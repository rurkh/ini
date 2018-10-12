import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import GoogleMap from 'components/common/GoogleMap';
import { Marker } from 'react-google-maps';

import Item from 'components/data/ValueItem';

class DepositionDetails extends PureComponent {
  static propTypes = {
    deposition: PropTypes.object.isRequired,
    trans: PropTypes.func.isRequired,
  };

  render() {
    const { deposition, trans } = this.props;
    const { position } = deposition;

    return (
      <div className="depositions-details">
        <div className="row mb-15">
          <div className="col-4">
            <Item label="deposition.label.id">{deposition.id}</Item>
          </div>
          <div className="col-4">
            <Item label="deposition.label.name">{deposition.name}</Item>
          </div>
          <div className="col-4">
            <Item
              label="deposition.label.perimeter"
              suffix={trans('deposition.perimeter.suffix', 'km')}
            >
              {deposition.perimeter}
            </Item>
          </div>
        </div>
        <div className="panel-hr" />
        <div className="row">
          <div className="col-5">
            {!!(deposition.street || deposition.position.lat) && (
              <Item label="deposition.label.address">
                <p>
                  {deposition.street}
                  <br />
                  {deposition.postal_code} {deposition.city}
                </p>
                <p>
                  Latitude: {deposition.position.lat}
                  <br />
                  Longitude: {deposition.position.lng}
                </p>
              </Item>
            )}
            {!!deposition.hint && (
              <Item label="deposition.label.hint">
                <p>{deposition.hint}</p>
              </Item>
            )}
          </div>
          <div className="col-7">
            {!!position &&
              !!position.lat &&
              !!position.lng && (
                <GoogleMap center={deposition.position}>
                  <Marker position={deposition.position} />
                </GoogleMap>
              )}
          </div>
        </div>
      </div>
    );
  }
}

export default DepositionDetails;
