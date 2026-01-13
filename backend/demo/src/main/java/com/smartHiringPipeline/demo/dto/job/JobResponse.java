package com.smartHiringPipeline.demo.dto.job;

import com.smartHiringPipeline.demo.entity.Job;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JobResponse {
    private Long jobId;
    private String title;
    private String location;
    private String status;
    public static JobResponse from(Job job) {
        return new JobResponse(
                job.getJobId(),
                job.getTitle(),
                job.getLocation(),
                job.getStatus()
        );
    }
}
