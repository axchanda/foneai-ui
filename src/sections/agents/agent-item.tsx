import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import type { IAgentListType } from 'src/types/agent';
import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------


type Props = {
  agent: IAgentListType;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function AgentItem({ agent, onView, onEdit, onDelete }: Props) {
  const popover = usePopover();
  const confirm = useBoolean();
  const {t} = useTranslate();


const languages = {
  en: t('English'),
  ru: t('Russian'),
  es: t('Spanish'),
  ar: t('Arabic'),
};

  return (
    <>
      <Card onDoubleClick={onEdit}>
        <IconButton onClick={popover.onOpen} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>

        <Stack sx={{ 
          p: 3, 
          pb: 1,
         }}
         direction={{ xs: 'column', sm: 'row' }}
         columnGap={4}
         >
          <Avatar
            alt="agent"
            src="/assets/agent.svg"
            variant="rounded"
            sx={{ width: 64, height: 64, mb: 2 }}
          />

          <ListItemText
            sx={{ mb: 1 }}
            primary={
              <Link component={RouterLink} href={`/agents/${agent._id}`} color="inherit" underline='none' >
                {agent.name}
              </Link>
            }
            secondary={`${t("Update date:")} ${fDate(agent.updatedAt)}`}
            primaryTypographyProps={{ typography: 'subtitle1' }}
            secondaryTypographyProps={{
              mt: 1,
              component: 'span',
              typography: 'caption',
              color: 'text.disabled',
            }}
          />

          {/* <Stack
            spacing={0.5}
            direction="row"
            alignItems="center"
            sx={{ color: 'primary.main', typography: 'caption' }}
          >
            <Iconify width={16} icon="solar:users-group-rounded-bold" />
            {agent.candidates.length} candidates
          </Stack> */}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box rowGap={1.5} display="grid" gridTemplateColumns="repeat(2, 1fr)" sx={{ p: 3 }}>
          {[
            {
              label: t('Voice'),
              icon: <Iconify width={16} icon="iconoir:voice" sx={{ flexShrink: 0 }} />,
            },
            {
              label: languages[agent.language],
              icon: <Iconify width={16} icon="iconoir:language" sx={{ flexShrink: 0 }} />,
            },
            {
              label: agent.isInterruptible ? t('Interruptible') : t('Non-interruptible'),
              icon: (
                <Iconify
                  width={16}
                  icon={agent.isInterruptible ? "icon-park-outline:link-interrupt" : "icon-park-outline:link-four"}
                  sx={{ flexShrink: 0 }}
                />
              ),
            },
            {
              label: agent.voice.voiceId,
              icon: <Iconify width={16} icon="simple-icons:amazonaws" sx={{ flexShrink: 0 }} />,
            },
          ].map((item, index) => (
            <Stack
              key={index}
              spacing={0.5}
              flexShrink={0}
              direction="row"
              alignItems="center"
              sx={{ color: 'text.disabled', minWidth: 0 }}
            >
              {item.icon}
              <Typography variant="caption" noWrap>
                {item.label}
              </Typography>
            </Stack>
          ))}
        </Box>
      </Card>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          {/* <MenuItem
          onClick={() => {
            popover.onClose();
            onView();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem> */}

          <MenuItem
            onClick={() => {
              popover.onClose();
              onEdit();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            {t('Edit')}
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
            {t('Delete')}
          </MenuItem>
        </MenuList>
      </CustomPopover>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t("Delete")}
        content={
          <>
            {t('Are you sure want to delete ')}<strong> {agent.name} </strong>?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDelete();
              confirm.onFalse();
            }}
          >
            {t('Delete')}
          </Button>
        }
      />
    </>
  );
}
