package com.smartHiringPipeline.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "recruiters")
@Data
@NoArgsConstructor
public class Recruiter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recruiterId")
    private Long recruiterId;

    @OneToOne
    @JoinColumn(name = "userId",nullable = false,unique = true)
    private User user;

    private String designation;

    private String email;

    @ManyToOne
    @JoinColumn(name = "companyId")
    private Company company;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate(){
        createdAt=LocalDateTime.now();
        updatedAt=LocalDateTime.now();
    }

    @PreUpdate
    protected void upDate(){
        updatedAt=LocalDateTime.now();
    }

}
