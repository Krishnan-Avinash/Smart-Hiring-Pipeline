package com.smartHiringPipeline.demo.service;

import com.smartHiringPipeline.demo.dto.resumeScore.ResumeScoreServiceRequest;
import com.smartHiringPipeline.demo.entity.Application;
import com.smartHiringPipeline.demo.entity.ResumeScore;
import com.smartHiringPipeline.demo.repository.ResumeScoreRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ResumeScoreService {
    private final ResumeScoreRepository resumeScoreRepository;

    public ResumeScoreService(ResumeScoreRepository resumeScoreRepository) {
        this.resumeScoreRepository = resumeScoreRepository;
    }

    public void saveNewResumeScore(ResumeScoreServiceRequest body, Application application){
        ResumeScore temp=new ResumeScore();
        temp.setAiScore(body.getAiScore());
        temp.setFinalScore(body.getFinalScore());
        temp.setKeywordScore(body.getKeywordScore());
        temp.setApplication(application);
        resumeScoreRepository.save(temp);
    }

    public ResumeScore findByResumeScoreId(Long resumeScoreId){
        return resumeScoreRepository.findByResumeScoreId(resumeScoreId);
    }

    public Optional<ResumeScore> findByApplicationId(Long applicationId){
        return resumeScoreRepository.findByApplication_ApplicationId(applicationId);
    }

//    public Boolean existsForApplication(Application application){
//        return resumeScoreRepository.existsForApplication(application);
//    }
}
