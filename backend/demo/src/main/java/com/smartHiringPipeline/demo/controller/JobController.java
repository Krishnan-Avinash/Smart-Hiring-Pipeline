package com.smartHiringPipeline.demo.controller;

import com.smartHiringPipeline.demo.dto.job.JobCreationUpdationRequest;
import com.smartHiringPipeline.demo.entity.Company;
import com.smartHiringPipeline.demo.entity.Job;
import com.smartHiringPipeline.demo.entity.Recruiter;
import com.smartHiringPipeline.demo.entity.User;
import com.smartHiringPipeline.demo.service.JobService;
import com.smartHiringPipeline.demo.service.RecruiterService;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("jobs")
public class JobController {

    private final RecruiterService recruiterService;
    private final JobService jobService;

    public JobController(RecruiterService recruiterService, JobService jobService) {
        this.recruiterService = recruiterService;
        this.jobService = jobService;
    }

    @PostMapping("createNewJob")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<?> createNewJob(@RequestBody JobCreationUpdationRequest body, Authentication authentication){
        User user=(User) authentication.getPrincipal();
        Recruiter rec=recruiterService.findByUserIdCompleteData(user.getUserId());
        Company com=rec.getCompany();
        jobService.saveNewService(body,user,com);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("getJobById/{jobId}")
    public ResponseEntity<?> getJobById(@PathVariable Long jobId,Authentication authentication){
        User user=(User) authentication.getPrincipal();
        Job job=jobService.findByJobId(jobId, user.getUserName());
        return new ResponseEntity<>(job,HttpStatus.FOUND);
    }

    @PutMapping("updateJobById/{jobId}")
    @Transactional
    public ResponseEntity<?> updateJobById(@PathVariable Long jobId, @RequestBody JobCreationUpdationRequest body,Authentication authentication){
        User user=(User) authentication.getPrincipal();
        Job job=jobService.findByJobId(jobId,user.getUserName());
        job.setTitle(body.getTitle());
        job.setDescription(body.getDescription());
        job.setLocation(body.getLocation());
        job.setEmploymentType(body.getEmploymentType());
        job.setExperienceMin(body.getExperienceMin());
        job.setExperienceMax(body.getExperienceMax());
        job.setRequiredSkills(body.getRequiredSkills());
        job.setPrioritySkills(body.getPrioritySkills());
        job.setStatus(body.getStatus());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("deleteJobById/{jobId}")
    public ResponseEntity<?> deleteJobById(@PathVariable Long jobId,Authentication authentication){
        User user=(User) authentication.getPrincipal();
        jobService.deleteById(jobId,user.getUserName());
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
