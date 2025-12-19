import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';

export function CircularScreen() {
  return (
    <DashboardContent>
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    </DashboardContent>
  );
}
