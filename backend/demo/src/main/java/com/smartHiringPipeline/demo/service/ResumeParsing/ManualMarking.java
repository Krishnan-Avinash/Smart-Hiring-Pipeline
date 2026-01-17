package com.smartHiringPipeline.demo.service.ResumeParsing;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Set;

import static com.smartHiringPipeline.demo.service.ResumeParsing.TextExtraction.tokenizeSkills;
import static com.smartHiringPipeline.demo.service.ResumeParsing.TextExtraction.normalizeText;
import static com.smartHiringPipeline.demo.service.ResumeParsing.TextExtraction.tokenizeSkills;

@Service
public class ManualMarking {
    public static int countMatches(Set<String> skills, String resumeText) {
        int matched = 0;
        for (String skill : skills) {
            String normalizedSkill =
                    TextExtraction.normalizeText(skill);
            if (resumeText.contains(" " + normalizedSkill + " ")) {
                matched++;
            }
        }
        return matched;
    }

    public static double scoreResume(String resumeText,String requiredSkills,String prioritySkills){
        Set<String> required=tokenizeSkills(requiredSkills);
        Set<String> priority=tokenizeSkills(prioritySkills);
        int requiredMatched=countMatches(required,resumeText);
        int priorityMatched=countMatches(priority,resumeText);
        double requiredScore=required.isEmpty()
                ? 0
                : (requiredMatched * 100.0 / required.size());

        double priorityScore=priority.isEmpty()
                ? 0
                : (priorityMatched * 100.0 / priority.size());

        return (requiredScore * 0.7)+(priorityScore * 0.3);
    }

}
