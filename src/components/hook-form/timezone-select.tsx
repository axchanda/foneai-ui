// eslint-disable-next-line import/no-extraneous-dependencies
import { tz } from 'moment-timezone';
import { RHFAutocomplete } from './rhf-autocomplete';

// Get the list of timezones
const timezones = tz.names();

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
