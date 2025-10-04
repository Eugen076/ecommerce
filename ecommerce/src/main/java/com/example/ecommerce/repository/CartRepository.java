package com.example.ecommerce.repository;

import com.example.ecommerce.model.Cart;
import com.example.ecommerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUser(User user);

    @Modifying
    @Transactional
    @Query("DELETE FROM Cart c WHERE c.product.id = :productId")
    void deleteByProductId(Long productId);
}
