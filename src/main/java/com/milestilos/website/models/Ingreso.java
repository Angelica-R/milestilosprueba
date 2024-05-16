package com.milestilos.website.models;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@RequiredArgsConstructor
@Getter
@AllArgsConstructor
@Entity
public class Ingreso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String numeroDocumento;
    private LocalDate fechaDocumento;
    @ManyToOne
    @JsonBackReference("proveedor")
    private Proveedor proveedor;

    @OneToMany(mappedBy = "ingreso", cascade = CascadeType.ALL)
    @JsonManagedReference("detalle_ingreso")
    private List<DetalleIngreso> detalleIngreso;

    public double getTotal() {
        double total = 0;
        for(DetalleIngreso di : this.detalleIngreso) {
            total += di.getTotal();
        }
        return total;
    }

    public double getSubTotal() {
        return this.getTotal() / 1.18;
    }

    public double getIgv() {
        return this.getSubTotal() * 0.18;
    }

}
