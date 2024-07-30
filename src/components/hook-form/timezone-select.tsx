// eslint-disable-next-line import/no-extraneous-dependencies
import { RHFAutocomplete } from './rhf-autocomplete';

// Get the list of timezones
const timezones = [
  '-4:00 GMT',
  '-3:30 GMT',
  '-2:00 GMT',
  '-2:30 GMT',
  '-1:00 GMT',
  '-1:30 GMT',
  '0:00 GMT',
  '0:30 GMT',
  '1:00 GMT',
  '1:30 GMT',
  '2:00 GMT',
  '2:30 GMT',
  '3:00 GMT',
  '3:30 GMT',
  '4:00 GMT',
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
