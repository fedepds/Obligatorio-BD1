import * as React from "react";
import { CssVarsProvider, useColorScheme } from "@mui/joy/styles";
import Sheet from "@mui/joy/Sheet";
import CssBaseline from "@mui/joy/CssBaseline";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Alert from "@mui/joy/Alert";
import { useNavigate } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import CoffeeIcon from "@mui/icons-material/Coffee";
import Box from "@mui/joy/Box";

import "../styles/Login.css";
import { loginUsuario } from "../api";

function ModeToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="soft">Cambiar modo</Button>;
  }

  return (
    <Select
      variant="soft"
      value={mode}
      onChange={(event, newMode) => {
        setMode(newMode);
      }}
      className="mode-toggle"
      startDecorator={mode === "dark" ? <DarkModeIcon /> : <LightModeIcon />}
      size="sm"
    >
      <Option value="system">Sistema</Option>
      <Option value="light">Claro</Option>
      <Option value="dark">Oscuro</Option>
    </Select>
  );
}

export default function Login(props) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const respuesta = await loginUsuario(email, password);
      const usuario = respuesta.usuario;
      if (usuario.es_administrador) {
        navigate("/home");
      } else {
        navigate("/homeUser");
      }
    } catch (err) {
      setError("Error de autenticación: " + (err.message || "Credenciales incorrectas o error de conexión"));
      console.error("Error de login:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <main>
      <CssVarsProvider {...props}>
        <CssBaseline />
        <Box sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          display: 'flex',
          gap: 2
        }}>
          <ModeToggle />
        </Box>
        <Sheet
          className="login-sheet"
          variant="outlined"
          sx={{
            maxWidth: 400,
            width: '100%',
            mx: 'auto',
            my: 4,
            py: 3,
            px: 4,
            borderRadius: 'md',
            boxShadow: 'md',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <CoffeeIcon sx={{ fontSize: 40, mb: 1, color: 'primary.main' }} />
            <Typography level="h3" fontWeight="bold" color="primary">
              Cafés Marloy
            </Typography>
            <Typography level="body-md" sx={{ mb: 1 }}>
              Sistema de Gestión
            </Typography>
          </Box>

          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Correo electrónico</FormLabel>
            <Input
              name="email"
              type="email"
              placeholder="ejemplo@cafesmarloy.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              startDecorator={<EmailIcon />}
              onKeyPress={handleKeyPress}
              required
            />
          </FormControl>

          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Contraseña</FormLabel>
            <Input
              name="password"
              type="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              startDecorator={<LockIcon />}
              onKeyPress={handleKeyPress}
              required
            />
          </FormControl>

          {error && (
            <Alert color="danger" variant="soft" sx={{ mt: 1, mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            loading={loading}
            onClick={handleLogin}
            disabled={loading}
            sx={{ mt: 1 }}
          >
            Iniciar sesión
          </Button>

          <Typography level="body-sm" sx={{ mt: 2, textAlign: 'center' }}>
            Sistema de Gestión de Mantenimiento v1.0
          </Typography>
        </Sheet>
      </CssVarsProvider>
    </main>
  );
}