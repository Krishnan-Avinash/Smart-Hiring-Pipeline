package com.smartHiringPipeline.demo.dto.company;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CompanyCreationUpdationRequest {
    private String name;

    private String description;

    private String websiteUrl;

    private String industry;
}
