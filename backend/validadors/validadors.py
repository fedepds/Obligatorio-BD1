#acá vamos a colocar todos los validadores que necesitemos para que el usuario no pueda ingresar correos sin @ , ser menor de edad, etc
#validados desde el backend 
def correo_valido(correo_electronico):
    return "@" in correo_electronico and "." in correo_electronico.split("@")[-1]

def telefono_valido(telefono):
    return telefono.isdigit() and 7 <= len (telefono) <= 12 #4352xxxx +598098xxxxxx #poner un aviso en el front que no se coloque signos.}

def ci_valido(ci):
    return ci.isdigit() and len(ci) == 8 #Validamos que el CI sea un número de 8 dígitos

def nombre_valido(nombre):
    return len(nombre) > 0 and nombre.isalpha() #Validamos que el nombre no esté vacío y contenga solo letras

# the  isalpha() method returns True if all the characters are alphabet letters (a-z). https://www.w3schools.com/python/ref_string_isalpha.asp

def apellido_valido(apellido):
    return len(apellido) > 0 and apellido.isalpha() # si vamos a permitir apellidos vacios eliminamos esta funcion.