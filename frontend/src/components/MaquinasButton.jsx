import react from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MaquinasButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/maquinas'); // Redirige a la página de máquinas
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleClick}
      style={{ margin: '10px' }}
    >
      Máquinas
    </Button>
  );
}

export default MaquinasButton;