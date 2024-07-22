import { Controller, useFormContext } from 'react-hook-form';

import { Editor } from '../editor';

import type { EditorProps } from '../editor';

// ----------------------------------------------------------------------

type Props = EditorProps & {
  name: string;
  showToolbar?: boolean
  height?: number
};

export function RHFEditor({ name, helperText, showToolbar = true, height = 400, ...other }: Props) {
  const {
    control,
    formState: { isSubmitSuccessful },
  } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Editor
          {...field}
          error={!!error}
          helperText={error?.message ?? helperText}
          resetValue={isSubmitSuccessful}
          // showToolbar={showToolbar}
          // height={height}
          {...other}
        />
      )}
    />
  );
}
