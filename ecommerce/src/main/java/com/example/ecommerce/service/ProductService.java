package com.example.ecommerce.service;

import com.example.ecommerce.model.Product;
import com.example.ecommerce.repository.CartRepository;
import com.example.ecommerce.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CartRepository cartRepository;

    public ProductService(ProductRepository productRepository, CartRepository cartRepository) {
        this.productRepository = productRepository;
        this.cartRepository = cartRepository;
    }
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public Product addProduct(Product product) {
        if (product.getImageUrl() == null || product.getImageUrl().isEmpty()) {
            product.setImageUrl("http://localhost:8080/vin.jpg");
        }
        return productRepository.save(product);
    }


    public Product updateProduct(Long productId, Product updatedProduct) {
        Optional<Product> existingProductOpt = productRepository.findById(productId);

        if (existingProductOpt.isPresent()) {
            Product existingProduct = existingProductOpt.get();
            existingProduct.setName(updatedProduct.getName());
            existingProduct.setDescription(updatedProduct.getDescription());
            existingProduct.setPrice(updatedProduct.getPrice());
            existingProduct.setCategory(updatedProduct.getCategory());
            return productRepository.save(existingProduct);
        } else {
            throw new RuntimeException("Product with id " + productId + " not found.");
        }
    }

    @Transactional
    public void deleteProduct(Long productId) {
        if (productRepository.existsById(productId)) {
            cartRepository.deleteByProductId(productId);
            productRepository.deleteById(productId);
        } else {
            throw new RuntimeException("Product with id " + productId + " not found.");
        }
    }
}
