import react from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MantenimientoButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/mantenimiento');
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleClick}
      style={{ margin: '10px' }}
    >
      Mantenimiento
    </Button>
  );
}

export default MantenimientoButton;