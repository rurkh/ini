import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { AutoComplete } from 'primereact/components/autocomplete/AutoComplete';

import { getTags } from 'modules/core/enum';

class TagsField extends Component {
  static propTypes = {
    tags: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    tags: [],
  };

  state = { suggestions: [] };

  suggestTags = ({ query }) => {
    const suggestions = this.props.tags.filter(tag =>
      tag.toLowerCase().startsWith(query.toLowerCase())
    );
    // Allow to add new tag by adding the entered query into a suggestions list.
    if (!suggestions.includes(query)) {
      suggestions.unshift(query);
    }
    this.setState({ suggestions });
  };

  render() {
    const { tags, ...props } = this.props;
    const { suggestions } = this.state;

    return (
      <AutoComplete
        multiple
        suggestions={suggestions}
        completeMethod={this.suggestTags}
        {...props}
      />
    );
  }
}

export default connect(state => ({
  tags: getTags(state),
}))(TagsField);
