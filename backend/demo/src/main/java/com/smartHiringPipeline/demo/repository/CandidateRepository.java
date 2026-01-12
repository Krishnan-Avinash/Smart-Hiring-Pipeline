package com.smartHiringPipeline.demo.repository;

import com.smartHiringPipeline.demo.entity.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateRepository extends JpaRepository<Candidate,Long> {
    Candidate findByCandidateId(Long candidateId);
    Candidate findByUser_UserId(Long userId);
}
