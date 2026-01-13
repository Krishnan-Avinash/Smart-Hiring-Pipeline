package com.smartHiringPipeline.demo.service;

import com.smartHiringPipeline.demo.entity.Job;
import com.smartHiringPipeline.demo.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class JobService {
    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public List<Job> findByCompanyId(Long id){
        return jobRepository.findByCompany_CompanyId(id);

    }
}
