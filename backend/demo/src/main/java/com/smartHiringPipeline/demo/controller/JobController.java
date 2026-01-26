package com.smartHiringPipeline.demo.controller;

import com.smartHiringPipeline.demo.dto.job.JobCreationUpdationRequest;
import com.smartHiringPipeline.demo.dto.job.JobResponse;
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

import java.util.List;

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
        if(rec==null || rec.getCompany()==null){
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Recruiter must be associated with a company to create a job");
        }
        Company com=rec.getCompany();
        jobService.saveNewService(body,user,com);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Job created successfully");
    }

    @PreAuthorize("hasAnyRole('RECRUITER','CANDIDATE')")
    @GetMapping("getJobById/{jobId}")
    public ResponseEntity<?> getJobById(@PathVariable Long jobId,Authentication authentication){
        User user=(User) authentication.getPrincipal();
        Job job=jobService.findByJobId(jobId, user.getUserName());
        if (job == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Job not found");
        }
        return ResponseEntity.ok(job);
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @PutMapping("updateJobById/{jobId}")
    @Transactional
    public ResponseEntity<?> updateJobById(@PathVariable Long jobId, @RequestBody JobCreationUpdationRequest body,Authentication authentication){
        User user=(User) authentication.getPrincipal();
        Job job=jobService.findByJobId(jobId,user.getUserName());
        if (job == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Job not found or you are not authorized to update it");
        }
        job.setTitle(body.getTitle());
        job.setDescription(body.getDescription());
        job.setLocation(body.getLocation());
        job.setEmploymentType(body.getEmploymentType());
        job.setExperienceMin(body.getExperienceMin());
        job.setExperienceMax(body.getExperienceMax());
        job.setRequiredSkills(body.getRequiredSkills());
        job.setPrioritySkills(body.getPrioritySkills());
        job.setStatus(body.getStatus());
        jobService.saveJob(job);
        return ResponseEntity
                .ok("Job updated successfully");
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @DeleteMapping("deleteJobById/{jobId}")
    public ResponseEntity<?> deleteJobById(@PathVariable Long jobId,Authentication authentication){
        User user=(User) authentication.getPrincipal();
        boolean deleted = jobService.deleteById(jobId, user.getUserName());

        if (!deleted) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Job not found or you are not authorized to delete it");
        }
        return ResponseEntity
                .ok("Job deleted successfully");
    }

    @GetMapping("getAllJobs")
    public List<JobResponse> getAllJobs(){
        return jobService.find()
                .stream()
                .map(job -> new JobResponse(
                        job.getJobId(),
                        job.getTitle(),
                        job.getLocation(),
                        job.getStatus(),
                        job.getCompany().getName(),
                        job.getDescription(),
                        job.getEmploymentType(),
                        job.getExperienceMin(),
                        job.getExperienceMax(),
                        job.getPrioritySkills(),
                        job.getRequiredSkills()
                )).toList();

    }
}
