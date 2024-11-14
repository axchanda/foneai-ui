import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { fData } from 'src/utils/format-number';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from '../iconify';
import { fileData, FileThumbnail } from '../file-thumbnail';

import type { KbFilePreviewProps } from './types';
import { Skeleton, Tooltip } from '@mui/material';

// ----------------------------------------------------------------------

export function KbFilePreview({
  sx,
  onEdit,
  onRemove,
  lastNode,
  thumbnail,
  slotProps,
  firstNode,
  fileNames = [],
}: KbFilePreviewProps) {
  const renderFirstNode = firstNode && (
    <Box
      component="li"
      sx={{
        ...(thumbnail && {
          width: 'auto',
          display: 'inline-flex',
        }),
      }}
    >
      {firstNode}
    </Box>
  );

  const renderLastNode = lastNode && (
    <Box
      component="li"
      sx={{
        ...(thumbnail && { width: 'auto', display: 'inline-flex' }),
      }}
    >
      {lastNode}
    </Box>
  );
  console.log('File names:', fileNames);
  return (
    <Box
      component="ul"
      sx={{
        gap: 1,
        display: 'flex',
        flexDirection: 'column',
        ...(thumbnail && {
          flexWrap: 'wrap',
          flexDirection: 'row',
        }),
        ...sx,
      }}
    >
      {renderFirstNode}

      {fileNames.map((fileName: string) => {
        console.log('File name:', fileName);
        return (
          <Box
            component="li"
            key={fileName}
            sx={{
              py: 1,
              pr: 1,
              pl: 1.5,
              gap: 1.5,
              display: 'flex',
              borderRadius: 1,
              alignItems: 'center',
              border: (theme) =>
                `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
            }}
          >
            
            <FileThumbnail file={fileName} {...slotProps?.thumbnail} />

            <ListItemText primary={fileName} />

            {onRemove && (
              <Tooltip title="Delete" arrow placement='right'>
                <IconButton size="small" onClick={() => onRemove(fileName)}>
                  <Iconify icon="fluent:delete-20-regular" color="error.main" width={26} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        );
      })}

      {renderLastNode}
    </Box>
  );
}