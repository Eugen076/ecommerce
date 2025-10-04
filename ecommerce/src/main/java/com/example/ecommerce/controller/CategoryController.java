package com.example.ecommerce.controller;

import com.example.ecommerce.model.Category;
import com.example.ecommerce.service.CategoryService;
//lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//Slf4j
@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "http://localhost:5173/")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public Category saveCategory(@RequestBody Category category) {
        System.out.println("Received category: " + category);
        return categoryService.saveCategory(category);
    }

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @DeleteMapping("/{id}") public String deleteCategory(@PathVariable Long id) {
        try {
            categoryService.deleteCategory(id);
            return "Category deleted successfully"; }
        catch (Exception e) {
            return "Error deleting category: " + e.getMessage();
        }
    }

    @PutMapping("/{id}")
    public Category updateCategory(@PathVariable Long id, @RequestBody Category categoryDetails) {
        return categoryService.updateCategory(id, categoryDetails);
    }

}
