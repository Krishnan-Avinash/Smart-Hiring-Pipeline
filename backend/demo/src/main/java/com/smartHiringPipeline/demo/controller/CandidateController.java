package com.smartHiringPipeline.demo.controller;

import com.smartHiringPipeline.demo.dto.candidate.CandidateCreationUpdationRequest;
import com.smartHiringPipeline.demo.entity.Candidate;
import com.smartHiringPipeline.demo.entity.User;
import com.smartHiringPipeline.demo.service.CandidateService;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("candidate")
public class CandidateController {

    private final CandidateService candidateService;

    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    @PostMapping("createCandidate")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<?> createCandidate(@RequestBody CandidateCreationUpdationRequest body, Authentication authentication){
        User user=(User) authentication.getPrincipal();
        if (candidateService.findByUserId(user.getUserId())!=null) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Candidate profile already exists");
        }
//        System.out.println("WOHOOOOOOOOOOOOOOOOOOOOOOOOOOO:"+user);
        candidateService.saveCandidate(user,body);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Candidate profile created successfully");
    }

    @GetMapping("getSelf")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<?> getUserById(Authentication authentication){
        User user=(User) authentication.getPrincipal();
//        System.out.println("USER ID"+user.getUserId());
        Candidate temp=candidateService.findByUserId(user.getUserId());
//        System.out.println("temp:::"+temp);
        if (temp == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Candidate profile not found");
        }
        return ResponseEntity.ok(temp);
    }

    @PutMapping("updateDetails")
    @PreAuthorize("hasRole('CANDIDATE')")
    @Transactional
    public ResponseEntity<?> updateDetails(@RequestBody CandidateCreationUpdationRequest body,Authentication authentication){
        User user=(User) authentication.getPrincipal();
        Candidate temp=candidateService.findByUserId(user.getUserId());
        if(temp==null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Candidate profile not found");
        }
        if(!temp.getEducation().equals(body.getEducation())){
            temp.setEducation(body.getEducation());
        }
        if(temp.getExperienceYears()!=body.getExperienceYears()){
            temp.setExperienceYears(body.getExperienceYears());
        }
        if(!temp.getProfileSummary().equals(body.getProfileSummary())){
            temp.setProfileSummary(body.getProfileSummary());
        }
        candidateService.saveCandidate(temp);
        return ResponseEntity.ok(temp);
    }
}
