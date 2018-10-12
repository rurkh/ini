import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import Dialog from 'components/dialog/Dialog';
import { injectIntl } from 'react-intl';

import transMsg from 'utils/transMsg';
import CharacteristicsDetails from 'components/characteristics/CharacteristicsDetails';

class CharacteristicsDetailsDialog extends PureComponent {
  static propTypes = {
    characteristic: PropTypes.object,
    history: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
  };

  trans = id => this.props.intl.formatMessage(transMsg(id));

  closeDialog = () => {
    const { history, match: { params: { district } } } = this.props;
    history.push(`/districts/${district}`);
  };

  render() {
    return (
      <Dialog
        header={this.trans('characteristic.header.details')}
        className="characteristic-details"
        width="750px"
        visible
        modal
        onHide={this.closeDialog}
      >
        <CharacteristicsDetails {...this.props} trans={this.trans} />
      </Dialog>
    );
  }
}
const enhancer = compose(injectIntl, withRouter);
export default enhancer(CharacteristicsDetailsDialog);
