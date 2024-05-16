package com.milestilos.website.services;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;

import com.milestilos.website.models.Proveedor;
import com.milestilos.website.repositories.ProveedorRepository;

@Service
public class ProveedorService {
    
    private ProveedorRepository proveedorRepository;

    public ProveedorService(ProveedorRepository proveedorRepository) {
        this.proveedorRepository = proveedorRepository;
    }
    public List<Proveedor> findByNombreContaining(String nombre) {
        return this.proveedorRepository.findByNombreContaining(nombre);
    }
    public Proveedor getById(Integer id) {
        Proveedor proveedor = this.proveedorRepository.findById(id).orElseThrow();
        return proveedor;
    }
    public List<Proveedor> findAll() {
        return this.proveedorRepository.findAll();
    }

    public Proveedor save(Proveedor proveedor) throws IOException {
        /* 
        if (file != null && !file.isEmpty()) {
            Path fileNameAndPath = Paths.get(UPLOAD_DIRECTORY, file.getOriginalFilename());
            Files.write(fileNameAndPath, file.getBytes());
            String imagenUrl = "/admin/productos/images/" + file.getOriginalFilename();
            producto.setImagenUrl(imagenUrl);
        }
        */
        return proveedorRepository.save(proveedor);
    }

   

    public Proveedor actualizarProveedor(Proveedor proveedor){
        return this.proveedorRepository.save(proveedor);
    }

    public void deleteById(Integer id){
        this.proveedorRepository.deleteById(id);
    }


}
