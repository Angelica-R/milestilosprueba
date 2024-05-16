package com.milestilos.website.models;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonBackReference;

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
@Entity
@Data
public class DetalleSalida {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer productoId;
    private String descripcionProducto;
    private Integer cantidad;
    @Column(nullable = false)
    private BigDecimal precioVentaUnitario = new BigDecimal(0);
    @ManyToOne
    @JoinColumn(name = "salida_id")
    @JsonBackReference("detalle_salida")
    private Salida salida;

    public double getTotal() {
        return this.cantidad * this.precioVentaUnitario.doubleValue();
    }
}
