import type { AdminContextValue } from '../type';

import { createContext } from 'react';

export const AdminContext = createContext<AdminContextValue | undefined>(undefined);
