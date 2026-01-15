package com.smartHiringPipeline.demo.repository;

import com.smartHiringPipeline.demo.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job,Long> {
    List<Job> findByCompany_CompanyId(Long companyId);
    Job findByJobIdAndCreatedBy_UserName(Long jobId,String userName);
}



