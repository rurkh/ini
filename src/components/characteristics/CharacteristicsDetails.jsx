import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GoogleMap from 'components/common/GoogleMap';
import { Marker } from 'react-google-maps';
import _compact from 'lodash/compact';

class CharacteristicsDetails extends Component {
  static propTypes = {
    characteristic: PropTypes.object,
  };

  renderLocationLabel = () => {
    let { street, postal_code, city } = this.props.characteristic;
    return _compact([street, postal_code, city]).join(', ');
  };

  render() {
    const { trans, characteristic: { hint, image, position } } = this.props;

    return (
      <div className="form-fields">
        <div className="row">
          <div className="col-6">
            <div className="form-item">
              <div className="item--label">{trans('characteristic.hint')}</div>
              <div className="item--value">{hint}</div>
            </div>
            <div className="form-item">
              <div className="dropzone dropzone-uploaded">
                <img src={image} alt="" />
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="form-item">
              <div className="item--label">
                {trans('characteristic.location')}
              </div>
              <div className="item--value">{this.renderLocationLabel()}</div>
            </div>
            <div className="form-item">
              <GoogleMap center={position}>
                <Marker position={position} />
              </GoogleMap>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CharacteristicsDetails;
