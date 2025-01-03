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
import { Checkbox } from '@mui/material';
import { useTranslate } from 'src/locales';

export type ApiEndpointSchemaType = zod.infer<ReturnType<typeof ApiEndpointSchema>>;

export const ApiEndpointSchema = (t: any) => zod.object({
  apiEndpointName: zod.string().min(1, { message: t('Api Endpoint Name is required!') }),
  apiEndpointURI: zod.string().min(1, { message: t('Api Endpoint URI is required!') })
                  .regex(/^https?:\/\/[a-zA-Z0-9\-\.]+(:[0-9]+)?(\/[a-zA-Z0-9\-._~%!$&'()*+,;=:@]+)*(\/)?(\?[a-zA-Z0-9\-._~%!$&'()*+,;=:@\/?]*)?(#[a-zA-Z0-9\-._~%!$&'()*+,;=:@\/?]*)?$/, {
                    message: t('Invalid URI format!')
                  }),
  apiEndpointDescription: zod.string(),
  apiEndpointMethod: zod.enum(['GET', 'POST', 'PUT', 'DELETE'], {
    required_error: t('Method is required!'),
  }),
  apiEndpointTimeout: zod
    .number()
    .min(1, { message: t('Timeout must be greater than 0!') })
    .refine((value) => Number.isInteger(value), {
      message: t('Timeout must be an integer!'),
    })
});

type Props = {
  currentApiEndpoint?: IApiEndpointItem;
};

