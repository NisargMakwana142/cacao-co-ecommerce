package com.ecommerce.cacao.contoller;

import com.ecommerce.cacao.dto.OrderRequest;
import com.ecommerce.cacao.entity.Order;
import com.ecommerce.cacao.entity.OrderStatus;
import com.ecommerce.cacao.service.OrderService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    public OrderController(
            OrderService orderService
    ) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(
            @Valid @RequestBody OrderRequest request,
            Authentication authentication
    ) {

        String userEmail =
                authentication.getName();

        return ResponseEntity.ok(
                orderService.createOrder(
                        request,
                        userEmail
                )
        );
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {

        return ResponseEntity.ok(
                orderService.getAllOrders()
        );
    }

    @GetMapping("/my")
    public ResponseEntity<List<Order>> getMyOrders(
            Authentication authentication
    ) {

        String userEmail =
                authentication.getName();

        return ResponseEntity.ok(
                orderService.getMyOrders(
                        userEmail
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrder(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                orderService.getOrderById(id)
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status
    ) {

        return ResponseEntity.ok(
                orderService.updateStatus(
                        id,
                        status
                )
        );
    }
}