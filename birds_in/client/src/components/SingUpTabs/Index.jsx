import * as React from 'react'
import { Box, Tab, Tabs } from '@mui/material';

import { RegisterForm } from './RegisterForm';

export const Index = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="secondary tabs example"
      >
        <Tab value= 'one' label="Item One"></Tab>
      </Tabs>
      {/* {value === 0 && <RegisterForm />} */}
    </Box>
  )
}
