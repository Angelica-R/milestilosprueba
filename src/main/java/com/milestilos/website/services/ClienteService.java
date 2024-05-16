package com.milestilos.website.services;

import com.milestilos.website.models.Cliente;
import com.milestilos.website.repositories.ClienteRepository;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class ClienteService {

    private ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository){
        this.clienteRepository = clienteRepository;
    }

    public Cliente save(Cliente cliente){
        Cliente clienteExistente = this.clienteRepository.findByDni(cliente.getDni());
        if (clienteExistente != null) {
            return clienteExistente;
        }
        return this.clienteRepository.save(cliente);
    }

    public List<Cliente> findByNombreContaining(String nombre) {
        return this.clienteRepository.findByNombreContaining(nombre);
    }
}
