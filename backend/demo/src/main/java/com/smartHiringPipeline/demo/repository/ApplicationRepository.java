package com.smartHiringPipeline.demo.repository;

import com.smartHiringPipeline.demo.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application,Long> {
    Application findByApplicationId(Long applicationId);

    List<Application> findByJob_JobId(Long jobId);
}
