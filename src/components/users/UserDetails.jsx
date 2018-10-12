import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _compact from 'lodash/compact';
import format from 'date-fns/format';
import differenceInYears from 'date-fns/difference_in_years';
import { FormattedMessage } from 'react-intl';

import Item from 'components/data/ValueItem';
import withTrans from 'components/hoc/withTrans';

class UserDetails extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
  };

  static defaultProps = {
    user: {},
  };

  calculateAge = birthday => {
    return differenceInYears(new Date(), birthday);
  };

  formatBirthDay = bday => format(bday, 'DD.MM.YYYY');

  mapText = elements => _compact(elements).join(', ');

  renderRepresentations() {
    const { representations } = this.props.user;

    return representations.filter(item => !!item).map(user => (
      <Link key={user.username} to={`/users/${user.username}`}>
        <span>{`${user.firstname} ${user.lastname}`}</span>
      </Link>
    ));
  }

  render() {
    const { user, trans } = this.props;
    const emailNotify = user.email_notification ? 'Email' : null;
    const smsNotify = user.sms_notification ? 'SMS' : null;
    const pushNotify = user.push_notification ? 'Push' : null;
    const roles = user.user_roles.map(item => trans(`app.roles.${item}`));

    return (
      <div className="user-details">
        <h3 className="user-details__title">
          {user.firstname} {user.lastname}
        </h3>

        <div className="py-10" />

        <Item label="user.gender">{user.gender}</Item>

        <Item label="user.address">
          {!!user.street && (
            <span>
              <p>{user.street}</p>
              <p>
                {user.postcode} {user.city}
              </p>
            </span>
          )}
        </Item>

        <Item label="user.phone">{user.phone}</Item>

        <Item label="user.email">
          {!!user.email && <a href={`mailto:${user.email}`}> {user.email}</a>}
        </Item>

        {!!user.birthdate && (
          <Fragment>
            <div className="py-10" />

            <Item label="user.birthdate">
              {this.formatBirthDay(user.birthdate)}
            </Item>

            <Item label="user.age">
              <FormattedMessage
                id="user.years"
                values={{
                  years: this.calculateAge(user.birthdate),
                }}
                defaultMessage="{years} Years"
              />
            </Item>
          </Fragment>
        )}

        <div className="py-10" />

        <Item label="user.messagingMethods">
          {this.mapText([emailNotify, smsNotify, pushNotify])}
        </Item>

        <div className="py-10" />

        <Item label="user.role">{this.mapText(roles)}</Item>

        <Item label="user.tags">{this.mapText(user.tags)}</Item>

        {!!user.representations.length && (
          <Fragment>
            <div className="py-10" />
            <Item label="user.representations" className="user-detail-links">
              {this.renderRepresentations()}
            </Item>
          </Fragment>
        )}

        {!!user.districts.length && (
          <Fragment>
            <div className="py-10" />
            <Item label="user.districts" className="user-detail-links">
              {user.districts.map(item => (
                <Link key={item.id} to={`/districts/${item.id}`}>
                  <span>{item.name}</span>
                </Link>
              ))}
            </Item>
          </Fragment>
        )}
      </div>
    );
  }
}

export default withTrans(UserDetails);
