package com.smartHiringPipeline.demo.repository;

import com.smartHiringPipeline.demo.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company,Long> {
    Company findByCompanyId(Long companyId);
}
