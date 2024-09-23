import * as React from 'react'
import { Box, Dialog, DialogContent, DialogTitle, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { useDispatch } from 'react-redux';
//components
import { RegisterForm } from './RegisterForm';
import { LoginForm } from './LoginForm';
import { ForgotPass } from './ForgotPass';
//redux
import { Boolean } from '../../redux/settings/slices/OpenClose';
import { CopyRight } from '../CopyRight';


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
    fontSize: { xs: '1rem', sm: '1.5rem', md: '1.75rem' },
    "&:hover": {
      color: theme.palette.primary.main, // Cambiar el color del texto en el hover
      cursor: 'pointer', // Cambiar el cursor a "mano" en el hover
    },
  };

  return (
    <Dialog open={open} onClose={handleClose} PaperProps={{
      sx: {
        padding: '9px',
        borderRadius: '15px',
        minHeight: { xs: '60%', lg: '90%' },
        maxHeight: { xs: '60%', lg: '90%' },
        minWidth: { xs: '90%', lg: '40%' },
        maxWidth: '40%'
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
        >
          <Tab label={
            <Typography variant='h5' sx={tabTitleStyles}>
              Log In
            </Typography>
          }></Tab>
          <Tab label={<Typography variant='h5' sx={tabTitleStyles}>
            Registrarse
          </Typography>}></Tab>
          {/* <Tab label={<Typography variant='h5' sx={tabTitleStyles}>
            Recuperar contraseña
          </Typography>}></Tab> */}
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
      <CopyRight.Website />
    </Dialog>
  )
};
