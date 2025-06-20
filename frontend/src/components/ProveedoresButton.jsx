import react from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProveedoresButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/proveedores'); // Redirige a la página de proveedores
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleClick}
      style={{ margin: '10px' }}
    >
      Proveedores
    </Button>
  );
}

export default ProveedoresButton;