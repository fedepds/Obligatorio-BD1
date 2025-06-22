class Login:
    def _init_ (self,correo, password, es_administrador ):
        self.correo = correo
        self.password = password
        self.es_administrador = es_administrador
    
    def _str_(self):
        return f"Login(correo={self.correo}, password={self.password}, es_administrador={self.es_administrador})"

        #Vamos a hashear las contraseñas?