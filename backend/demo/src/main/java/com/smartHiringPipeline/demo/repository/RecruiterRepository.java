package com.smartHiringPipeline.demo.repository;

import com.smartHiringPipeline.demo.entity.Recruiter;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecruiterRepository extends JpaRepository<Recruiter,Long> {
    Recruiter findByUser_UserId(Long userUserId);
}
