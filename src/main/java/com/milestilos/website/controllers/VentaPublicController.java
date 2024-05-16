package com.milestilos.website.controllers;

import com.milestilos.website.models.Cliente;
import com.milestilos.website.services.ClienteService;
import org.springframework.web.bind.annotation.*;

import com.milestilos.website.models.Salida;
import com.milestilos.website.services.SalidaService;

@RestController
@RequestMapping("/ventas")
public class VentaPublicController {
    private SalidaService salidaService;
	private ClienteService clienteService;

	public VentaPublicController(SalidaService salidaService, ClienteService clienteService) {
		this.salidaService = salidaService;
		this.clienteService = clienteService;
	}

    @PostMapping("/registrar-pedido")
	public Salida registrarPedido(@RequestBody Salida salida) {
		salida.setVendedor("chatbot");
		Salida salidaRegistrada = this.salidaService.save(salida);
		return salidaRegistrada;
	}

	@PostMapping("/registrar-cliente-pedido")
	public Salida registraClientePedido(@RequestBody Cliente cliente, @RequestParam int pedidoId) {
		Cliente clienteRegistrado = this.clienteService.save(cliente);
		Salida salidaDelCliente = this.salidaService.getById(pedidoId);
		salidaDelCliente.setCliente(clienteRegistrado);
		this.salidaService.actualizarCliente(salidaDelCliente);

		return salidaDelCliente;
	}
}
