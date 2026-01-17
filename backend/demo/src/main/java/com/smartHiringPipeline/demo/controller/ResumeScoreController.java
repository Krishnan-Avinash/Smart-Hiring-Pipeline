package com.smartHiringPipeline.demo.controller;

import com.smartHiringPipeline.demo.dto.resumeScore.ResumeScoreServiceRequest;
import com.smartHiringPipeline.demo.dto.resumeScore.ResumeScoreServiceResponse;
import com.smartHiringPipeline.demo.entity.*;
import com.smartHiringPipeline.demo.service.*;
import com.smartHiringPipeline.demo.service.ResumeParsing.GeminiScore;
import com.smartHiringPipeline.demo.service.ResumeParsing.ManualMarking;
import com.smartHiringPipeline.demo.service.ResumeParsing.TextExtraction;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("resumeScore")
public class ResumeScoreController {

    private final ApplicationService applicationService;
    private final JobService jobService;
    private final ManualMarking manualMarking;
    private final TextExtraction textExtraction;
    private final CandidateService candidateService;
    private final GeminiScore geminiScore;
    private final ResumeScoreService resumeScoreService;
    private final RecruiterService recruiterService;

    public ResumeScoreController(ApplicationService applicationService, JobService jobService, ManualMarking manualMarking, TextExtraction textExtraction, CandidateService candidateService, GeminiScore geminiScore, ResumeScoreService resumeScoreService, RecruiterService recruiterService) {
        this.applicationService = applicationService;
        this.jobService = jobService;
        this.manualMarking = manualMarking;
        this.textExtraction = textExtraction;
        this.candidateService = candidateService;
        this.geminiScore = geminiScore;
        this.resumeScoreService = resumeScoreService;
        this.recruiterService = recruiterService;
    }

    @PostMapping("createNew/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<?> createNew(@PathVariable Long id,Authentication authentication){
        try{
            User user = (User) authentication.getPrincipal();
            Recruiter recruiter =recruiterService.findByUserIdCompleteData(user.getUserId());
            if (recruiter == null || recruiter.getCompany() == null) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Recruiter is not associated with a company");
            }
            Company recruiterCompany = recruiter.getCompany();
            Application application=applicationService.findByApplicationId(id);
            if (application == null) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Application not found");
            }

            Company jobCompany = application.getJob().getCompany();
            if (!recruiterCompany.getCompanyId()
                    .equals(jobCompany.getCompanyId())) {
                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body("You are not allowed to score this application");
            }

//            System.out.println("Recruiter userId: " + user.getUserId());
//            System.out.println("Recruiter companyId: " + recruiterCompany.getCompanyId());
//            System.out.println("Job companyId: " + jobCompany.getCompanyId());


            Job job = application.getJob();
            Candidate candidate = application.getCandidate();

//            if (resumeScoreService.existsForApplication(application)) {
//                return ResponseEntity
//                        .status(HttpStatus.CONFLICT)
//                        .body("Resume already scored");
//            }

            String rawResumeText =
                    TextExtraction.extractTextFromUrl(candidate.getResumeUrl());

            String resumeText =
                    TextExtraction.normalizeText(rawResumeText);


            double manualScore =
                    ManualMarking.scoreResume(
                            resumeText,
                            job.getRequiredSkills(),
                            job.getPrioritySkills()
                    );
//            System.out.println("MANUAL SCORE="+manualScore);
            double aiScore =
                    geminiScore.scoreSkills(
                            resumeText,
                            job.getPrioritySkills(),
                            job.getRequiredSkills()
                    );

            double finalScore = (manualScore + aiScore) / 2;

            ResumeScoreServiceRequest temp = new ResumeScoreServiceRequest();
            temp.setAiScore((int) aiScore);
            temp.setKeywordScore((int) manualScore);
            temp.setFinalScore((int) finalScore);

            resumeScoreService.saveNewResumeScore(temp, application);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body("Resume scored successfully");

        } catch (IOException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Failed to read resume file");
        }
    }

    @GetMapping("getScore/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<?> getScore(@PathVariable Long id,Authentication authentication){

        User user = (User) authentication.getPrincipal();
        Recruiter recruiter =recruiterService.findByUserIdCompleteData(user.getUserId());

        Application application =applicationService.findByApplicationId(id);

        if (application == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Application not found");
        }

        if (!application.getJob().getCompany().getCompanyId()
                .equals(recruiter.getCompany().getCompanyId())) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("You are not allowed to view this resume score");
        }

        ResumeScore temp =resumeScoreService.findByApplicationId(id).orElse(null);

        if (temp == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Resume score not found");
        }

        ResumeScoreServiceResponse ret =new ResumeScoreServiceResponse();

        ret.setFinalScore(temp.getFinalScore());
        ret.setKeywordScore(temp.getKeywordScore());
        ret.setAiScore(temp.getAiScore());
        ret.setScoredAt(temp.getScoredAt());

        return ResponseEntity.ok(ret);
    }

}
