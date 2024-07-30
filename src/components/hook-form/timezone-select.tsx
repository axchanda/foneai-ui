// eslint-disable-next-line import/no-extraneous-dependencies
import { RHFAutocomplete } from './rhf-autocomplete';

// Get the list of timezones
const timezones = [
  'GMT-12:00',
  'GMT-11:00',
  'GMT-10:00',
  'GMT-09:00',
  'GMT-08:00',
  'GMT-07:00',
  'GMT-06:00',
  'GMT-05:00',
  'GMT-04:00',
  'GMT-03:00',
  'GMT-02:00',
  'GMT-01:00',
  'GMT+00:00',
  'GMT+01:00',
  'GMT+02:00',
  'GMT+03:00',
  'GMT+04:00',
  'GMT+05:00',
  'GMT+06:00',
  'GMT+07:00',
  'GMT+08:00',
  'GMT+09:00',
  'GMT+10:00',
  'GMT+11:00',
  'GMT+12:00',
];

type TimezoneSelectProps = {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: React.ReactNode;
};

export function TimezoneSelect({ name, label, placeholder, helperText }: TimezoneSelectProps) {
  return (
    <RHFAutocomplete
      name={name}
      label={label}
      placeholder={placeholder}
      options={timezones}
      getOptionLabel={(option) => option}
      helperText={helperText}
      renderOption={(props, option) => (
        <li {...props} key={option}>
          {option}
        </li>
      )}
    />
  );
}
