package com.smartHiringPipeline.demo.dto.recruiter;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RecruiterResponse {

    private Long recruiterId;
    private Long userId;
    private String designation;
    private String email;
    private Long companyId;

}
