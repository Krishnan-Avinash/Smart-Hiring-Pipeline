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
public class RecruiterController {

    private final RecruiterService recruiterService;

    public RecruiterController(RecruiterService recruiterService) {
        this.recruiterService = recruiterService;
    }

    @PostMapping("createNewRecruiter")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<?> createNewRecruiter(@RequestBody RecruiterCreationUpdationRequest body, Authentication authentication){
        User user=(User) authentication.getPrincipal();
        System.out.println("----------------------------------------------------------------");
        System.out.println(authentication.getPrincipal().getClass());
        System.out.println(authentication.getAuthorities());

        System.out.println("----------------------------------------------------------------");

        if (recruiterService.findByUserId(user.getUserId())!=null) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Recruiter profile already exists");
        }
        recruiterService.saveNewRecruiter(body,user);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Recruiter profile created successfully");
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @GetMapping("getSelf")
    public ResponseEntity<?> getSelf(Authentication authentication){
        User user=(User)authentication.getPrincipal();
        RecruiterResponse response =
                recruiterService.findByUserId(user.getUserId());

        if (response == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Recruiter profile not found");
        }

        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @PutMapping("updateSelf")
    public ResponseEntity<?> updateSelf(@RequestBody RecruiterCreationUpdationRequest body,Authentication authentication){
        User user=(User) authentication.getPrincipal();
        Recruiter temp=recruiterService.findByUserIdCompleteData(user.getUserId());
        if (temp == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Recruiter profile not found");
        }
        temp.setEmail(body.getEmail());
        temp.setDesignation(body.getDesignation());
        recruiterService.saveRecruiter(temp);
        return ResponseEntity
                .ok("Recruiter profile updated successfully");
    }
}
