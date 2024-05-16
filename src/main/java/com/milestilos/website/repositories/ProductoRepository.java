package com.milestilos.website.repositories;

import com.milestilos.website.models.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {
    List<Producto> findByDescripcionContaining(String descripcion);
    List<Producto> findByDescripcionContainingAndStockGreaterThanEqual(String descripcion, int stock);
    Producto findByCodigo(String codigo);
    List<Producto> findTop4ByOrderByIdAsc();

}

