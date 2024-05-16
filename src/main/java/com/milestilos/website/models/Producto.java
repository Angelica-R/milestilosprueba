package com.milestilos.website.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PostPersist;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RequiredArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@Data
@Entity
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String codigo;
    private String descripcion;
    private String categoria;
    private String marca;
    private BigDecimal precioVenta;
    @Column(nullable = false)
    private Integer stock = 0;
    @Column(nullable = false)
    private Integer stockMinimo = 0;
    private String imagenUrl;
    @Column(columnDefinition = "TEXT")
    private String informacionGeneral;

    public String getImagenUrl() {
        return ServletUriComponentsBuilder.fromCurrentContextPath().path(this.imagenUrl).toUriString();
    }

    public void agregarStock(Integer cantidad){
        this.stock += cantidad;
    }

    public void disminuirStock(Integer cantidad){
        this.stock -= cantidad;
    }

    @PostPersist
    private void postPersist() {
        // Generar el código con el formato deseado después de la persistencia
        this.codigo = "ME-JCK-" + String.format("%04d", this.id);
    }
}
