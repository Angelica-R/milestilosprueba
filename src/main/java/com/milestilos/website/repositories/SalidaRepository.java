package com.milestilos.website.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.milestilos.website.models.Salida;

@Repository
public interface SalidaRepository extends JpaRepository<Salida, Integer> {
    List<Salida> findByValidadoPorIsNull();

    List<Salida> findByFechaDocumentoAndValidadoPorIsNotNull(LocalDate fecha);
}
