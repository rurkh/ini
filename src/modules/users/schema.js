import { object, string, array, boolean, mixed, date } from 'yup';
import formatDate from 'date-fns/format';
import { isValidBirthdate } from 'components/form/BirthdateField';

const msgRequired = 'app.validation.field_required';
const msgPhone = 'app.validation.invalid_phone';
const msgEmail = 'app.validation.invalid_email';
const msgBirthday = 'app.validation.invalid_birthdate_range';
const msgPostcode = 'app.validation.invalid_postcode';

const validateDate = value =>
  value ? isValidBirthdate(new Date(value)) : true;

export default object()
  .shape({
    username: string()
      .ensure()
      .required(msgRequired)
      .trim(),

    firstname: string()
      .ensure()
      .required(msgRequired)
      .trim(),

    lastname: string()
      .ensure()
      .required(msgRequired)
      .trim(),

    gender: string()
      .ensure()
      .required(msgRequired)
      .oneOf(['female', 'male'], msgRequired),

    password: string().when('$mode', (mode, schema) => {
      return mode === 'create' ? schema.required(msgRequired) : schema;
    }),

    street: string()
      .ensure()
      .nullable()
      .trim(),

    postcode: string()
      .ensure()
      .nullable()
      .max(20, msgPostcode)
      .trim(),
    city: string()
      .ensure()
      .nullable()
      .trim(),

    phone: string()
      .ensure()
      .nullable()
      .when('sms_notification', {
        is: true,
        then: string().required(msgRequired),
        otherwise: string(),
      })
      .matches(/^(\+?\d+)?$/, msgPhone)
      .max(15, msgPhone),

    email: string()
      .ensure()
      .nullable()
      .email(msgEmail)
      .when('email_notification', {
        is: true,
        then: string().required(msgRequired),
        otherwise: string(),
      }),
    tags: array()
      .ensure()
      .nullable()
      .of(string()),

    birthdate: mixed().when('$mode', mode => {
      return ['list', 'form'].includes(mode)
        ? date().nullable()
        : string()
            .nullable()
            .test('birthdate', msgBirthday, validateDate)
            .transform(value => (value ? formatDate(value, 'YYYY-MM-DD') : ''));
    }),
    sms_notification: boolean()
      .nullable()
      .default(false),
    email_notification: boolean()
      .nullable()
      .default(false),
    push_notification: boolean()
      .nullable()
      .when(
        '$mode',
        (mode, schema) =>
          mode === 'form' ? schema.default(true) : schema.default(false)
      ),

    notifications: boolean()
      .default(false)
      .when('$mode', (mode, schema) => {
        if (['create', 'edit'].includes(mode)) {
          return schema
            .test('notifications', msgRequired, function() {
              const {
                sms_notification,
                email_notification,
                push_notification,
              } = this.parent;
              return (
                sms_notification || email_notification || push_notification
              );
            })
            .strip();
        }
        return schema;
      }),
    user_roles: array()
      .of(string())
      .ensure()
      .when(
        '$mode',
        (mode, schema) =>
          mode === 'list' ? schema : schema.required(msgRequired)
      ),

    representations: array().when(
      '$mode',
      (mode, schema) =>
        mode === 'list'
          ? schema.ensure()
          : schema.nullable().transform(value => {
              return value.map(r => (typeof r === 'object' ? r.username : r));
            })
    ),

    districts: array().when(
      '$mode',
      (mode, schema) => (mode === 'list' ? schema.ensure() : schema.strip())
    ),
  })
  .from('roles', 'user_roles');
