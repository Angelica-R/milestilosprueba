package com.milestilos.website.models;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonBackReference;

import groovy.transform.ToString;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
@AllArgsConstructor
@Data
@Entity
public class DetalleIngreso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer productoId;
    private String descripcionProducto;
    private Integer cantidad;
    @Column(columnDefinition = "DECIMAL(10, 2) DEFAULT 0.00")
    private BigDecimal precioCompraUnitario;
    @ManyToOne
    @JoinColumn(name = "ingreso_id")
    @JsonBackReference("detalle_ingreso")
    private Ingreso ingreso;

    public double getTotal() {
        return this.cantidad * this.precioCompraUnitario.doubleValue();
    }

}
