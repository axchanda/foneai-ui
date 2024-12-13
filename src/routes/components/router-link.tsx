import type { LinkProps } from 'react-router-dom';

import { forwardRef } from 'react';
import { Link } from 'react-router-dom';

// ----------------------------------------------------------------------

interface RouterLinkProps extends Omit<LinkProps, 'to'> {
  href?: string;
}

export const RouterLink = forwardRef<HTMLAnchorElement, RouterLinkProps>(
  ({ href, ...other }, ref) =>{
    href = href || '';
    return <Link ref={ref} to={href} {...other} />;
  }
);
