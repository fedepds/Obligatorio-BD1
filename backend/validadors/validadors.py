#acá vamos a colocar todos los validadores que necesitemos para que el usuario no pueda ingresar correos sin @ , ser menor de edad, etc
#validados desde el backend 
def correo_valido(correo_electronico):
    return "@" in correo_electronico and "." in correo_electronico.split("@")[-1]

