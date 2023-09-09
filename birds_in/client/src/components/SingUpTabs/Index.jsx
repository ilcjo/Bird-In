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
    setSelectedTab(newValue);
  };

  const tabTitleStyles = {
  color: theme.palette.primary.light,
    "&:hover": {
      color: theme.palette.primary.main, // Cambiar el color del texto en el hover
      cursor: 'pointer', // Cambiar el cursor a "mano" en el hover
    },  
  };


  return (
    <Dialog open={open} onClose={handleClose}  PaperProps={{
      sx: {
        padding: '9px',
        borderRadius: '15px',
        minHeight: '90%',
        maxHeight: '90%',
        minWidth: '40%',
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
          selectionfollowsfocu='true'
        >
          <Tab label={
            <Typography variant='h5' sx={tabTitleStyles}>
              Log In
            </Typography>
          }></Tab>
          <Tab label={ <Typography variant='h5'  sx={tabTitleStyles}>
              Registrarse
            </Typography>}></Tab>
            <Tab label={ <Typography variant='h5'   sx={tabTitleStyles}>
              Recuperar contrasena
            </Typography>}></Tab>
        </Tabs>
      </DialogTitle>
      <DialogContent>
        {selectedTab === 0 && (
          <Box>
            <LoginForm
              open={open}
              />
          </Box>
        )}
        {selectedTab === 1 && (
          <Box>
            <RegisterForm
              open={open}
              
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
}
