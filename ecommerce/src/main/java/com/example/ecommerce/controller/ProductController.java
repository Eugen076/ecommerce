package com.example.ecommerce.controller;

import com.example.ecommerce.model.Product;
import com.example.ecommerce.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173/")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        products.forEach(product -> {
            if (product.getImageUrl() == null
                    || product.getImageUrl().isEmpty()
                    || product.getImageUrl().contains("exemplu.com")) {
                product.setImageUrl("http://localhost:8080/vin.jpg");
            }
        });
        return products;
    }

    @GetMapping("/category/{categoryId}")
    public List<Product> getAllProductsByCategory(@PathVariable Long categoryId) {
        return productService.getProductByCategory(categoryId);
    }

    @PostMapping
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        Product createdProduct = productService.addProduct(product);
        return ResponseEntity.ok(createdProduct);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        Product updatedProduct = productService.updateProduct(id, product);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok("Product with id " + id + " deleted successfully.");
    }
}
