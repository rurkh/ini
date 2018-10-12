import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';

import Item from 'components/data/ValueItem';
import LinkButton from 'components/common/LinkButton';

class DistrictDetails extends PureComponent {
  static propTypes = {
    district: PropTypes.object.isRequired,
    baseUrl: PropTypes.string,
  };

  static defaultProp = {
    baseUrl: '/districts',
  };

  render() {
    const { district, trans, match } = this.props;
    const baseUrl = match ? match.path : this.props.getBaseUrl();
    return (
      <Fragment>
        <div className="row">
          <div className="col-7">
            <div className="item-columns">
              <Item label="district.label.distance">{district.distance}</Item>

              <Item label="district.label.means_of_transportation">
                {district.means_of_transportation}
              </Item>

              <Item label="district.label.region_manager_name">
                {district.region_manager_name}
              </Item>

              <div className="py-15" />

              <Item label="district.label.latest_start_time">
                {district.latest_start_time}
              </Item>
              <Item
                label="district.label.nominal_delivery_time"
                suffix={trans('district.nominal_delivery_time.suffix', 'min')}
              >
                {district.nominal_delivery_time}
              </Item>
              <Item
                label="district.label.alarm_threshold"
                suffix={trans('district.alarm_threshold.suffix', 'min')}
              >
                {district.alarm_threshold}
              </Item>
            </div>
          </div>
          <div className="col-5">
            <div className="district-details__buttons">
              <LinkButton
                className="btn-outline"
                icon="ui-icon-streetview"
                iconPos="left"
                to={`${baseUrl}/${district.id}/shape`}
              >
                {trans('district.button.shape_of_district')}
              </LinkButton>

              <LinkButton
                className="btn-outline"
                icon="ui-icon-map"
                iconPos="left"
                to={`${baseUrl}/${district.id}/routes/optimal`}
              >
                {trans('district.button.optimum_route')}
              </LinkButton>
              <LinkButton
                className="btn-outline"
                icon="ui-icon-map"
                iconPos="left"
                to={`${baseUrl}/${district.id}/routes/latest`}
              >
                {trans('district.button.last_route')}
              </LinkButton>
            </div>
          </div>
        </div>
        <div className="panel-hr" />
        <div className="row mt-15">
          <div className="col-6">
            {!!district.deposition.street && (
              <Item label="district.label.deposition">
                <p>
                  {district.deposition.street},
                  <br />
                  {district.deposition.postal_code} {district.deposition.city}
                </p>
              </Item>
            )}
          </div>
          <div className="col-4">
            {!!district.deposition.hint && (
              <Item label="district.label.hint">
                <p>{district.deposition.hint}</p>
              </Item>
            )}
          </div>
          <div className="col-auto ml-auto align-self-center text-right">
            <LinkButton
              icon="ui-icon-location-on"
              className="location-btn"
              to={`${baseUrl}/${district.id}/location`}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default DistrictDetails;
