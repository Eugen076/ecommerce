package com.example.ecommerce.service;

import com.example.ecommerce.model.Cart;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.model.User;
import com.example.ecommerce.repository.CartRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public List<Cart> getCart(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return null;
        return cartRepository.findByUser(user);
    }

    public Cart addProduct(Long userId, Long productId, int quantity) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return null;

        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) return null;

        List<Cart> userCart = cartRepository.findByUser(user);
        for (Cart c : userCart) {
            if (c.getProduct().getId().equals(productId)) {
                c.setQuantity(c.getQuantity() + quantity);
                return cartRepository.save(c);
            }
        }

        Cart cart = new Cart();
        cart.setUser(user);
        cart.setProduct(product);
        cart.setQuantity(quantity);
        return cartRepository.save(cart);
    }
}
