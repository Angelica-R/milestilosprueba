package com.milestilos.website.controllers.admin;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.milestilos.website.models.Cliente;
import com.milestilos.website.services.ClienteService;

@Controller
@RequestMapping("/admin/clientes")
public class ClienteController {
    
    private ClienteService clienteService;

    public ClienteController(ClienteService clienteService){
        this.clienteService = clienteService;
    }
    
    @GetMapping("/buscar-clientes-api")
	@ResponseBody
	public List<Cliente> buscarClientes(@RequestParam("nombre") String nombre) {
		List<Cliente> clientes = this.clienteService.findByNombreContaining(nombre);
		return clientes;
	}
}
