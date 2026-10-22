// ============================================================================
// IMPORTS
// ============================================================================

import * as React from 'react';

// ============================================================================
// TYPES
// ============================================================================

export type TabsVariant = 'Primary' | 'Secondary';
export type TabsStyleType = 'Contained' | 'Underline';

export interface TabsContextValue {
  value?: string;
  variant: TabsVariant;
  styleType: TabsStyleType;
  tabsId: string;
  onValueChange?: (value: string) => void;
}

// ============================================================================
// CONTEXT
// ============================================================================

export const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);
