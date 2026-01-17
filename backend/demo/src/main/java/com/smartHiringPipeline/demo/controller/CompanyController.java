package com.smartHiringPipeline.demo.controller;

import com.smartHiringPipeline.demo.dto.company.CompanyCreationUpdationRequest;
import com.smartHiringPipeline.demo.dto.job.JobResponse;
import com.smartHiringPipeline.demo.entity.Company;
import com.smartHiringPipeline.demo.entity.Job;
import com.smartHiringPipeline.demo.entity.Recruiter;
import com.smartHiringPipeline.demo.entity.User;
import com.smartHiringPipeline.demo.service.CompanyService;
import com.smartHiringPipeline.demo.service.JobService;
import com.smartHiringPipeline.demo.service.RecruiterService;
import com.smartHiringPipeline.demo.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("company")
public class CompanyController {

    private final CompanyService companyService;
    private final JobService jobService;
    private final RecruiterService recruiterService;

    public CompanyController(CompanyService companyService, JobService jobService, RecruiterService recruiterService) {
        this.companyService = companyService;
        this.jobService = jobService;
        this.recruiterService = recruiterService;
    }

    @PostMapping("createCompany")
    @PreAuthorize("hasRole('RECRUITER')")
    @Transactional
    public ResponseEntity<?> createCompany(@RequestBody CompanyCreationUpdationRequest body, Authentication authentication){
        User temp=(User)authentication.getPrincipal();
        if (companyService.findByUserId(temp.getUserId())!=null) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Company already exists for this recruiter");
        }
        companyService.saveNewCompany(body,temp);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Company created successfully");
    }

    @PreAuthorize("hasAnyRole('RECRUITER','CANDIDATE')")
    @GetMapping("getCompanyById/{id}")
    public ResponseEntity<?> getCompanyById(@PathVariable Long id){
        Company company=companyService.findByCompanyId(id);
        if(company==null){
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Company not found");
        }
        return ResponseEntity.ok(company);
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @PutMapping("updateCompany/{id}")
    public ResponseEntity<?> updateCompany(@RequestBody CompanyCreationUpdationRequest body,@PathVariable Long id,Authentication authentication){
        Company cmp = companyService.findByCompanyId(id);
        if(cmp==null){
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Company not found");
        }
        User user = (User) authentication.getPrincipal();
        Recruiter recruiter=recruiterService.findByUserIdCompleteData(user.getUserId());
        if(!cmp.getCompanyId().equals(recruiter.getCompany().getCompanyId())){
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("You are not allowed to update this company");
        }
        cmp.setName(body.getName());
        cmp.setDescription(body.getDescription());
        cmp.setIndustry(body.getIndustry());
        cmp.setWebsiteUrl(body.getWebsiteUrl());
        companyService.saveCompany(cmp);
        return ResponseEntity
                .ok("Company updated successfully");
    }

    @PreAuthorize("hasAnyRole('RECRUITER','CANDIDATE')")
    @GetMapping("getJobsOfCompany/{id}/jobs")
    public ResponseEntity<List<JobResponse>> getJobsOfCompany(@PathVariable Long id){
        List<JobResponse> jobs=jobService.findByCompanyId(id).stream().map(JobResponse::from).toList();
        return ResponseEntity.ok(jobs);
    }
}
