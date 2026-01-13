package com.smartHiringPipeline.demo.service;

import com.smartHiringPipeline.demo.dto.company.CompanyCreationUpdationRequest;
import com.smartHiringPipeline.demo.entity.Company;
import com.smartHiringPipeline.demo.entity.User;
import com.smartHiringPipeline.demo.repository.CompanyRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public void saveNewCompany(CompanyCreationUpdationRequest body, User user){
        Company temp=new Company();
        temp.setName(body.getName());
        temp.setDescription(body.getDescription());
        temp.setIndustry(body.getIndustry());
        temp.setWebsiteUrl(body.getWebsiteUrl());
        temp.setCreatedBy(user);
        companyRepository.save(temp);
    }

    public void saveCompany(Company company){
        companyRepository.save(company);
    }

    public Company findByCompanyId(Long companyId){
        return companyRepository.findByCompanyId(companyId);
    }
}
