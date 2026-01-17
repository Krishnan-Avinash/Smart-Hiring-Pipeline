package com.smartHiringPipeline.demo.dto.application;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ApplicationResponse {
    private Long applicationId;
    private String status;
    private String name;
    private String email;
    private String resumeUrl;
    private Integer finalScore;
    private Integer aiScore;
    private Integer keywordScore;
    public ApplicationResponse(Long applicationId,String status,String name,String email,String resumeUrl,Integer finalScore,Integer aiScore,Integer keywordScore){
        this.applicationId=applicationId;
        this.status=status;
        this.name=name;
        this.email=email;
        this.resumeUrl=resumeUrl;
        this.keywordScore=keywordScore;
        this.aiScore=aiScore;
        this.finalScore=finalScore;
    }
}
