package com.smartHiringPipeline.demo.dto.job;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class JobCreationUpdationRequest {
    private String title;
    private String description;
    private String location;
    private String employmentType;
    private Integer experienceMin;
    private Integer experienceMax;
    private String requiredSkills;
    private String prioritySkills;
    private String status;
}
