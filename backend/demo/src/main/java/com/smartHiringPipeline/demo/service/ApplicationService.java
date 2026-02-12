package com.smartHiringPipeline.demo.service;

import com.smartHiringPipeline.demo.entity.Application;
import com.smartHiringPipeline.demo.entity.Candidate;
import com.smartHiringPipeline.demo.entity.Job;
import com.smartHiringPipeline.demo.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    public ApplicationService(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    public void saveNewApplication(Job job, Candidate candidate,String appliedResumeUrl){
        Application application=new Application();
        application.setJob(job);
        application.setCandidate(candidate);
        application.setAppliedResumeUrl(appliedResumeUrl);
        applicationRepository.save(application);
    }

    public void saveApplication(Application app){
        applicationRepository.save(app);
    }

    public Application findByApplicationId(Long applicationId){
        return applicationRepository.findByApplicationId(applicationId);
    }

    public List<Application> findByJobId(Long jobId){
        return applicationRepository.findByJob_JobId(jobId);
    }

    public List<Application> find(Long userId){
        return applicationRepository.findByCandidate_User_UserId(userId);
    }
}
