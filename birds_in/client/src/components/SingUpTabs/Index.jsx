import * as React from 'react'
import { Box, Dialog, DialogContent, DialogTitle, Tab, Tabs, useTheme } from '@mui/material';
import { RegisterForm } from './RegisterForm';
import { useDispatch } from 'react-redux';
import { Boolean } from '../../redux/slices/OpenClose';

export const Index = ({ open }) => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleClose = () => {
    dispatch(Boolean(false))
    dispatch(resetForm())
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
    <Dialog open={open} onClose={handleClose}  sx={dialogStyles} PaperProps={{ sx: { padding: '11px', borderRadius: '15px', height: '100%' } }} >
      <DialogTitle>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          textColor='primary'
          indicatorColor="primary"
          aria-label="tabsLogin"
          selectionfollowsfocu='true'
        >
          <Tab label="Registrar"></Tab>
          <Tab label="Login"></Tab>
          <Tab label="Olvido Contrasena"></Tab>
        </Tabs>
      </DialogTitle>
      <DialogContent>
        {selectedTab === 0 && (
          <Box>
            <RegisterForm 
            open={open}
            onClose={handleClose}
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}
