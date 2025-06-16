class Insumo:
    def __init__ (self,codigo, nombre,descripcion,cantidad,precio,proveedor_id):
        self.codigo = codigo
        self.nombre = nombre
        self.descripcion = descripcion
        self.cantidad = cantidad
        self.precio = precio
        self.proveedor_id = proveedor_id
    
    def __repr__(self):
        return (f"Insumo(codigo={self.codigo}, nombre={self.nombre}, descripcion={self.descripcion}, cantidad={self.cantidad}, precio={self.precio}, proveedor_id={self.proveedor_id})")
    