package com.example.ecommerce.controller;

import com.example.ecommerce.dto.AddToCartRequest;
import com.example.ecommerce.model.Cart;
import com.example.ecommerce.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "http://localhost:5173/")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Cart>> getCart(@PathVariable Long userId) {
        List<Cart> cart = cartService.getCart(userId);
        if (cart == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/{userId}/add")
    public ResponseEntity<List<Cart>> addProduct(
            @PathVariable Long userId,
            @RequestBody AddToCartRequest request) {
        Cart cart = cartService.addProduct(userId, request.getProductId(), request.getQuantity());
        if (cart == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(cartService.getCart(userId));
    }
}
