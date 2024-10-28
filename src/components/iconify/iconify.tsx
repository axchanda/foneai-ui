import { forwardRef } from 'react';
import { Icon, disableCache, addIcon } from '@iconify/react';

import Box from '@mui/material/Box';
import NoSsr from '@mui/material/NoSsr';

import { iconifyClasses } from './classes';
import type { IconifyProps } from './types';

// Import custom icons
import { FsIcon } from 'src/assets/icons';

// ----------------------------------------------------------------------
// Register custom icons with unique names
addIcon('custom-freeswitch', FsIcon.icons.freeswitch);

interface ExtendedIconifyProps extends IconifyProps {
  customIcon?: 'custom-freeswitch' | 'anotherCustomIcon'; // Add other custom icon names here as needed
}

export const Iconify = forwardRef<SVGElement, ExtendedIconifyProps>(
  ({ className, icon, customIcon, width = 20, sx, ...other }, ref) => {
    const baseStyles = {
      width,
      height: width,
      flexShrink: 0,
      display: 'inline-flex',
    };

    const renderFallback = (
      <Box
        component="span"
        className={iconifyClasses.root.concat(className ? ` ${className}` : '')}
        sx={{ ...baseStyles, ...sx }}
      />
    );

    return (
      <NoSsr fallback={renderFallback}>
        <Box
          ref={ref}
          component={Icon}
          icon={customIcon || icon} // customIcon takes priority if provided
          className={iconifyClasses.root.concat(className ? ` ${className}` : '')}
          sx={{ ...baseStyles, ...sx }}
          {...other}
        />
      </NoSsr>
    );
  }
);

// https://iconify.design/docs/iconify-icon/disable-cache.html
disableCache('local');
