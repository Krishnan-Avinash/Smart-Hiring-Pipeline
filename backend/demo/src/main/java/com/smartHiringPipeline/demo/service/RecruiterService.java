package com.smartHiringPipeline.demo.service;

import com.smartHiringPipeline.demo.dto.recruiter.RecruiterCreationUpdationRequest;
import com.smartHiringPipeline.demo.dto.recruiter.RecruiterResponse;
import com.smartHiringPipeline.demo.entity.Recruiter;
import com.smartHiringPipeline.demo.entity.User;
import com.smartHiringPipeline.demo.repository.RecruiterRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class RecruiterService {


    private final RecruiterRepository recruiterRepository;

    public RecruiterService(RecruiterRepository recruiterRepository) {
        this.recruiterRepository = recruiterRepository;
    }

    @Transactional
    public void saveNewRecruiter(RecruiterCreationUpdationRequest recruiter, User user){
        Recruiter temp=new Recruiter();
        temp.setDesignation(recruiter.getDesignation());
        temp.setEmail(recruiter.getEmail());
        temp.setUser(user);
        recruiterRepository.save(temp);
    }

    public void saveRecruiter(Recruiter body){
        recruiterRepository.save(body);
    }

    @Transactional
    public RecruiterResponse findByUserId(Long userId){
        RecruiterResponse t=new RecruiterResponse();
        Recruiter rec=recruiterRepository.findByUser_UserId(userId);
        if(rec==null){
            return null;
        }
        t.setDesignation(rec.getDesignation());
        t.setEmail(rec.getEmail());
        t.setUserId(rec.getUser().getUserId());
        t.setRecruiterId(rec.getRecruiterId());
        t.setCompanyId(rec.getCompany().getCompanyId());
        return t;
    }

    public Recruiter findByUserIdCompleteData(Long userId){
        return recruiterRepository.findByUser_UserId(userId);
    }



}
