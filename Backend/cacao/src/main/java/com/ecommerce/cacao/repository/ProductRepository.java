package com.ecommerce.cacao.repository;

import com.ecommerce.cacao.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategory(String category);

    List<Product> findByStockGreaterThan(Integer stock);

}
