package com.smartHiringPipeline.demo.controller;

import com.smartHiringPipeline.demo.dto.company.CompanyCreationUpdationRequest;
import com.smartHiringPipeline.demo.dto.job.JobResponse;
import com.smartHiringPipeline.demo.entity.Company;
import com.smartHiringPipeline.demo.entity.Job;
import com.smartHiringPipeline.demo.entity.User;
import com.smartHiringPipeline.demo.service.CompanyService;
import com.smartHiringPipeline.demo.service.JobService;
import com.smartHiringPipeline.demo.service.UserService;
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

    public CompanyController(CompanyService companyService, JobService jobService) {
        this.companyService = companyService;
        this.jobService = jobService;
    }

    @PostMapping("createCompany")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<?> createCompany(@RequestBody CompanyCreationUpdationRequest body, Authentication authentication){
        User temp=(User)authentication.getPrincipal();
        companyService.saveNewCompany(body,temp);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("getCompanyById/{id}")
    public Company getCompanyById(@PathVariable Long id){
        return companyService.findByCompanyId(id);
    }

    @PutMapping("updateCompany/{id}")
    public ResponseEntity<?> updateCompany(@RequestBody CompanyCreationUpdationRequest body,@PathVariable Long id){
        Company cmp=companyService.findByCompanyId(id);
        cmp.setName(body.getName());
        cmp.setDescription(body.getDescription());
        cmp.setIndustry(body.getIndustry());
        cmp.setWebsiteUrl(body.getWebsiteUrl());
        companyService.saveCompany(cmp);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("getJobsOfCompany/{id}/jobs")
    public ResponseEntity<List<JobResponse>> getJobsOfCompany(@PathVariable Long id){
        List<JobResponse> jobs=jobService.findByCompanyId(id).stream().map(JobResponse::from).toList();
        return ResponseEntity.ok(jobs);
    }
}
