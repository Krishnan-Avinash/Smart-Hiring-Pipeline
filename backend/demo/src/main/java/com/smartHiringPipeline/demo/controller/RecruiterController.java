package com.smartHiringPipeline.demo.controller;

import com.smartHiringPipeline.demo.dto.recruiter.RecruiterCreationUpdationRequest;
import com.smartHiringPipeline.demo.dto.recruiter.RecruiterResponse;
import com.smartHiringPipeline.demo.entity.Recruiter;
import com.smartHiringPipeline.demo.entity.User;
import com.smartHiringPipeline.demo.service.RecruiterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("recruiter")
@PreAuthorize("hasRole('RECRUITER')")
public class RecruiterController {

    private final RecruiterService recruiterService;

    public RecruiterController(RecruiterService recruiterService) {
        this.recruiterService = recruiterService;
    }

    @PostMapping("createNewRecruiter")
    public void createNewRecruiter(@RequestBody RecruiterCreationUpdationRequest body, Authentication authentication){
        User user=(User) authentication.getPrincipal();
        recruiterService.saveNewRecruiter(body,user);
    }

    @GetMapping("getSelf")
    public RecruiterResponse getSelf(Authentication authentication){
        User user=(User)authentication.getPrincipal();
        return recruiterService.findByUserId(user.getUserId());
    }

    @PutMapping("updateSelf")
    public ResponseEntity<?> updateSelf(@RequestBody RecruiterCreationUpdationRequest body,Authentication authentication){
        User user=(User) authentication.getPrincipal();
        Recruiter temp=recruiterService.findByUserIdCompleteData(user.getUserId());
        temp.setEmail(body.getEmail());
        temp.setDesignation(body.getDesignation());
        recruiterService.saveRecruiter(temp);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
