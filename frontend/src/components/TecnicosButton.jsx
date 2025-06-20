import react from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TecnicosButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/tecnicos'); // Redirige a la página de técnicos
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleClick}
      style={{ margin: '10px' }}
    >
      Técnicos
    </Button>
  );
}

export default TecnicosButton;