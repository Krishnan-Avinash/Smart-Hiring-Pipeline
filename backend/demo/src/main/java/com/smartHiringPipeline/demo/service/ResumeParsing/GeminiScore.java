package com.smartHiringPipeline.demo.service.ResumeParsing;

import com.smartHiringPipeline.demo.dto.Gemini.GeminiRequest;
import com.smartHiringPipeline.demo.dto.Gemini.GeminiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class GeminiScore {

    private final WebClient webClient;
    private String apiKey;

    public GeminiScore(WebClient.Builder builder,@Value("${GEMINI_API_KEY}") String apiKey){
        this.webClient = builder.baseUrl("https://generativelanguage.googleapis.com")
                .defaultHeader("Content-Type", "application/json")
                .build();
        this.apiKey=apiKey;
    }

    public double scoreSkills(String resumeText,String prioritySkills, String requiredSkills) {
        String prompt = """
            I will give you a resume text along with a company's required skills and priority skills. 
            Scan the resume properly and give me a score out of 100 that you think the resume would get with the required skills and prioritized skills in mind. 
            Give me just the score and nothing else.

            Resume:
            %s
            
            Priority Skills: %s
            
            Required Skills: %s
            """.formatted(resumeText,prioritySkills,requiredSkills);

        GeminiResponse response = webClient.post()
                .uri(uri -> uri
                        .path("/v1beta/models/gemini-2.5-flash:generateContent")
                        .queryParam("key", apiKey)
                        .build())
                .bodyValue(new GeminiRequest(prompt))
                .retrieve()
                .bodyToMono(GeminiResponse.class)
                .block();
        System.out.println("RAW GEMINI RESPONSE = " + response);


        String rawText = response.extractText();

        if (rawText == null) {
            throw new IllegalStateException("Gemini returned empty response");
        }

// extract number safely
        Pattern pattern = Pattern.compile("(\\d+(\\.\\d+)?)");
        Matcher matcher = pattern.matcher(rawText);

        if (matcher.find()) {
            return Double.parseDouble(matcher.group(1));
        }

        throw new IllegalStateException("Invalid Gemini output: " + rawText);

    }

}
