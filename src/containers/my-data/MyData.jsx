import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import withTrans from 'components/hoc/withTrans';
import PageTitle from 'components/common/PageTitle';
import MyDistricts from './MyDistricts';

class MyData extends Component {
  static propTypes = {};

  render() {
    return (
      <div className="row">
        <div className="col-12">
          <PageTitle>
            <FormattedMessage
              id="my_data.page_title"
              defaultMessage="My Data"
            />
          </PageTitle>
        </div>
        <div className="col-12 col-lg-5 mb-20 mb-lg-0">MY TOURDATA</div>
        <MyDistricts />
      </div>
    );
  }
}

export default withTrans(MyData);
