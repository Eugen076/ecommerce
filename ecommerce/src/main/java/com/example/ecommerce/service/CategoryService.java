package com.example.ecommerce.service;

import com.example.ecommerce.model.Category;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Category saveCategory(Category category) {
        if (category.getProducts() != null) {
            for (Product product : category.getProducts()) {
                product.setCategory(category); // setează relația
            }
        }
        return categoryRepository.save(category);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id " + id));

        categoryRepository.delete(category); // cascade delete va șterge și produsele
    }



    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id " + id));

        category.setName(categoryDetails.getName());

        if (categoryDetails.getProducts() != null) {
            for (Product product : categoryDetails.getProducts()) {
                product.setCategory(category);
            }
            category.setProducts(categoryDetails.getProducts());
        }

        return categoryRepository.save(category);
    }

}
