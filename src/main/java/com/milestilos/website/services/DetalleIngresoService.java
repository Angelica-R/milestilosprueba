package com.milestilos.website.services;

import org.springframework.stereotype.Service;

import com.milestilos.website.repositories.DetalleIngresoRepository;

@Service
public class DetalleIngresoService {
    private DetalleIngresoRepository detalleIngresoRepository;

    public DetalleIngresoService(DetalleIngresoRepository detalleIngresoRepository) {
        this.detalleIngresoRepository = detalleIngresoRepository;
    }

}
