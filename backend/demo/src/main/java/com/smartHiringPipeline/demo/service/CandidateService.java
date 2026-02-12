package com.smartHiringPipeline.demo.service;

import com.smartHiringPipeline.demo.entity.Candidate;
import com.smartHiringPipeline.demo.dto.candidate.CandidateCreationUpdationRequest;
import com.smartHiringPipeline.demo.entity.User;
import com.smartHiringPipeline.demo.repository.CandidateRepository;
import org.springframework.stereotype.Service;

@Service
public class CandidateService{
    private final CandidateRepository candidateRepository;

    public CandidateService(CandidateRepository candidateRepository) {
        this.candidateRepository = candidateRepository;
    }

    public void saveCandidate(User user, CandidateCreationUpdationRequest body){
        Candidate temp=new Candidate();
        temp.setEducation(body.getEducation());
        temp.setUser(user);
        temp.setExperienceYears(body.getExperienceYears());
        temp.setProfileSummary(body.getProfileSummary());
        candidateRepository.save(temp);
    }

    public void saveCandidate(Candidate candidate){
        candidateRepository.save(candidate);
    }

    public Candidate findByCandidateId(Long candidateId){
        return candidateRepository.findByCandidateId(candidateId);
    }

    public Candidate findByUserId(Long userId){
        Candidate temp= candidateRepository.findByUser_UserId(userId);
        return temp;
    }
}
