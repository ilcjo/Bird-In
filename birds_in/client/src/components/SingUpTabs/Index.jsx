import * as React from 'react'
import { Box, Dialog, DialogContent, DialogTitle, Tab, Tabs, useTheme } from '@mui/material';
import { RegisterForm } from './RegisterForm';
import { useDispatch } from 'react-redux';
import { Boolean } from '../../redux/slices/OpenClose';
import { LoginForm } from './LoginForm';



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

  const dialogStyles = {
    backgroundColor: 'rgba(204, 214, 204, 0.17)',

    "& .MuiDialogTitle-root": {
      variant: "h1",
      color: theme.palette.primary.light, // Establecer el color del texto utilizando el theme

    },
  };
  return (
    <Dialog open={open} onClose={handleClose} sx={dialogStyles} PaperProps={{
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
          <Tab label="Log In"></Tab>
          <Tab label="Registrar"></Tab>
          <Tab label="Recuperar Contrasena"></Tab>
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
      </DialogContent>
    </Dialog>
  )
}
