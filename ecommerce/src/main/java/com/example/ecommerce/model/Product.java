package com.example.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private double price;
    private String description;
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "categoryId", nullable = false)
    @JsonBackReference
    private Category category;
}
