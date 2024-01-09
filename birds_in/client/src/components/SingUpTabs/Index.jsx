import * as React from 'react'
import { Box, Dialog, DialogContent, DialogTitle, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { RegisterForm } from './RegisterForm';
import { useDispatch } from 'react-redux';
import { Boolean } from '../../redux/slices/OpenClose';
import { LoginForm } from './LoginForm';
import { ForgotPass } from './ForgotPass';


export const Index = ({ open }) => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleClose = () => {
    dispatch(Boolean(false))
  };
  const handleTabChange = (event, newValue) => {
    const convertNumber = Number(newValue)
    setSelectedTab(convertNumber);
  };

  const tabTitleStyles = {
    color: theme.palette.primary.light,
    fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.3rem', lg: '1.7rem', xl: '1.7rem' },
    "&:hover": {
      color: theme.palette.primary.main, // Cambiar el color del texto en el hover
      cursor: 'pointer', // Cambiar el cursor a "mano" en el hover
    },
  };

  return (
    <Dialog open={open} onClose={handleClose} PaperProps={{
      sx: {
        padding: { xs: '0px', sm: '0px', md: '0px', lg: '40px', xl: '40px' },
        borderRadius: '15px',
        minHeight: { xs: 'auto', sm: 'auto', md: 'auto', lg: 'auto', xl: 'auto' },
        maxHeight: { xs: 'auto', sm: 'auto', md: 'auto', lg: 'auto', xl: 'auto' },
        minWidth: { xs: '95%', sm: '80%', md: '60%', lg: '50%', xl: '40%' },
        maxWidth: { xs: '95%', sm: '80%', md: '60%', lg: '50%', xl: '40%' }
      }
    }}
    >
      <DialogTitle>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          textColor='primary'
          indicatorColor="primary"
          aria-label="tabsLogin"
          selectionfollowsfocu='true'
        >
          <Tab label={
            <Typography variant='h5' sx={tabTitleStyles}>
              Log In
            </Typography>
          }></Tab>
          <Tab label={<Typography variant='h5' sx={tabTitleStyles}>
            Registrarse
          </Typography>}></Tab>
          <Tab label={<Typography variant='h5' sx={tabTitleStyles}>
            Recuperar contraseña
          </Typography>}></Tab>
        </Tabs>
      </DialogTitle>
      <DialogContent>
        {selectedTab === 0 && (
          <Box>
            <LoginForm
              changeTab={(newValue) => setSelectedTab(newValue)}
              open={open}
            />
          </Box>
        )}
        {selectedTab === 1 && (
          <Box>
            <RegisterForm
              changeTab={(newValue) => setSelectedTab(newValue)}
              open={open}
              close={handleClose}
            />
          </Box>
        )}
        {selectedTab === 2 && (
          <Box>
            <ForgotPass
              open={open}
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
};
