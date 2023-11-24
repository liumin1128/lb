import * as React from 'react';
import Box from '@mui/material/Box';
import Canvas from './Canvas';

const Home: React.FunctionComponent = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Canvas />
    </Box>
  );
};

export default Home;
