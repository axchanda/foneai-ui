/* eslint-disable react/prop-types */
/* eslint-disable spaced-comment */
import { z as zod } from 'zod';
import { useMemo, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Field, Form } from 'src/components/hook-form';
import {
  Button,
  Divider,
  MenuList,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  MenuItem,
  IconButton,
  InputAdornment,
  CardHeader,
} from '@mui/material';
import type { IApiEndpointHeaders, IApiEndpointItem } from 'src/types/apiEndpoint';
import API from 'src/utils/API';
import { TableHeadCustom, useTable } from 'src/components/table';
import { useBoolean } from 'src/hooks/use-boolean';
import { Iconify } from 'src/components/iconify';
import { CustomPopover, usePopover } from 'src/components/custom-popover';

export type NewApiEndpointSchemaType = zod.infer<typeof NewApiEndpointSchema>;

export const NewApiEndpointSchema = zod.object({
  apiEndpointName: zod.string().min(1, { message: 'Api Endpoint Name is required!' }),
  apiEndpointURI: zod.string().min(1, { message: 'Api Endpoint URI is required!' })
                  .regex(/^https?:\/\/[a-zA-Z0-9\-\.]+(:[0-9]+)?(\/[a-zA-Z0-9\-._~%!$&'()*+,;=:@]+)*(\/)?(\?[a-zA-Z0-9\-._~%!$&'()*+,;=:@\/?]*)?(#[a-zA-Z0-9\-._~%!$&'()*+,;=:@\/?]*)?$/, {
                    message: 'Invalid URL format!',
                  }),
  apiEndpointDescription: zod.string(),
  apiEndpointMethod: zod.enum(['GET', 'POST', 'PUT', 'DELETE'], {
    required_error: 'Api Endpoint method is required!',
  }),
  apiEndpointTimeout: zod
    .number()
    .min(1, { message: 'timeout is required!' })
    .refine((value) => Number.isInteger(value), {
      message: 'Timeout must be a whole number!',
    }),
  // TODO: HEADERS
});

type Props = {
  currentApiEndpoint?: IApiEndpointItem;
};

export function ApiEndpointNewEditForm({ currentApiEndpoint }: Props) {
  const router = useRouter();
  const [headers, setHeaders] = useState<
    {
      key: string;
      value: string;
    }[]
  >(currentApiEndpoint?.apiEndpointHeaders || []);

  const defaultValues = useMemo(
    () => ({
      apiEndpointName: currentApiEndpoint?.apiEndpointName || '',
      apiEndpointURI: currentApiEndpoint?.apiEndpointURI || '',
      apiEndpointDescription: currentApiEndpoint?.apiEndpointDescription || '',
      apiEndpointMethod: currentApiEndpoint?.apiEndpointMethod || 'POST',
      apiEndpointTimeout: currentApiEndpoint?.apiEndpointTimeout || 60,
    }),
    [currentApiEndpoint]
  );

  const methods = useForm<NewApiEndpointSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewApiEndpointSchema),
    //@ts-ignore
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentApiEndpoint) {
      //@ts-ignore
      reset(defaultValues);
    }
  }, [currentApiEndpoint, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const url = currentApiEndpoint ? `/apiEndpoints/${currentApiEndpoint._id}` : '/apiEndpoints/create';
      const method = currentApiEndpoint ? API.put : API.post;
      await method(url, {
        apiEndpointName: data.apiEndpointName,
        apiEndpointURI: data.apiEndpointURI,
        apiEndpointDescription: data.apiEndpointDescription,
        apiEndpointMethod: data.apiEndpointMethod,
        apiEndpointTimeout: data.apiEndpointTimeout,
        apiEndpointsHeaders : headers,
      });
      reset();
      toast.success(currentApiEndpoint ? 'Updating API Definition success!' : 'Defining API Endpoint success!');
      router.push('/apiEndpoints');
    } catch (error) {
      const messages = Object.values(error.response.data.errors || {}) as string[];
      messages.forEach((m: string) => {
        toast.error(m);
      });
    }
  });

  const renderDetails = (
    <Card>
      <CardHeader title="Details" subheader="API Endpoint name and description" sx={{ mb: 3 }} />

      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">API Endpoint Name</Typography>
          <Field.Text label="" name="apiEndpointName" />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">API Endpoint Description</Typography>

          <Field.Text fullWidth label="" multiline rows={4} name="apiEndpointDescription" />
        </Stack>
      </Stack>
    </Card>
  );


  const renderSpecs = (
    <Card>
      <CardHeader title="Specifications" subheader="API Endpoint Specifications" sx={{ mb: 3 }} />

      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>

        <Stack sx={{ px: 1 }}>
          <Typography variant="subtitle2">Method</Typography>

          <Field.RadioGroup
            name="apiEndpointMethod"
            sx={{ flexDirection: 'row' }} // Add this to make it horizontal
            options={[
              { label: 'GET', value: 'GET' },
              { label: 'POST', value: 'POST' },
              { label: 'PUT', value: 'PUT' },
              { label: 'DELETE', value: 'DELETE' },
            ]}
          />
        </Stack>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">API Endpoint URI</Typography>

          <Field.Text label="" name="apiEndpointURI" />
        </Stack>
        <Stack spacing={4} direction="row">
          <Stack flex={1} spacing={1.5}>
            <Typography variant="subtitle2">Timeout</Typography>
            <Field.Text
              sx={{
                '.MuiInputBase-root': {
                  flexDirection: 'row-reverse',
                },
                width: '20%',
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    sx={{
                      flex: 1,
                      padding: '8px',
                      height: '100%',
                    }}
                    position="end"
                  >
                    seconds
                  </InputAdornment>
                ),
              }}
              type="number"
              label=""
              name="apiEndpointTimeout"
            />
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );

  const renderActions = (
    <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
      <LoadingButton
        type="submit"
        variant="contained"
        size="large"
        loading={isSubmitting}
        sx={{
          mr: 2,
          // make the button to appear on the right side
          marginLeft: 'auto',
        }}
      >
        {!currentApiEndpoint ? 'Create API Definition' : 'Update API Definition'}
      </LoadingButton>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: '1100px' } }}>
        {renderDetails}
        {renderSpecs}
        <HeadersForm headers={headers} setHeaders={setHeaders} />

        {renderActions}
      </Stack>
    </Form>
  );
}

