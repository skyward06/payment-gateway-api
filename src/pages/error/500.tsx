import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/config';

export default function Page500() {
  return (
    <>
      <title>{`${CONFIG.appName} - Error`}</title>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        textAlign="center"
        p={3}
      >
        <Typography variant="h1" gutterBottom>
          500
        </Typography>
        <Typography variant="h4" gutterBottom>
          Internal Server Error
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          Something went wrong on our end. Please try again later.
        </Typography>
        <Button component={RouterLink} href="/" variant="contained" size="large">
          Go Home
        </Button>
      </Box>
    </>
  );
}
