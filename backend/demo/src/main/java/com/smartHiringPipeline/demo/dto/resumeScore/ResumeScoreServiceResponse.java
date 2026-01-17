package com.smartHiringPipeline.demo.dto.resumeScore;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ResumeScoreServiceResponse {
    private Integer keywordScore;
    private Integer aiScore;
    private Integer finalScore;
    private LocalDateTime scoredAt;
}
