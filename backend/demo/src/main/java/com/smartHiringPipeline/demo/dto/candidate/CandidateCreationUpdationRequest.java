package com.smartHiringPipeline.demo.dto.candidate;


import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CandidateCreationUpdationRequest {
    private String education;

    private Integer experienceYears;
    private String profileSummary;


}
