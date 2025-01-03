import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import { useTheme } from '@mui/material/styles';

import { useAuth } from 'src/auth/context/jwt/hooks';
import { NavList } from './nav-list';
import { navSectionClasses } from '../classes';
import { navSectionCssVars } from '../css-vars';
import { NavUl, NavLi, Subheader } from '../styles';

import type { NavGroupProps, NavSectionProps } from '../types';

// ----------------------------------------------------------------------

export function NavSectionVertical({
  sx,
  data,
  render,
  slotProps,
  enabledRootRedirect,
  cssVars: overridesVars,
}: NavSectionProps) {
  const theme = useTheme();
  const { user } = useAuth();
  const permissions: string[] = user?.permissions || [];

  const cssVars = {
    ...navSectionCssVars.vertical(theme),
    ...overridesVars,
  };

  return (
    <Stack component="nav" className={navSectionClasses.vertical.root} sx={{ ...cssVars, ...sx }}>
      <NavUl sx={{ flex: '1 1 auto', gap: 'var(--nav-item-gap)', pb: 5 }}>
        {data
          .filter((d) => (d.permission ? permissions.includes(d.permission) : true))
          .map((group) => (
            <Group
              key={group.subheader ?? group.items[0].title}
              subheader={group.subheader}
              items={group.items}
              render={render}
              slotProps={slotProps}
              enabledRootRedirect={enabledRootRedirect}
            />
          ))}
      </NavUl>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function Group({ items, render, subheader, slotProps, enabledRootRedirect }: NavGroupProps) {
  const [open, setOpen] = useState(true);
  const { user } = useAuth();

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const permissions: string[] = user?.permissions || [];

  const renderContent = (
    <NavUl sx={{ gap: 'var(--nav-item-gap)' }}>
      {items
        .filter((item) => (item.permission ? permissions.includes(item.permission) : true))
        .map((list) => (
          <NavList
            key={list.title}
            data={list}
            render={render}
            depth={1}
            slotProps={slotProps}
            enabledRootRedirect={enabledRootRedirect}
          />
        ))}
    </NavUl>
  );

  return (
    <NavLi>
      {subheader ? (
        <>
          <Subheader
            data-title={subheader}
            open={open}
            onClick={handleToggle}
            sx={slotProps?.subheader}
          >
            {subheader}
          </Subheader>

          <Collapse in={open}>{renderContent}</Collapse>
        </>
      ) : (
        renderContent
      )}
    </NavLi>
  );
}
