package com.ecommerce.cacao.repository;

import com.ecommerce.cacao.entity.Order;
import com.ecommerce.cacao.entity.OrderStatus;
import com.ecommerce.cacao.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository
        extends JpaRepository<Order, Long> {

    List<Order> findAllByOrderByCreatedAtDesc();

    List<Order> findByStatusOrderByCreatedAtDesc(
            OrderStatus status
    );

    List<Order> findByUserOrderByCreatedAtDesc(
            User user
    );
}