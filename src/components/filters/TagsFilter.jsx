import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';

import { getTagsOptions } from 'modules/core/enum';
import trans from 'utils/transMsg';
import MultiSelect from 'components/form/MultiSelect';

class TagsFilter extends PureComponent {
  onChange = e => {
    const { name = 'tags', onChange } = this.props;
    const value = e.value;
    typeof onChange === 'function' && onChange({ target: { name, value } });
  };
  render() {
    const { tags, intl: { formatMessage }, onChange, ...props } = this.props;

    return (
      <MultiSelect
        options={tags}
        name="tags"
        filter
        defaultLabel={formatMessage(trans('app.filters.placeholder.tags'))}
        onChange={this.onChange}
        {...props}
      />
    );
  }
}

const enhance = compose(
  injectIntl,
  connect(state => ({
    tags: getTagsOptions(state),
  }))
);

export default enhance(TagsFilter);
