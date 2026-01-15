package com.smartHiringPipeline.demo.service;

import com.smartHiringPipeline.demo.dto.company.CompanyCreationUpdationRequest;
import com.smartHiringPipeline.demo.entity.Company;
import com.smartHiringPipeline.demo.entity.Recruiter;
import com.smartHiringPipeline.demo.entity.User;
import com.smartHiringPipeline.demo.repository.CompanyRepository;
import jakarta.persistence.Table;
import jakarta.transaction.Transactional;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final RecruiterService recruiterService;

    public CompanyService(CompanyRepository companyRepository, RecruiterService recruiterService) {
        this.companyRepository = companyRepository;
        this.recruiterService = recruiterService;
    }

    @Transactional
    public void saveNewCompany(CompanyCreationUpdationRequest body, User user){
        Recruiter rec=recruiterService.findByUserIdCompleteData(user.getUserId());
        Company temp=new Company();
        temp.setName(body.getName());
        temp.setDescription(body.getDescription());
        temp.setIndustry(body.getIndustry());
        temp.setWebsiteUrl(body.getWebsiteUrl());
        temp.setCreatedBy(user);
        rec.setCompany(temp);
        companyRepository.save(temp);
    }

    public void saveCompany(Company company){
        companyRepository.save(company);
    }

    public Company findByCompanyId(Long companyId){
        return companyRepository.findByCompanyId(companyId);
    }
}
