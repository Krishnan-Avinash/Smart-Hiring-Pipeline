package com.smartHiringPipeline.demo.dto.job;

import com.smartHiringPipeline.demo.entity.Job;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JobResponse {
    private Long jobId;
    private String title;
    private String location;
    private String status;
    private String companyName;
    private String description;
    private String employmentType;
    private Integer experienceMin;
    private Integer experienceMax;
    private String requiredSkills;
    private String prioritySkills;
    public static JobResponse from(Job job) {
        return new JobResponse(
                job.getJobId(),
                job.getTitle(),
                job.getLocation(),
                job.getStatus(),
                job.getCompany().getName(),
                job.getDescription(),
                job.getEmploymentType(),
                job.getExperienceMin(),
                job.getExperienceMax(),
                job.getPrioritySkills(),
                job.getRequiredSkills()
        );
    }
}
