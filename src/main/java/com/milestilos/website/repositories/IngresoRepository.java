package com.milestilos.website.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.milestilos.website.models.Ingreso;

@Repository
public interface IngresoRepository extends JpaRepository<Ingreso, Integer>{
    
    @Query("SELECT MONTH(c.fechaDocumento), SUM(dc.cantidad * dc.precioCompraUnitario) " +
           "FROM Ingreso c " +
           "JOIN c.detalleIngreso dc " +
           "WHERE YEAR(c.fechaDocumento) = :anio " +
           "GROUP BY MONTH(c.fechaDocumento)")
    List<Object[]> getTotalesMensualesPorAnio(@Param("anio") int anio);
    
}
