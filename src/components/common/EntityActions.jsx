import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import LinkButton from 'components/common/LinkButton';
import ConfirmButton from 'components/form/ConfirmButton';
import withTrans from 'components/hoc/withTrans';

class EntityActions extends PureComponent {
  static propTypes = {
    iconType: PropTypes.oneOf(['button', 'link']),
    entity: PropTypes.object.isRequired,
    editUrl: PropTypes.string,
    onDelete: PropTypes.func,
    confirmDialogHeader: PropTypes.string,
    confirmDialogContent: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]),
  };
  static defaultProps = {
    iconType: 'button',
  };

  onTrashClick = () => {
    const { onDelete, entity } = this.props;
    onDelete(entity);
  };

  render() {
    const {
      entity: { can_edit, can_delete },
      entity,
      entityName,
      editUrl,
      onDelete,
      iconType,
      trans,
    } = this.props;
    const buttonClasses = {
      'btn-sm btn-link': iconType === 'link',
    };
    const isEditButton = editUrl && can_edit !== false;
    const isDeleteButton = onDelete && can_delete !== false;

    const confirmDialogHeader = trans(
      `${entityName}.delete_confirm.header`,
      `Delete ${entityName}`,
      entity
    );
    const confirmDialogContent = trans(
      `${entityName}.delete_confirm.content`,
      `Are you sure you want to delete this ${entityName}`,
      entity
    );

    return (
      <Fragment>
        {isEditButton && (
          <LinkButton
            icon="ui-icon-edit"
            className={classNames('cyan-btn', buttonClasses)}
            to={editUrl}
          />
        )}
        {isDeleteButton && (
          <ConfirmButton
            icon="ui-icon-trash"
            confirmDialogHeader={confirmDialogHeader}
            confirmDialogContent={confirmDialogContent}
            onConfirm={this.onTrashClick}
            className={classNames('red-btn', buttonClasses)}
          />
        )}
      </Fragment>
    );
  }
}

export default withTrans(EntityActions);
