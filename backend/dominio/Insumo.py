class Insumo:
    def __init__ (self,id, nombre,descripcion,tipo,precio_unitario,rut_proveedor):
        self.id = id
        self.nombre = nombre
        self.descripcion = descripcion
        self.tipo = tipo
        self.precio_unitario = precio_unitario
        self.rut_proveedor = rut_proveedor
        
    
    def __repr__(self):
        return (f"Insumo(id={self.id}, nombre={self.nombre}, descripcion={self.descripcion}, tipo={self.tipo}, precio_unitario={self.precio_unitario}, rut_proveedor={self.rut_proveedor})")

