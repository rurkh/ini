import { object, string, number, mixed } from 'yup';
import formatDate from 'date-fns/format';

const msgRequired = 'app.validation.required_field';
const msgManager = 'app.validation.invalid_deliverer_manager';

export default object().shape({
  id: string()
    .ensure()
    .required(msgRequired)
    .trim(),

  name: string()
    .ensure()
    .required(msgRequired)
    .trim(),

  nominal_delivery_time: number()
    .positive()
    .integer()
    .default(0)
    .required(msgRequired),

  latest_start_time: mixed().when('$mode', (mode, schema) => {
    if (mode === 'form') {
      return schema.nullable().transform(value => {
        if (typeof value === 'string' && value) {
          const [hours, minutes] = value.split(':');
          const date = new Date();
          hours && date.setHours(hours);
          minutes && date.setMinutes(minutes);
          return date;
        } else if (value instanceof Date && !isNaN(value.getTime())) {
          return value;
        }
      });
    } else {
      return string()
        .ensure()
        .nullable()
        .transform(
          value => (value instanceof Date ? formatDate(value, 'HH:mm') : value)
        );
    }
  }),

  distance: number()
    .positive()
    .required()
    .default(0),

  means_of_transportation: string()
    .ensure()
    .nullable()
    .trim(),

  deposition: mixed().when('$mode', {
    is: 'list',
    then: object({
      id: string()
        .ensure()
        .required(),
      name: string()
        .ensure()
        .required(),
    }).default({}),
    otherwise: string()
      .transform(value => {
        return typeof value === 'object' ? value.id : value;
      })
      .required(msgRequired),
  }),

  deliverer_manager: string()
    .ensure()
    .required(msgRequired)
    .min(3, msgManager),

  // region_manager: string().ensure(),

  alarm_threshold: number()
    .integer()
    .when(
      '$mode',
      (mode, schema) => (mode === 'form' ? schema.default(20) : schema)
    ),
});
