import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Column } from 'primereact/components/column/Column';
import formatDate from 'date-fns/format';

import DataTable from 'components/data/DataTable';
import DateFilter from 'components/filters/DateFilter';

class MessagesTable extends PureComponent {
  static propTypes = {
    messages: PropTypes.array,
    trans: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  renderDateLabel = ({ created_at }) =>
    formatDate(created_at, 'DD.MM.YY — HH:mm');

  render() {
    const { trans, isLoading, messages } = this.props;

    return (
      <Fragment>
        <DateFilter {...this.props} />
        <div className="data-table">
          <DataTable
            loading={isLoading && !messages.length}
            value={messages}
            selectionMode="single"
            rows={messages.length}
          >
            <Column field="message" header={trans('messages.column.message')} />
            <Column
              header={trans('messages.column.date')}
              body={this.renderDateLabel}
            />
            <Column field="sender" header={trans('messages.column.from')} />
          </DataTable>
        </div>
      </Fragment>
    );
  }
}

export default MessagesTable;
