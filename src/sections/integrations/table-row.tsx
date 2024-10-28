import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { fDate } from 'src/utils/format-time';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import type { IApiKeyItem } from 'src/types/apiKey';
import { Tooltip, Typography } from '@mui/material';

type Props = {
  row: IApiKeyItem;
  onRotateRow: () => void;
};

export function ApiKeyTableRow({ row, onRotateRow }: Props) {
  const renderPrimary = (
    <TableRow>
      <TableCell>
        <Typography variant="body2">{row.comment}</Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2">
          ********************************
        </Typography>
      </TableCell>

      <TableCell align="center">
        <Typography variant="body2">{fDate(row.createdAt)}</Typography>
      </TableCell>


      <TableCell align="center">
        <Typography variant="body2">{fDate(row.updatedAt)}</Typography>
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (row.status === 'active' && 'success') ||
            (row.status === 'expired' && 'error') ||
            'default'
          }
        >
          {row.status}
        </Label>
      </TableCell>

      <TableCell
        align="right"
        sx={{
          px: 1,
          justifyContent: 'space-around',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
        }}
      >
        <Tooltip title="Rotate key">
          <IconButton
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              onRotateRow();
            }}
          >
            <Iconify icon="hugeicons:refresh" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );

  return renderPrimary;
}
