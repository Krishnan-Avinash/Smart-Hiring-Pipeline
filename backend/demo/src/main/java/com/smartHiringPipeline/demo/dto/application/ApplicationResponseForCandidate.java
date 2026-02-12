package com.smartHiringPipeline.demo.dto.application;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ApplicationResponseForCandidate {
    private Long applicationId;
    private String status;
    private String resumeUrl;
    private String companyName;
    private String description;
    private String industry;
    private String websiteUrl;

    public ApplicationResponseForCandidate(Long applicationId, String status, String resumeUrl, String companyName, String description, String industry, String websiteUrl) {
        this.applicationId = applicationId;
        this.status = status;
        this.resumeUrl = resumeUrl;
        this.companyName = companyName;
        this.description = description;
        this.industry = industry;
        this.websiteUrl = websiteUrl;
    }
}
