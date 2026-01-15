package com.smartHiringPipeline.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "applications",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"candidateId", "jobId"})
        }
)
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long applicationId;

    @ManyToOne
    @JoinColumn(name = "candidateId", nullable = false)
    private Candidate candidate;

    @ManyToOne
    @JoinColumn(name = "jobId", nullable = false)
    private Job job;

    private String status = "APPLIED";

    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        appliedAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
