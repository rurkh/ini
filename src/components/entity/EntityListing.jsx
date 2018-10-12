import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';

class EntityListing extends PureComponent {
  static propTypes = {
    entitiesProp: PropTypes.string.isRequired,
    entityName: PropTypes.string.isRequired,
    entityKey: PropTypes.string.isRequired,
    baseUrl: PropTypes.string,
    history: PropTypes.object.isRequired,
    children: PropTypes.func.isRequired,
    createComponent: PropTypes.func,
    editComponent: PropTypes.func,
  };

  getBaseUrl = () => {
    const { entityName, baseUrl } = this.props;
    return baseUrl || `/${entityName}s`;
  };

  onRowSelect = ({ data }) => {
    const { history, entityKey } = this.props;
    const baseUrl = this.getBaseUrl();
    history.push(`${baseUrl}/${data[entityKey]}`);
  };

  render() {
    const {
      entitiesProp,
      entityName,
      children,
      entityKey,
      createComponent: CreateComponent,
      editComponent: EditComponent,
      ...props
    } = this.props;

    const entities = props[entitiesProp];
    const entityId = props.match.params[entityName];
    const baseUrl = this.getBaseUrl();
    let selection = null;

    if (!entityId) {
      selection = entities[0];
    } else if (entities.length) {
      selection =
        entities.find(e => `${e[entityKey]}` === entityId) || entities[0];
    }

    const childProps = {
      ...props,
      selection,
      entityName,
      entityKey,
      getBaseUrl: this.getBaseUrl,
      onRowSelect: this.onRowSelect,
    };

    return (
      <Fragment>
        {children(childProps)}

        <Switch>
          {!!(selection && EditComponent) && (
            <Route
              path={`${baseUrl}/:${entityName}/edit`}
              render={props => (
                <EditComponent {...props} {...{ [entityName]: selection }} />
              )}
            />
          )}
          {!!CreateComponent && (
            <Route path={`${baseUrl}/create`} component={CreateComponent} />
          )}
        </Switch>
      </Fragment>
    );
  }
}

export default EntityListing;
