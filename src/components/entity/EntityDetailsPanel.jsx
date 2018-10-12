import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import EntityActions from 'components/common/EntityActions';
import Panel from 'components/common/Panel';

class EntityDetailsPanel extends PureComponent {
  static propTypes = {
    entityName: PropTypes.string.isRequired,
    entityKey: PropTypes.string.isRequired,
    getBaseUrl: PropTypes.func.isRequired,
    entity: PropTypes.object,
    children: PropTypes.any,
    onDelete: PropTypes.func,
  };

  onDelete = () => {
    this.props.onDelete(this.props.entity);
  };

  render() {
    const {
      entityName,
      entityKey,
      entity,
      children,
      getBaseUrl,
      ...props
    } = this.props;
    if (!entity) {
      return null;
    }

    const title = props.trans(
      `${entityName}.details.header`,
      `Details for selected ${entityName}`,
      entity
    );
    const actions = (
      <EntityActions
        entity={entity}
        entityName={entityName}
        editUrl={`${getBaseUrl()}/${entity[entityKey]}/edit`}
        onDelete={this.onDelete}
      />
    );

    return (
      <Panel title={title} actions={actions}>
        {children}
      </Panel>
    );
  }
}

export default EntityDetailsPanel;
