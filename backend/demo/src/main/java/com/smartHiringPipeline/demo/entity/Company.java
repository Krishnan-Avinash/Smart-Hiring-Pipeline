package com.smartHiringPipeline.demo.entity;

import jakarta.persistence.*;
import lombok.NonNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "companies")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="companyId")
    private Long companyId;

    @Column(nullable = false)
    private String name;

    private String description;

    private String websiteUrl;

    private String industry;

    @ManyToOne
    @JoinColumn(name = "userName",nullable = false)
    private User createdBy;

    @Column
    private boolean isActive=true;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
