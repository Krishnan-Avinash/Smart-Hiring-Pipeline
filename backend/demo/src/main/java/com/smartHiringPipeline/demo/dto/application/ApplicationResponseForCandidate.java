package com.smartHiringPipeline.demo.dto.application;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ApplicationResponseForCandidate {
    private Long applicationId;
    private String status;
    private String resumeUrl;
    private String jobTitle;
    private String location;
    private String employmentType;
    private Integer experienceMin;
    private Integer experienceMax;
    private LocalDateTime appliedAt;
    private String companyName;
    private String description;
    private String industry;
    private String websiteUrl;

    public ApplicationResponseForCandidate(Long applicationId, String status, String resumeUrl, String jobTitle, String location, String employmentType, Integer experienceMin, Integer experienceMax, LocalDateTime appliedAt, String companyName, String description, String industry, String websiteUrl) {
        this.applicationId = applicationId;
        this.status = status;
        this.resumeUrl = resumeUrl;
        this.jobTitle = jobTitle;
        this.location = location;
        this.employmentType = employmentType;
        this.experienceMin = experienceMin;
        this.experienceMax = experienceMax;
        this.appliedAt = appliedAt;
        this.companyName = companyName;
        this.description = description;
        this.industry = industry;
        this.websiteUrl = websiteUrl;
    }
}
