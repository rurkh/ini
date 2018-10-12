import React, { PureComponent } from 'react';
import { Checkbox } from 'primereact/components/checkbox/Checkbox';
import { RadioButton } from 'primereact/components/radiobutton/RadioButton';

import TextField from 'components/form/TextField';
import RoleField from 'components/form/RoleField';
import TagsField from 'components/form/TagsField';
import FieldFeedback from 'components/form/FieldFeedback';
import UserAutocomplete from 'components/form/UserAutocomplete';
import BirthdateField from 'components/form/BirthdateField';

class UserFormFields extends PureComponent {
  onBirthdayChange = ({ value }) => {
    this.props.setFieldValue('birthdate', value);
  };
  onCheckboxChange = ({ value, checked }) => {
    this.props.setFieldValue(value, checked);
  };
  onTagsChange = ({ value }) => {
    this.props.setFieldValue('tags', value);
  };
  onRepresentationsChange = ({ value }) => {
    this.props.setFieldValue('representations', value);
  };
  onGenderChange = ({ value }) => {
    this.props.setFieldValue('gender', value);
  };
  onRolesChange = ({ name, value }) => {
    this.props.setFieldValue(name, value);
  };

  render() {
    const { mode, trans, values, touched, errors, handleChange } = this.props;

    return (
      <div className="row">
        <div className="col-7">
          <div className="form-group">
            <div className="form-item">
              <TextField
                id="username"
                type="text"
                name="username"
                required
                readOnly={mode === 'edit'}
                label={trans('users.fields.username')}
                onChange={handleChange}
                value={values.username}
                error={touched.username && errors.username}
              />
            </div>
            <div className="form-item">
              <TextField
                id="password"
                type="password"
                name="password"
                required={mode === 'create'}
                label={trans('users.fields.password')}
                value={values.password}
                onChange={handleChange}
              />
            </div>
            <div className="py-10" />
            <div className="form-item">
              <TextField
                id="firstname"
                type="text"
                name="firstname"
                required
                label={trans('users.fields.firstname')}
                onChange={handleChange}
                value={values.firstname}
                error={touched.firstname && errors.firstname}
              />
            </div>
            <div className="form-item">
              <TextField
                id="lastname"
                type="text"
                name="lastname"
                required
                label={trans('users.fields.lastname')}
                onChange={handleChange}
                value={values.lastname}
                error={touched.lastname && errors.lastname}
              />
            </div>
            <div className="form-item row">
              <div className="col-5">
                <span className="md-inputfield">
                  <BirthdateField
                    id="birthdate"
                    label={trans('users.fields.birthdate')}
                    onSelect={this.onBirthdayChange}
                    value={values.birthdate}
                    error={touched.birthdate && errors.birthdate}
                  />
                </span>
              </div>
              <div className="col-7">
                <span className="md-inputfield">
                  <label htmlFor="gender">
                    {trans('users.fields.gender')}
                    <span className="field-required">*</span>
                  </label>
                </span>
                <div className="checkbox-wrapper checkbox-wrapper-6">
                  <RadioButton
                    value="male"
                    name="gender"
                    inputId="gender.male"
                    checked={values.gender === 'male'}
                    onChange={this.onGenderChange}
                  />
                  <label htmlFor="gender.male">
                    {trans('users.gender.male')}
                  </label>
                </div>
                <div className="checkbox-wrapper checkbox-wrapper-6">
                  <RadioButton
                    value="female"
                    name="gender"
                    inputId="gender.female"
                    checked={values.gender === 'female'}
                    onChange={this.onGenderChange}
                  />
                  <label htmlFor="gender.female">
                    {trans('users.gender.female')}
                  </label>
                </div>
                <FieldFeedback error={touched.gender && errors.gender} />
              </div>
            </div>
            <div className="py-10" />
            <div className="form-item">
              <TextField
                id="street"
                type="text"
                name="street"
                label={trans('users.fields.street')}
                onChange={handleChange}
                value={values.street}
                error={touched.street && errors.street}
              />
            </div>
            <div className="form-item row">
              <div className="col-4">
                <TextField
                  id="postcode"
                  type="text"
                  name="postcode"
                  size="35"
                  label={trans('users.fields.postcode')}
                  onChange={handleChange}
                  value={values.postcode}
                  error={touched.postcode && errors.postcode}
                />
              </div>
              <div className="col-8">
                <TextField
                  id="city"
                  type="text"
                  name="city"
                  label={trans('users.fields.city')}
                  onChange={handleChange}
                  value={values.city}
                  error={touched.city && errors.city}
                />
              </div>
            </div>
            <div className="py-10" />
            <div className="form-item">
              <span className="md-inputfield">
                <label htmlFor="tags">{trans('users.fields.tags')}</label>
                <TagsField
                  id="tags"
                  minLength={3}
                  value={values.tags}
                  onChange={this.onTagsChange}
                />
                <FieldFeedback error={touched.tags && errors.tags} />
              </span>
            </div>
            <div className="form-item">
              <span className="md-inputfield">
                <label htmlFor="representations">
                  {trans('user.fields.representations')}
                </label>
                <UserAutocomplete
                  multiple
                  minLength={3}
                  value={values.representations}
                  onChange={this.onRepresentationsChange}
                />
              </span>
            </div>
          </div>
        </div>
        <div className="col-5">
          <div className="form-group">
            <div className="form-item">
              <TextField
                id="phone"
                type="text"
                name="phone"
                required={values.sms_notification}
                label={trans('users.fields.phone')}
                onChange={handleChange}
                value={values.phone}
                error={touched.phone && errors.phone}
              />
            </div>
            <div className="form-item">
              <TextField
                id="email"
                type="email"
                name="email"
                required={values.email_notification}
                label={trans('users.fields.email')}
                onChange={handleChange}
                value={values.email}
                error={touched.email && errors.email}
              />
            </div>
            <div className="py-10" />
            <div className="form-item">
              <span className="md-inputfield">
                <label>
                  {trans('users.fields.messaging_methods')}
                  <span className="field-required">*</span>
                </label>
              </span>
              <div className="checkbox-wrapper">
                <Checkbox
                  inputId="email_notification"
                  name="email_notification"
                  value="email_notification"
                  onChange={this.onCheckboxChange}
                  checked={values.email_notification}
                />
                <label htmlFor="email_notification">
                  {trans('users.messaging_method.email')}
                </label>
              </div>
              <div className="checkbox-wrapper">
                <Checkbox
                  inputId="sms_notification"
                  name="sms_notification"
                  value="sms_notification"
                  onChange={this.onCheckboxChange}
                  checked={values.sms_notification}
                />
                <label htmlFor="sms_notification">
                  {trans('users.messaging_method.sms')}
                </label>
              </div>
              <div className="checkbox-wrapper">
                <Checkbox
                  inputId="push_notification"
                  name="push_notification"
                  value="push_notification"
                  onChange={this.onCheckboxChange}
                  checked={values.push_notification}
                />
                <label htmlFor="push_notification">
                  {trans('users.messaging_method.push')}
                </label>
              </div>
              <FieldFeedback
                error={touched.notifications && errors.notifications}
              />
            </div>
            <div className="py-10" />
            <div className="form-item">
              <RoleField
                name="user_roles"
                required
                label={trans('users.fields.roles')}
                trans={trans}
                value={values.user_roles}
                onChange={this.onRolesChange}
              />
              <FieldFeedback error={touched.user_roles && errors.user_roles} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserFormFields;
