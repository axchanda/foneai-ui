import {
  Avatar,
  Button,
  Card,
  Divider,
  IconButton,
  MenuItem,
  MenuList,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { useBoolean } from 'src/hooks/use-boolean';
import type { IWebhookItem } from 'src/types/webhook';

const WebhookCard: React.FC<IWebhookItem> = ({ name, description, restMethod, URL }) => {
  const popover = usePopover();
  const confirm = useBoolean();
  return (
    <>
      <Card>
        <IconButton onClick={popover.onOpen} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
        <Stack sx={{ p: 3, pb: 2 }}>
          <Avatar
            alt="webhook"
            src="/webhook.svg"
            variant="rounded"
            sx={{ width: 48, height: 48, mb: 2 }}
          />
          <Typography mb={1} variant="h6">
            {name}
          </Typography>
          <Typography typography="caption" color="text.disabled" variant="subtitle2">
            {description}
          </Typography>
        </Stack>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Stack gap={2} flexDirection="row" sx={{ p: 3, pb: 2 }}>
          <Label color="info">{restMethod}</Label>
          <Typography variant="subtitle2">{URL}</Typography>
        </Stack>
      </Card>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
              // onEdit();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
              // onDelete();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {name} </strong>?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              // onDelete();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
};

export default WebhookCard;
