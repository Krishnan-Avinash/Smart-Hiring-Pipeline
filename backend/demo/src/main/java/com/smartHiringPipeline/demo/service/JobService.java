package com.smartHiringPipeline.demo.service;

import com.smartHiringPipeline.demo.dto.job.JobCreationUpdationRequest;
import com.smartHiringPipeline.demo.entity.Company;
import com.smartHiringPipeline.demo.entity.Job;
import com.smartHiringPipeline.demo.entity.User;
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

    public void saveNewService(JobCreationUpdationRequest body, User user, Company company){
        Job job=new Job();
        job.setCompany(company);
        job.setCreatedBy(user);
        job.setTitle(body.getTitle());
        job.setDescription(body.getDescription());
        job.setLocation(body.getLocation());
        job.setEmploymentType(body.getEmploymentType());
        job.setExperienceMin(body.getExperienceMin());
        job.setExperienceMax(body.getExperienceMax());
        job.setRequiredSkills(body.getRequiredSkills());
        job.setPrioritySkills(body.getPrioritySkills());
        job.setStatus(body.getStatus());
        jobRepository.save(job);
    }

    public void saveJob(Job job){
        jobRepository.save(job);
    }

    public Job findByJobId(Long jobId,String createdBy){
        return jobRepository.findByJobIdAndCreatedBy_UserName(jobId,createdBy);
    }
    public Job findByJobId(Long jobId){
        return jobRepository.findByJobId(jobId);
    }

    public boolean deleteById(Long jobId,String createdBy){
        Job job=findByJobId(jobId,createdBy);
        jobRepository.delete(job);
        return findByJobId(jobId) == null;
    }
}
