package com.milestilos.website.models;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@RequiredArgsConstructor
@Entity
@Getter
@Setter
@AllArgsConstructor
public class Salida {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String numeroDocumento;
    private LocalDate fechaDocumento;
    private LocalDateTime fechaHoraRegistro;
    private String vendedor;
    private String validadoPor;
    private LocalDateTime fechaHoraValidacion;
    @ManyToOne
    private Cliente cliente;
    @OneToMany(mappedBy = "salida", cascade = CascadeType.ALL)
    @JsonManagedReference("detalle_salida")
    List<DetalleSalida> detalleSalida;

    public double getTotal() {
        double total = 0;
        for(DetalleSalida ds : this.detalleSalida) {
            total += ds.getTotal();
        }
        return total;
    }

    public double getSubTotal() {
        return this.getTotal() / 1.18;
    }

    public double getIgv() {
        return this.getSubTotal() * 0.18;
    }

    @PrePersist
    protected void onCreate() {
        this.fechaHoraRegistro = LocalDateTime.now();
    }
}