const TABLE_HEAD = [
  // { id: 'checkbox', width: '' },
  { id: 'key', label: 'Key', width: 255 },
  { id: 'value', label: 'Value', width: 255 },
  { id: '', width: 200 },
];

const HeadersForm: React.FC<{
  headers: IApiEndpointItem['apiEndpointHeaders'];
  setHeaders: React.Dispatch<
    React.SetStateAction<
      {
        key: string;
        value: string;
      }[]
    >
  >;
}> = ({ headers, setHeaders }) => {
  const table = useTable();
  const [header, setHeader] = useState<IApiEndpointHeaders>({
    key: '',
    value: '',
  });
  const [headerErrors, setHeaderErrors] = useState<Record<keyof IApiEndpointHeaders, boolean>>({
    key: false,
    value: false,
  });

  // console.log({ headers });

  const shouldShowForm = useBoolean(false);
  return (
    <Card>
      <Stack p={3} direction="row" alignItems="start" justifyContent="space-between">
        <Stack>
          <Typography variant="h5">API Headers</Typography>
          {/* <Typography mt="4px" color="var(--palette-text-secondary)" variant="subtitle2">
            Add parameters to the function. These parameters will be used to pass data to the
            function.
          </Typography> */}
        </Stack>
        <Button
          onClick={() => {
            shouldShowForm.setValue(true);
          }}
          variant="contained"
        >
          Add New Header
        </Button>
      </Stack>

      <Divider />
      <Box p={4}>
        {Boolean(headers.length) || shouldShowForm.value ? (
          <Card>
            <Table>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                numSelected={table.selected.length}
              />
              <TableBody>
                {shouldShowForm.value && (
                  <TableRow>
                    <TableCell
                      sx={{
                        verticalAlign: 'top',
                      }}
                    >
                      <Field.Text
                        name="key"
                        value={header.key}
                        onChange={(e) => {
                          setHeader((prev) => ({
                            ...prev,
                            key: e.target.value,
                          }));
                        }}
                        placeholder="Header key"
                        error={headerErrors.key}
                      />
                    </TableCell>

                    <TableCell
                      sx={{
                        verticalAlign: 'top',
                      }}
                    >
                      <Field.Text
                        value={header.value}
                        onChange={(e) => {
                          setHeader((prev) => ({
                            ...prev,
                            value: e.target.value,
                          }));
                        }}
                        name="value"
                        placeholder="Header value"
                        error={headerErrors.value}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack gap={2}>
                        <Button
                          variant="contained"
                          onClick={() => {
                            let isError = false;
                            if (!header.key || header.key.trim().length < 1) {
                              setHeaderErrors((prev) => ({
                                ...prev,
                                key: true,
                              }));
                              isError = true;
                            }
                            if (!header.value || header.value.trim().length < 1) {
                              setHeaderErrors((prev) => ({
                                ...prev,
                                value: true,
                              }));
                              isError = true;
                            }

                            if (!isError) {
                              setHeaders((prev) => [...prev, header]);
                              setHeader({
                                key: '',
                                value: '',
                              });
                              setHeaderErrors({
                                key: false,
                                value: false,
                              });
                              shouldShowForm.setValue(false);
                            }
                          }}
                          size="large"
                          color="primary"
                          startIcon={<Iconify icon="ic:round-check" />}
                        >
                          Submit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<Iconify icon="ic:round-close" />}
                          size="large"
                          onClick={() => {
                            shouldShowForm.setValue(false);
                            setHeader({
                              key: '',
                              value: '',
                            });
                            setHeaderErrors({
                              key: false,
                              value: false,
                            });
                          }}
                        >
                          Cancel
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )}
                {headers.map((h: IApiEndpointHeaders, index: number) => {
                  return (
                    <HeaderTableRow
                      key={JSON.stringify(h) + index}
                      currentHeader={h}
                      removeHeader={() => {
                        setHeaders((prev) => prev.filter((_, i) => i !== index));
                      }}
                      updateHeader={(newHeader: IApiEndpointHeaders) => {
                        setHeaders((prev) => {
                          const newHeaders = [...prev];
                          newHeaders[index] = newHeader;
                          return newHeaders;
                        });
                      }}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        ) : (
          <Stack>
            <Typography variant="h5" align="center">
              No API Headers
            </Typography>
          </Stack>
        )}
      </Box>
    </Card>
  );
};

const HeaderTableRow: React.FC<{
  currentHeader: IApiEndpointHeaders;
  removeHeader: () => void;
  updateHeader: (header: IApiEndpointHeaders) => void;
}> = ({ currentHeader, removeHeader, updateHeader }) => {
  const popover = usePopover();
  const editing = useBoolean(false);
  const [header, setHeader] = useState({ ...currentHeader });
  const [headerErrors, setHeaderErrors] = useState<Record<keyof IApiEndpointHeaders, boolean>>({
    key: false,
    value: false,
  });
  
  return (
    <>
      <TableRow>
        <TableCell
          sx={{
            verticalAlign: 'top',
          }}
        >
          <Field.Text
            disabled={!editing.value}
            name="key"
            value={header.key}
            onChange={(e) => {
              setHeader((prev) => ({
                ...prev,
                key: e.target.value,
              }));
            }}
            placeholder="Header key"
            error={headerErrors.key}
            key={currentHeader.key}
          />
        </TableCell>

        <TableCell
          sx={{
            verticalAlign: 'top',
          }}
        >
          <Field.Text
            disabled={!editing.value}
            value={header.value}
            onChange={(e) => {
              setHeader((prev) => ({
                ...prev,
                value: e.target.value,
              }));
            }}
            name="value"
            placeholder="Header value"
            error={headerErrors.value}
            // key={currentHeader.value}
          />
        </TableCell>
        <TableCell align="right">
          {editing.value ? (
            <Stack gap={2}>
              <Button
                variant="contained"
                onClick={() => {
                  let isError = false;
                  if (!header.key || header.key.trim().length < 1) {
                    setHeaderErrors((prev) => ({
                      ...prev,
                      key: true,
                    }));
                    isError = true;
                  }
                  if (!header.value || header.value.trim().length < 1) {
                    setHeaderErrors((prev) => ({
                      ...prev,
                      value: true,
                    }));
                    isError = true;
                  }

                  if (!isError) {
                    updateHeader(header);
                    setHeader({
                      ...currentHeader,
                    });
                    setHeaderErrors({
                      key: false,
                      value: false,
                    });
                    editing.setValue(false);
                  }
                }}
                size="large"
                color="primary"
                startIcon={<Iconify icon="ic:round-check" />}
              >
                Update
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Iconify icon="ic:round-close" />}
                size="large"
                onClick={() => {
                  setHeader({
                    ...currentHeader,
                  });
                  setHeaderErrors({
                    key: false,
                    value: false,
                  });
                  editing.setValue(false);
                }}
              >
                Cancel
              </Button>
            </Stack>
          ) : (
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          )}
        </TableCell>
      </TableRow>
      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              editing.setValue(true);
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              removeHeader();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
};
