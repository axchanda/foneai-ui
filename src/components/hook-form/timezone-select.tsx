// eslint-disable-next-line import/no-extraneous-dependencies
import { RHFAutocomplete } from './rhf-autocomplete';

// Get the list of timezones
const timezones = [
  "UTC-12:00",
  "UTC-11:00",
  "UTC-10:00",
  "UTC-09:00",
  "UTC-08:00",
  "UTC-07:00",
  "UTC-06:00",
  "UTC-05:00",
  "UTC-04:00",
  "UTC-03:00",
  "UTC-02:00",
  "UTC-01:00",
  "UTC±00:00",
  "UTC+01:00",
  "UTC+02:00",
  "UTC+03:00",
  "UTC+03:30",
  "UTC+04:00",
  "UTC+04:30",
  "UTC+05:00",
  "UTC+05:30",
  "UTC+05:45",
  "UTC+06:00",
  "UTC+06:30",
  "UTC+07:00",
  "UTC+08:00",
  "UTC+08:45",
  "UTC+09:00",
  "UTC+09:30",
  "UTC+10:00",
  "UTC+10:30",
  "UTC+11:00",
  "UTC+12:00",
  "UTC+12:45",
  "UTC+13:00",
  "UTC+14:00"
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
