// src/types/react-router-bootstrap.d.ts
declare module 'react-router-bootstrap' {
    import * as React from 'react';
    import { LinkProps } from 'react-router-dom';
  
    export interface LinkContainerProps extends LinkProps {
      to: string;
      exact?: boolean;
      strict?: boolean;
      isActive?: (match: any, location: any) => boolean;
      activeClassName?: string;
      activeStyle?: React.CSSProperties;
      className?: string;
      style?: React.CSSProperties;
    }
  
    export const LinkContainer: React.FC<LinkContainerProps>;
  }
  