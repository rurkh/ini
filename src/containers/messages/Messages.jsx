import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { FormattedMessage } from 'react-intl';
import withTrans from 'components/hoc/withTrans';
import subDays from 'date-fns/sub_days';
import startOfDay from 'date-fns/start_of_day';
import endOfDay from 'date-fns/end_of_day';
import formatDate from 'date-fns/format';

import MessagesTable from 'components/messages/MessagesTable';
import Panel from 'components/common/Panel';
import PageTitle from 'components/common/PageTitle';
import EntityListing from 'components/entity/EntityListing';

import {
  fetchMessages,
  getMessagesList,
  isMessagesLoading,
  getMessagesError,
} from 'modules/messages/messages';

const today = new Date();

const entityListingProps = {
  entitiesProp: 'messages',
  entityName: 'message',
  entityKey: 'id',
};

const MessagesListing = compose(
  connect(
    (state, props) => ({
      messages: getMessagesList(state, props),
      isLoading: isMessagesLoading(state),
      error: getMessagesError(state),
    }),
    { fetchMessages }
  ),
  lifecycle({
    componentWillMount() {
      const { category, fetchMessages, date_from, date_to } = this.props;

      fetchMessages(
        category,
        formatDate(date_from, 'YYYY-MM-DD'),
        formatDate(date_to, 'YYYY-MM-DD')
      );
    },
    componentWillReceiveProps(nextProps) {
      const { category, date_from, date_to, fetchMessages } = this.props;
      if (
        category !== nextProps.category ||
        date_from !== nextProps.date_from ||
        date_to !== nextProps.date_to
      ) {
        fetchMessages(
          nextProps.category,
          formatDate(nextProps.date_from, 'YYYY-MM-DD'),
          formatDate(nextProps.date_to, 'YYYY-MM-DD')
        );
      }
    },
  })
)(EntityListing);

class Messages extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  initialState = {
    date_from: startOfDay(subDays(today, 7)),
    date_to: endOfDay(today),
  };

  state = { ...this.initialState };

  componentWillReceiveProps(nextProps) {
    const { match: { params: { category } } } = this.props;
    if (category !== nextProps.match.params.category) {
      this.setState({ ...this.initialState });
    }
  }

  handleChangeDateFrom = ({ value }) => {
    this.setState({ date_from: value });
  };

  handleChangeDateTo = ({ value }) => {
    this.setState({ date_to: value });
  };

  getTabsItems = header => [
    { href: '/messages/inbox', label: header.inbox },
    { href: '/messages/sent', label: header.sent },
  ];

  renderContent = props => {
    const header = {
      inbox: props.trans('messages.tab_header.my_inbox'),
      sent: props.trans('messages.tab_header.my_sent_messages'),
    };
    return (
      <Fragment>
        <div className="col-12 col-lg-6 mb-20 mb-lg-0">
          <Panel tabs={this.getTabsItems(header)}>
            <MessagesTable
              header={header[props.category]}
              onChangeDateFrom={this.handleChangeDateFrom}
              onChangeDateTo={this.handleChangeDateTo}
              {...props}
            />
          </Panel>
        </div>
        <div className="col-12 col-lg-6">
          <div className="panel messages-details">details</div>
        </div>
      </Fragment>
    );
  };

  render() {
    const { match: { params: { category } } } = this.props;

    return (
      <div className="row">
        <div className="col-12">
          <PageTitle icon="message">
            <FormattedMessage
              id="messages.page_title"
              defaultMessage="Messages"
            />
          </PageTitle>
        </div>
        <MessagesListing
          {...this.props}
          {...this.state}
          {...entityListingProps}
          category={category}
        >
          {this.renderContent}
        </MessagesListing>
      </div>
    );
  }
}

export default withTrans(Messages);
