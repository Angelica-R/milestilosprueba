package com.milestilos.website.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.milestilos.website.models.DetalleIngreso;

@Repository
public interface DetalleIngresoRepository extends JpaRepository<DetalleIngreso, Integer>{
    
}
