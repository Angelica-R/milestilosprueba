package com.milestilos.website.services;

import com.milestilos.website.models.Producto;
import com.milestilos.website.models.ProductoDTO;
import com.milestilos.website.repositories.ProductoRepository;
import lombok.extern.slf4j.Slf4j;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class ProductoService {

    public static String UPLOAD_DIRECTORY = System.getProperty("user.dir") + "/uploads";

    private ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    public Producto save(Producto producto, MultipartFile file) throws IOException {
        if (file != null && !file.isEmpty()) {
            Path fileNameAndPath = Paths.get(UPLOAD_DIRECTORY, file.getOriginalFilename());
            Files.write(fileNameAndPath, file.getBytes());
            String imagenUrl = "/admin/productos/images/" + file.getOriginalFilename();
            producto.setImagenUrl(imagenUrl);
        }
        return productoRepository.save(producto);
    }

    public List<Producto> findTop4ByOrderByIdAsc(){
        return this.productoRepository.findTop4ByOrderByIdAsc();
    }

    public Producto actualizarProducto(Producto producto){
        return this.productoRepository.save(producto);
    }

    public List<Producto> findAll() {
        return this.productoRepository.findAll();
    }

    public void deleteById(Integer id){
        this.productoRepository.deleteById(id);
    }


    public Producto getById(Integer id){
        Producto producto = this.productoRepository.findById(id).orElseThrow();
        return producto;
    }

    public byte[] getImageBytes(String fileName) throws IOException {
        return Files.readAllBytes(Paths.get(ProductoService.UPLOAD_DIRECTORY, fileName));
    }


    public List<Producto> findByDescripcionContaining(String nombre) {
        return this.productoRepository.findByDescripcionContaining(nombre);
    }

    public List<Producto> findByDescripcionContainingAndStockGreaterThanEqual(String nombre, int stock) {
        return this.productoRepository.findByDescripcionContainingAndStockGreaterThanEqual(nombre, stock);
    }

    public ProductoDTO findByCodigo(String codigo) {
        Producto productoEncontrado = this.productoRepository.findByCodigo(codigo);
        ModelMapper modelMapper = new ModelMapper();
        ProductoDTO productoDTO = modelMapper.map(productoEncontrado, ProductoDTO.class);
        return productoDTO;
    }
}
