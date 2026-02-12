package com.smartHiringPipeline.demo.dto.application;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class ApplyInCompany {
    private String appliedResumeUrl;

    public ApplyInCompany(String appliedResumeUrl) {
        this.appliedResumeUrl = appliedResumeUrl;
    }
}
