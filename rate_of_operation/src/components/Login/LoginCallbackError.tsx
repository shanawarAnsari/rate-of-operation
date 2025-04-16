import { Grid, Paper, Box, Typography, Alert } from '@mui/material';
import { LockRounded } from '@mui/icons-material';


const LoginCallbackError = () => {
  return (
    <Grid container justifyContent="center" padding={2} className='login-callback-error'>
      <Grid item xs={4}>
        <Paper sx={{ padding: 2, color: '#585252' }}>
          <Box sx={{ textAlign: 'center', fontSize: '1.75rem', padding: 2, color: '#b4afaf' }}>
            <LockRounded />
          </Box>
          <Box sx={{ padding: 1 }}>
            <Alert severity="error">
              <Typography variant='h4' color="#585252" alignContent="center">App Access Locked</Typography>
            </Alert>
          </Box>
          <Box sx={{ textAlign: 'center', padding: 1 }}>
            <Typography>
              You are not allowed to access this app due to a policy set by the administrator.
            </Typography>
            <Typography sx={{ padding: 0.5 }}>
              To request access, please contact admin.
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>

  );
}

export default LoginCallbackError;