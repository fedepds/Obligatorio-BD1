class Login:
    def __init__(self, correo, contraseña, es_administrador):
        self.correo = correo
        self.contraseña = contraseña
        self.es_administrador = es_administrador

    def __str__(self):
        return f"Login(correo={self.correo}, contraseña={self.contraseña}, es_administrador={self.es_administrador})"

        #Vamos a hashear las contraseñas?