package com.smartHiringPipeline.demo.controller;

import com.smartHiringPipeline.demo.dto.application.ApplicationResponse;
import com.smartHiringPipeline.demo.dto.application.StatusUpdationRequest;
import com.smartHiringPipeline.demo.entity.Application;
import com.smartHiringPipeline.demo.entity.Candidate;
import com.smartHiringPipeline.demo.entity.Job;
import com.smartHiringPipeline.demo.entity.User;
import com.smartHiringPipeline.demo.service.ApplicationService;
import com.smartHiringPipeline.demo.service.CandidateService;
import com.smartHiringPipeline.demo.service.JobService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("application")
@PreAuthorize("hasRole('CANDIDATE')")
public class ApplicationController {

    private final JobService jobService;
    private final ApplicationService applicationService;
    private final CandidateService candidateService;

    public ApplicationController(JobService jobService,ApplicationService applicationService, CandidateService candidateService) {
        this.jobService = jobService;
        this.applicationService = applicationService;
        this.candidateService = candidateService;
    }

    @PostMapping("createApplication/{id}")
    public ResponseEntity<?> createApplication(Authentication authentication,@PathVariable Long id){
        User user=(User)authentication.getPrincipal();
        Job job=jobService.findByJobId(id);
        Candidate candidate=candidateService.findByUserId(user.getUserId());
        applicationService.saveNewApplication(job,candidate);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("getApplication/{applicationId}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ApplicationResponse getApplication(@PathVariable Long applicationId, Authentication authentication){
        User user=(User)authentication.getPrincipal();
        Application app= applicationService.findByApplicationId(applicationId);
        System.out.println(app);
        ApplicationResponse res=new ApplicationResponse();
        res.setApplicationId(app.getApplicationId());
        res.setStatus(app.getStatus());
        res.setName(app.getCandidate().getUser().getUserName());
        res.setEmail(app.getCandidate().getUser().getEmail());
        res.setResumeUrl(app.getCandidate().getResumeUrl());
        return res;
    }

    @GetMapping("getApplicationsForAJob/{jobId}")
    public List<ApplicationResponse> getApplicationsForAJob(@PathVariable Long jobId){
        return applicationService.findByJobId(jobId)
                .stream()
                .map(app -> new ApplicationResponse(
                        app.getApplicationId(),
                        app.getStatus(),
                        app.getCandidate().getUser().getUserName(),
                        app.getCandidate().getUser().getEmail(),
                        app.getCandidate().getResumeUrl()
                ))
                .toList();
    }

    @PatchMapping("updateStatus/{applicationId}")
    public void updateStatus(@PathVariable Long applicationId, @RequestBody StatusUpdationRequest body){
        Application app=applicationService.findByApplicationId(applicationId);
        app.setStatus(body.getStatus());
        applicationService.saveApplication(app);
    }

}
