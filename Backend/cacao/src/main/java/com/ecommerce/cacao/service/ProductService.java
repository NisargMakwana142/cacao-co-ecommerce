package com.ecommerce.cacao.service;

import com.ecommerce.cacao.entity.Product;
import com.ecommerce.cacao.exception.ResourceNotFoundException;
import com.ecommerce.cacao.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }


    //GetAll
    public List<Product> getAllProducts(){
        return productRepository.findAll();
    }

    //GetById
    public Product getProductById(Long id){
        return productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found with id:" +id));
    }

    //CreateProduct
    public Product createProduct(Product product){
        return productRepository.save(product);
    }

    //UpdateProduct
    public Product updateProduct(Long id, Product updatedProduct){
        Product existingProduct = getProductById(id);

        existingProduct.setName(updatedProduct.getName());
        existingProduct.getCategory(updatedProduct.getCategory());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setStock(updatedProduct.getStock());
        existingProduct.setImage(updatedProduct.getImage());
        existingProduct.setIsNew(updatedProduct.getIsNew());

        return productRepository.save(existingProduct);

    }

    //DeleteProduct
    public void deleteProduct(Long id){

        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Product not found with id: " +id
            );
        }

        productRepository.deleteById(id);

    }

    //GetByCategory
    public List<Product> getProductByCategory(String category) {
        return productRepository.findByCategory(category);
    }

}
