package com.smartHiringPipeline.demo.dto.application;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ApplicationResponseForCandidate {
    private Long applicationId;
    private String status;
    private String name;
    private String email;
    private String resumeUrl;

    public ApplicationResponseForCandidate(Long applicationId, String resumeUrl, String email, String name, String status) {
        this.applicationId = applicationId;
        this.resumeUrl = resumeUrl;
        this.email = email;
        this.name = name;
        this.status = status;
    }
}
