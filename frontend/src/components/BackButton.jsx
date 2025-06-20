import react from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1); // pagina anterior
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleClick}
      style={{ margin: '10px' }}
    >
      Volver
    </Button>
  );
}

export default BackButton;