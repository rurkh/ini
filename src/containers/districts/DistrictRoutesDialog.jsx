import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Polyline } from 'react-google-maps';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Spinner from 'react-svg-spinner';

import Dialog from 'components/dialog/Dialog';
import { apiClient } from 'utils/api';
import { getAccessToken } from 'modules/auth';
import GoogleMap from 'components/common/GoogleMap';
import withTrans from 'components/hoc/withTrans';

class DistrictRoutesDialog extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        district: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        kind: PropTypes.oneOf([`latest`, `optimal`]).isRequired,
      }).isRequired,
    }).isRequired,
  };

  state = {
    isLoading: true,
    error: '',
    path: [],
  };

  componentDidMount() {
    const { match: { params: { district, kind } }, token } = this.props;
    apiClient
      .request({
        url: `/routes/${kind}/${district}?token=${token}`,
      })
      .then(({ data: { data: res } }) => {
        this.setState({
          isLoading: false,
          path: res,
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false,
          error: error.message,
        });
      });
  }

  closeDialog = () => {
    this.props.history.goBack();
  };

  mapLoaded = map => {
    if (!map) {
      return;
    }
    const { path } = this.state;
    const bounds = new window.google.maps.LatLngBounds();
    path.forEach(function(point, index) {
      bounds.extend(new window.google.maps.LatLng(point.lat, point.lng));
    });
    map.fitBounds(bounds);
  };

  render() {
    const { trans, match: { params } } = this.props;
    const { isLoading, path, error } = this.state;

    return (
      <Dialog
        header={trans('districts.route.header', '{kind} Route', params)}
        width="650px"
        visible
        modal
        onHide={this.closeDialog}
      >
        {isLoading && (
          <div className="spinner-container my-25 d-flex justify-content-center">
            <Spinner size="64px" color="#00AADB" />
          </div>
        )}
        {error && (
          <div className="ui-message ui-message-error">
            {trans(error || 'app.routes_map.loading_error')}
          </div>
        )}
        {!isLoading &&
          !error && (
            <GoogleMap mapLoaded={this.mapLoaded} zoom={14}>
              <Polyline path={path} />
            </GoogleMap>
          )}
      </Dialog>
    );
  }
}

export default compose(
  connect(state => ({ token: getAccessToken(state) })),
  withTrans
)(DistrictRoutesDialog);
