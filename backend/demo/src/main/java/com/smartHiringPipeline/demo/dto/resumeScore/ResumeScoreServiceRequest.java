package com.smartHiringPipeline.demo.dto.resumeScore;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ResumeScoreServiceRequest {
    private Integer keywordScore;
    private Integer aiScore;
    private Integer finalScore;
}
