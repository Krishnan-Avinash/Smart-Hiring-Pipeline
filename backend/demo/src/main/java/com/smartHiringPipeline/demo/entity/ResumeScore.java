package com.smartHiringPipeline.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "resumeScores")
@Data
@NoArgsConstructor
public class ResumeScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long resumeScoreId;

    @OneToOne
    @JoinColumn(name="applicationId",nullable = false)
    private Application application;

    private Integer keywordScore;
    private Integer aiScore;
    private Integer finalScore;

    private LocalDateTime scoredAt;

    @PrePersist
    protected void onCreate() {
        scoredAt = LocalDateTime.now();
    }

}
