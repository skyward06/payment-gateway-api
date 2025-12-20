import type { IconifyName } from 'src/components/Iconify';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/Iconify';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
};

export function StatCard({ title, value, icon, color = 'primary' }: StatCardProps) {
  return (
    <Card sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h3" mt={1}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: `${color}.lighter`,
            color: `${color}.main`,
          }}
        >
          <Iconify icon={icon as IconifyName} width={32} />
        </Box>
      </Stack>
    </Card>
  );
}
