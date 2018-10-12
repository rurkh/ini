import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Marker } from 'react-google-maps';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';

import Dialog from 'components/dialog/Dialog';
import GoogleMap from 'components/common/GoogleMap';
import transMsg from 'utils/transMsg';

class DistrictDepositionLocationDialog extends PureComponent {
  static propTypes = {
    deposition: PropTypes.objectOf(PropTypes.any).isRequired,
    intl: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  static defaultProps = {
    deposition: {},
  };

  closeDialog = () => {
    this.props.history.goBack();
  };

  trans = id => this.props.intl.formatMessage(transMsg(id));

  render() {
    const { deposition: { position } } = this.props;
    const header = 'districts.deposition.location.header';

    return (
      <Dialog
        header={this.trans(header)}
        visible
        modal
        onHide={this.closeDialog}
      >
        <GoogleMap center={position}>
          <Marker position={position} />
        </GoogleMap>
      </Dialog>
    );
  }
}

export default withRouter(injectIntl(DistrictDepositionLocationDialog));
