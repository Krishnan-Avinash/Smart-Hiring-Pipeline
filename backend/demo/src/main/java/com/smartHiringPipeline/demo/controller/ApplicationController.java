package com.smartHiringPipeline.demo.controller;

import com.smartHiringPipeline.demo.dto.application.ApplicationResponse;
import com.smartHiringPipeline.demo.dto.application.ApplicationResponseForCandidate;
import com.smartHiringPipeline.demo.dto.application.ApplyInCompany;
import com.smartHiringPipeline.demo.dto.application.StatusUpdationRequest;
import com.smartHiringPipeline.demo.entity.*;
import com.smartHiringPipeline.demo.service.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("application")

public class ApplicationController {

    private final JobService jobService;
    private final ApplicationService applicationService;
    private final CandidateService candidateService;
    private final ResumeScoreService resumeScoreService;
    private final RecruiterService recruiterService;
    private final UserService userService;

    public ApplicationController(JobService jobService, ApplicationService applicationService, CandidateService candidateService, ResumeScoreService resumeScoreService, RecruiterService recruiterService, UserService userService) {
        this.jobService = jobService;
        this.applicationService = applicationService;
        this.candidateService = candidateService;
        this.resumeScoreService = resumeScoreService;
        this.recruiterService = recruiterService;
        this.userService = userService;
    }
    @PreAuthorize("hasRole('CANDIDATE')")
    @PostMapping("createApplication/{id}")
    public ResponseEntity<?> createApplication(Authentication authentication, @PathVariable Long id, @RequestBody ApplyInCompany body){
        User user=(User)authentication.getPrincipal();
        Job job=jobService.findByJobId(id);
        if(job == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Job not found");
        }
        Candidate candidate=candidateService.findByUserId(user.getUserId());
        System.out.println("CANDIDATEEEEEEEEEEEEEEEEEEEEEEEEEE"+candidate);
        if (candidate == null) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Candidate profile not found");
        }
        applicationService.saveNewApplication(job,candidate,body.getAppliedResumeUrl());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Application created successfully");
    }

    @GetMapping("getApplication/{applicationId}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<?> getApplication(@PathVariable Long applicationId,Authentication authentication){
        User user = (User) authentication.getPrincipal();
        Application app =applicationService.findByApplicationId(applicationId);

        if (app == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Application not found");
        }
        if (!app.getCandidate().getUser().getUserId().equals(user.getUserId())) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("You are not allowed to view this application");
        }

        ApplicationResponse res = new ApplicationResponse();
        ResumeScore temp=resumeScoreService.findByApplicationId(app.getApplicationId()).orElse(null);
        res.setApplicationId(app.getApplicationId());
        res.setStatus(app.getStatus());
        res.setName(app.getCandidate().getUser().getUserName());
        res.setEmail(app.getCandidate().getUser().getEmail());
        res.setResumeUrl(app.getAppliedResumeUrl());
        if(temp!=null){
            res.setFinalScore(temp.getFinalScore());
            res.setAiScore(temp.getAiScore());
            res.setKeywordScore(temp.getKeywordScore());
        }

        return ResponseEntity.ok(res);
    }

    @GetMapping("getApplicationsForAJob/{jobId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<?> getApplicationsForAJob(@PathVariable Long jobId,Authentication authentication){
        User user = (User) authentication.getPrincipal();
        Recruiter recruiter = recruiterService.findByUserIdCompleteData(user.getUserId());
        Job job = jobService.findByJobId(jobId);
        if (job == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Job not found");
        }
        if (!job.getCompany().getCompanyId()
                .equals(recruiter.getCompany().getCompanyId())) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("You are not allowed to view applications for this job");
        }
        List<ApplicationResponse> response =
                applicationService.findByJobId(jobId)
                        .stream()
                        .map(application -> {

                            ResumeScore score =
                                    resumeScoreService.findByApplicationId(
                                            application.getApplicationId()
                                    ).orElse(null);

                            ApplicationResponse ret = new ApplicationResponse();

                            ret.setApplicationId(application.getApplicationId());
                            ret.setStatus(application.getStatus());
                            ret.setName(application.getCandidate().getUser().getUserName());
                            ret.setEmail(application.getCandidate().getUser().getEmail());
                            ret.setResumeUrl(application.getAppliedResumeUrl());

                            if (score != null) {
                                ret.setAiScore(score.getAiScore());
                                ret.setKeywordScore(score.getKeywordScore());
                                ret.setFinalScore(score.getFinalScore());
                            }

                            return ret;
                        })
                        .toList();

        return ResponseEntity.ok(response);
    }


    @PatchMapping("updateStatus/{applicationId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<?> updateStatus(@PathVariable Long applicationId, @RequestBody StatusUpdationRequest body, Authentication authentication){

        Application app = applicationService.findByApplicationId(applicationId);
        if (app == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Application not found");
        }
        User user = (User) authentication.getPrincipal();
        Recruiter recruiter =recruiterService.findByUserIdCompleteData(user.getUserId());
        if (!app.getJob().getCompany().getCompanyId()
                .equals(recruiter.getCompany().getCompanyId())) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("You are not allowed to update this application");
        }
        app.setStatus(body.getStatus());
        applicationService.saveApplication(app);
        return ResponseEntity
                .ok("Application status updated successfully");
    }

    @GetMapping("myApplications")
    public List<ApplicationResponseForCandidate> myApplications(Authentication authentication){
        User user=(User)authentication.getPrincipal();
        return applicationService.find(user.getUserId())
                .stream()
                .map(res -> new ApplicationResponseForCandidate(
                        res.getApplicationId(),
                        res.getStatus(),
                        res.getAppliedResumeUrl(),
                        res.getJob().getTitle(),
                        res.getJob().getLocation(),
                        res.getJob().getEmploymentType(),
                        res.getJob().getExperienceMin(),
                        res.getJob().getExperienceMax(),
                        res.getAppliedAt(),
                        res.getJob().getCompany().getName(),
                        res.getJob().getCompany().getDescription(),
                        res.getJob().getCompany().getIndustry(),
                        res.getJob().getCompany().getWebsiteUrl()
                )).toList();
    }
}