export function ApiEndpointNewEditForm({ currentApiEndpoint }: Props) {
  const router = useRouter();
  const {t} = useTranslate();
  const [headers, setHeaders] = useState<
    {
      isEncrypted: boolean;
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

  const schema = ApiEndpointSchema(t);
  const methods = useForm<ApiEndpointSchemaType>({
    mode: 'all',
    resolver: zodResolver(schema),
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
      console.log(data);
      console.log('Headers:', headers);
      const url = currentApiEndpoint ? `/apiEndpoints/${currentApiEndpoint._id}` : '/apiEndpoints/create';
      const method = currentApiEndpoint ? API.put : API.post;
      await method(url, {
        apiEndpointName: data.apiEndpointName,
        apiEndpointURI: data.apiEndpointURI,
        apiEndpointDescription: data.apiEndpointDescription,
        apiEndpointMethod: data.apiEndpointMethod,
        apiEndpointTimeout: data.apiEndpointTimeout,
        apiEndpointHeaders : headers,
      });
      reset();
      toast.success(currentApiEndpoint ? t('Update success!') : t('Create success!'));
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
      <CardHeader title={t("Details")} 
        subheader={t("API Endpoint name and description")} sx={{ mb: 3 }} />

      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">
            {t('API Endpoint Name')}
          </Typography>
          <Field.Text label="" name="apiEndpointName" />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">
            {t('Description')}
          </Typography>

          <Field.Text fullWidth label="" multiline rows={4} name="apiEndpointDescription" />
        </Stack>
      </Stack>
    </Card>
  );


  const renderSpecs = (
    <Card>
      <CardHeader title={t("Specifications")}
       subheader={t("API Endpoint Specifications")} sx={{ mb: 3 }} />

      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>

        <Stack sx={{ px: 1 }}>
          <Typography variant="subtitle2">
            {t('API Endpoint Method')}
          </Typography>

          <Field.RadioGroup
            name="apiEndpointMethod"
            sx={{ flexDirection: 'row' }} // Add this to make it horizontal
            options={[
              { label: t('GET'), value: 'GET' },
              { label: t('POST'), value: 'POST' },
              { label: t('PUT'), value: 'PUT' },
              { label: t('DELETE'), value: 'DELETE' },
            ]}
          />
        </Stack>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">
            {t("URI")}
          </Typography>

          <Field.Text label="" name="apiEndpointURI" />
        </Stack>
        <Stack spacing={4} direction="row">
          <Stack flex={1} spacing={1.5}>
            <Typography variant="subtitle2">
              {t("API Endpoint Timeout")}
            </Typography>
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
                    {t('Seconds')}
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
        {!currentApiEndpoint ? t('Create') : t('Update')}
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


const HeadersForm: React.FC<{
  headers: IApiEndpointItem['apiEndpointHeaders'];
  setHeaders: React.Dispatch<
    React.SetStateAction<
      {
        isEncrypted: boolean;
        key: string;
        value: string;
      }[]
    >
  >;
}> = ({ headers, setHeaders }) => {
  const {t} = useTranslate();
  const TABLE_HEAD = [
    { id: 'checkbox', label: t('Encryption'), width: 100 },
    { id: 'key', label: t('Key'), width: 200 },
    { id: 'value', label: t('Value'), width: 200 },
    { id: '', width: 200 },
  ];
  const table = useTable();
  const [header, setHeader] = useState<IApiEndpointHeaders>({
    isEncrypted: false,
    key: '',
    value: '',
  });
  const [headerErrors, setHeaderErrors] = useState<Record<keyof IApiEndpointHeaders, boolean>>({
    isEncrypted: false,
    key: false,
    value: false,
  });

  const shouldShowForm = useBoolean(false);
  return (
    <Card>
      <Stack p={3} direction="row" alignItems="start" justifyContent="space-between">
        <Stack>
          <Typography variant="h5">
            {t('API Headers')}
          </Typography>
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
          {t('Add New Header')}
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
                      <Checkbox
                        checked={header.isEncrypted}
                        color='default'
                        onChange={(e) => {
                          setHeader((prev) => ({
                            ...prev,
                            isEncrypted: e.target.checked,
                          }));
                        }}
                        inputProps={{ 'aria-label': 'isEncrypted' }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        verticalAlign: 'top',
                      }}
                    >
                      <Field.Text
                        name="key"
                        value={header.key}
                        onChange={(e) => {
                          const key = e.target.value;
                          // check if key is in headers already
                          if (headers.find((h) => h.key === key)) {
                            setHeaderErrors((prev) => ({
                              ...prev,
                              key: true,
                            }));
                          } else {
                            setHeaderErrors((prev) => ({
                              ...prev,
                              key: false,
                            }));
                          }
                          setHeader((prev) => ({
                            ...prev,
                            key: e.target.value,
                          }));
                        }}
                        placeholder={t('Header Key')}
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
                        placeholder={t('Header Value')}
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
                            if(headers.find((h) => h.key === header.key)) {
                              setHeaderErrors((prev) => ({
                                ...prev,
                                key: true,
                              }));
                              toast.error(t('Header key already exists!'));
                              isError = true;
                            }
                            if (!isError) {
                              setHeaders((prev) => [...prev, header]);
                              setHeader({
                                isEncrypted: false,
                                key: '',
                                value: '',
                              });
                              setHeaderErrors({
                                isEncrypted: false,
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
                          {t('Add')}
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<Iconify icon="ic:round-close" />}
                          size="large"
                          onClick={() => {
                            shouldShowForm.setValue(false);
                            setHeader({
                              isEncrypted: false,
                              key: '',
                              value: '',
                            });
                            setHeaderErrors({
                              isEncrypted: false,
                              key: false,
                              value: false,
                            });
                          }}
                        >
                          {t('Cancel')}
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )}
                {headers.map((h: IApiEndpointHeaders, index: number) => {
                  return (
                    <HeaderTableRow
                      t={t}
                      key={JSON.stringify(h) + index}
                      currentHeader={h}
                      checkDuplicationKey={(key: string) => {
                        // check if key is in headers already except for the current header
                        return headers.find((h, i) => h.key === key && i !== index) ? true : false;
                      }}
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
              {t('No Headers')}
            </Typography>
          </Stack>
        )}
      </Box>
    </Card>
  );
};

const HeaderTableRow: React.FC<{
  currentHeader: IApiEndpointHeaders;
  checkDuplicationKey: (key: string) => boolean;
  removeHeader: () => void;
  updateHeader: (header: IApiEndpointHeaders) => void;
  t: any;
}> = ({ currentHeader, removeHeader, updateHeader, checkDuplicationKey, t }) => {
  const popover = usePopover();
  const editing = useBoolean(false);
  const [header, setHeader] = useState({ ...currentHeader });
  const [headerErrors, setHeaderErrors] = useState<Record<keyof IApiEndpointHeaders, boolean>>({
    isEncrypted: false,
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
          <Checkbox
            checked={header.isEncrypted}
            color='default'
            disabled={!editing.value}
            onChange={(e) => {
              setHeader((prev) => ({
                ...prev,
                isEncrypted: e.target.checked,
              }));
            }}
            inputProps={{ 'aria-label': 'isEncrypted' }}
          />
        </TableCell>
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
            placeholder={t('Header Key')}
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
            placeholder={t('Header Value')}
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
                  if (header.key !== currentHeader.key && checkDuplicationKey(header.key)) {
                    setHeaderErrors((prev) => ({
                      ...prev,
                      key: true,
                    }));
                    toast.error(t('Header key already exists!'));
                    isError = true;
                  }

                  if (!isError) {
                    updateHeader(header);
                    setHeader({
                      ...currentHeader,
                    });
                    setHeaderErrors({
                      isEncrypted: false,
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
                {t('Update')}
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
                    isEncrypted: false,
                    key: false,
                    value: false,
                  });
                  editing.setValue(false);
                }}
              >
                {t('Cancel')}
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
            {t('Edit')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              removeHeader();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            {t('Delete')}
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
};
