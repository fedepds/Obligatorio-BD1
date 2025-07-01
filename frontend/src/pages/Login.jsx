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


import "../styles/Login.css";
import { loginUsuario } from "../api";

function ModeToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);


  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="soft">Change mode</Button>;
  }

  return (
    <Select
      variant="soft"
      value={mode}
      onChange={(event, newMode) => {
        setMode(newMode);
      }}
      className="mode-toggle"
    >
      <Option value="system">System</Option>
      <Option value="light">Light</Option>
      <Option value="dark">Dark</Option>
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
    // Mensaje de error más descriptivo
    setError("Error de autenticación: " + (err.message || "Credenciales incorrectas o error de conexión"));
    console.error("Error de login:", err);
  } finally {
    setLoading(false);
  }
};

  return (
    <main>
      <CssVarsProvider {...props}>
        <ModeToggle />
        <CssBaseline />
        <Sheet className="login-sheet" variant="outlined">
          <div>
            <Typography level="h4" component="h1">
              <b>Welcome!</b>
            </Typography>
            <Typography level="body-sm">Sign in to continue.</Typography>
          </div>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              placeholder="pepe@pepe.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              name="password"
              type="password"
              placeholder="UnaContraseñaSegura123"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </FormControl>
          {error && (
            <Alert color="danger" variant="soft" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            className="login-button"
            loading={loading}
            onClick={handleLogin}
            disabled={loading}
          >
            Log in
          </Button>
        </Sheet>
      </CssVarsProvider>
    </main>
  );
}