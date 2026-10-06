package com.ecommerce.cacao.service;

import com.ecommerce.cacao.dto.OrderItemRequest;
import com.ecommerce.cacao.dto.OrderRequest;
import com.ecommerce.cacao.entity.Order;
import com.ecommerce.cacao.entity.OrderItem;
import com.ecommerce.cacao.entity.OrderStatus;
import com.ecommerce.cacao.entity.Product;
import com.ecommerce.cacao.entity.User;
import com.ecommerce.cacao.exception.InsufficientStockException;
import com.ecommerce.cacao.exception.ResourceNotFoundException;
import com.ecommerce.cacao.repository.OrderRepository;
import com.ecommerce.cacao.repository.ProductRepository;
import com.ecommerce.cacao.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private static final BigDecimal FREE_SHIPPING_THRESHOLD =
            new BigDecimal("2500.00");

    private static final BigDecimal SHIPPING_FEE =
            new BigDecimal("150.00");

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderService(
            OrderRepository orderRepository,
            ProductRepository productRepository,
            UserRepository userRepository
    ) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Order createOrder(
            OrderRequest request,
            String userEmail
    ) {

        User user = userRepository
                .findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );

        Order order = new Order();

        order.setUser(user);
        order.setCustomerName(request.getCustomerName());
        order.setEmail(request.getEmail());
        order.setPhone(request.getPhone());
        order.setAddress(request.getAddress());

        List<OrderItem> orderItems =
                new ArrayList<>();

        BigDecimal subtotal =
                BigDecimal.ZERO;

        for (OrderItemRequest itemRequest :
                request.getItems()) {

            Product product =
                    productRepository
                            .findById(
                                    itemRequest.getProductId()
                            )
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Product not found with id: "
                                                    + itemRequest.getProductId()
                                    )
                            );

            int quantity =
                    itemRequest.getQuantity();

            if (product.getStock() < quantity) {
                throw new InsufficientStockException(
                        "Not enough stock for product: "
                                + product.getName()
                );
            }

            BigDecimal itemPrice =
                    product.getPrice();

            BigDecimal itemSubtotal =
                    itemPrice.multiply(
                            BigDecimal.valueOf(quantity)
                    );

            OrderItem orderItem =
                    new OrderItem();


            orderItem.setProduct(product);
            orderItem.setProductName(product.getName());
            orderItem.setPrice(itemPrice);
            orderItem.setQuantity(quantity);
            orderItem.setSubtotal(itemSubtotal);

            /*
             * OrderItem.setOrder() is assigned again below
             * after the object has been created.
             */
            orderItem.setOrder(order);

            orderItems.add(orderItem);

            subtotal =
                    subtotal.add(itemSubtotal);

            product.setStock(
                    product.getStock() - quantity
            );

            productRepository.save(product);
        }

        BigDecimal shipping =
                subtotal.compareTo(
                        FREE_SHIPPING_THRESHOLD
                ) >= 0
                        ? BigDecimal.ZERO
                        : SHIPPING_FEE;

        BigDecimal total =
                subtotal.add(shipping);

        order.setItems(orderItems);
        order.setSubtotalAmount(subtotal);
        order.setShippingAmount(shipping);
        order.setTotalAmount(total);

        return orderRepository.save(order);
    }

    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        return orderRepository
                .findAllByOrderByCreatedAtDesc();
    }

    @Transactional(readOnly = true)
    public List<Order> getMyOrders(
            String userEmail
    ) {

        User user = userRepository
                .findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );

        return orderRepository
                .findByUserOrderByCreatedAtDesc(user);
    }

    @Transactional(readOnly = true)
    public Order getOrderById(Long id) {

        return orderRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with id: " + id
                        )
                );
    }

    @Transactional
    public Order updateStatus(
            Long id,
            OrderStatus status
    ) {

        Order order = getOrderById(id);

        order.setStatus(status);

        return orderRepository.save(order);
    }
}