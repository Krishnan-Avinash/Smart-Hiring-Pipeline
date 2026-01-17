package com.smartHiringPipeline.demo.repository;

import com.smartHiringPipeline.demo.entity.ResumeScore;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ResumeScoreRepository extends JpaRepository<ResumeScore,Long> {
    ResumeScore findByResumeScoreId(Long resumeScoreId);
    Optional<ResumeScore> findByApplication_ApplicationId(Long applicationId);
}
