import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Growl } from 'primereact/components/growl/Growl';

import {
  getNotifications,
  removeNotification,
  markAsShown,
} from 'modules/notifications';
import withTrans from 'components/hoc/withTrans';

class Notifications extends PureComponent {
  static propTypes = {
    notifications: PropTypes.array,
    history: PropTypes.object,
  };

  static childContextTypes = {
    notify: PropTypes.func,
  };

  getChildContext() {
    return {
      notify: this.notify,
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.notifications);
    if (nextProps.notifications !== this.props.notifications) {
      this.notify(nextProps.notifications);
    }
  }

  createMessage = ({ summary, detail, values, ...message }) => {
    const { trans } = this.props;
    return {
      ...message,
      closable: true,
      summary:
        typeof summary === 'string' ? trans(summary, false, values) : summary,
      detail:
        typeof detail === 'string' ? trans(detail, false, values) : detail,
    };
  };

  notify = messages => {
    const notifications = (Array.isArray(messages) ? messages : [messages]).map(
      this.createMessage
    );
    if (this.growl && notifications.length) {
      this.growl.show(notifications);
      notifications.forEach(
        n => n.message_id && this.props.markAsShown(n.message_id)
      );
    }
  };

  onGrowlMount = growl => {
    this.growl = growl;
  };

  onMessageRemove = ({ message_id }) => {
    message_id && this.props.removeNotification(message_id);
  };

  onMessageClick = ({ link }) => {
    link && this.props.history.push(link);
  };

  render() {
    return (
      <Growl
        ref={this.onGrowlMount}
        onRemove={this.onMessageRemove}
        onClick={this.onMessageClick}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    notifications: getNotifications(state),
  };
};
const actions = { removeNotification, markAsShown };
export default withTrans(connect(mapStateToProps, actions)(Notifications));
