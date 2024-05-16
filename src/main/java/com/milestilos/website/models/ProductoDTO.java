package com.milestilos.website.models;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductoDTO {
    private Integer id;
    private String codigo;
    private String descripcion;
    private String categoria;
    private String marca;
    private BigDecimal precioVenta;
    private String informacionGeneral;
    private String imagenUrl;
}
