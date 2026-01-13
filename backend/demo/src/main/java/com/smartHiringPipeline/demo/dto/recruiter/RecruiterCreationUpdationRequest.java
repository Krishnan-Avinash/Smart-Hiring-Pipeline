package com.smartHiringPipeline.demo.dto.recruiter;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RecruiterCreationUpdationRequest {
    private String designation;
    private String email;

}
