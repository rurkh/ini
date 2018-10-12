import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { KmlLayer } from 'react-google-maps';
import { connect } from 'react-redux';

import Dialog from 'components/dialog/Dialog';
import { getAccessToken } from 'modules/auth';
import GoogleMap from 'components/common/GoogleMap';
import withTrans from 'components/hoc/withTrans';

class DistrictShapeDialog extends PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        district: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
      }).isRequired,
    }).isRequired,
  };

  closeDialog = () => {
    this.props.history.goBack();
  };

  render() {
    const { match: { params: { district } }, token, trans } = this.props;
    const apiUrl = `${
      process.env.REACT_APP_API_URL
    }/shape/${district}?token=${token}`;

    return (
      <Dialog
        header={trans('districts.route.header')}
        width="650px"
        visible
        modal
        onHide={this.closeDialog}
      >
        <GoogleMap>
          <KmlLayer url={apiUrl} />
        </GoogleMap>
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({ token: getAccessToken(state) });
export default withTrans(connect(mapStateToProps)(DistrictShapeDialog));
