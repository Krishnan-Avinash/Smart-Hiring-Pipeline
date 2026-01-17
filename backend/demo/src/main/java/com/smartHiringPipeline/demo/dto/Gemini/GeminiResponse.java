package com.smartHiringPipeline.demo.dto.Gemini;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
public class GeminiResponse {

    private List<Candidate> candidates;

    @Data
    public static class Candidate {
        private Content content;
    }

    @Data
    public static class Content {
        private List<Part> parts;
    }

    @Data
    public static class Part {
        private String text;
    }

    // helper method
    public String extractText() {
        if (candidates == null || candidates.isEmpty()) return null;
        Content content = candidates.get(0).getContent();
        if (content == null || content.getParts() == null || content.getParts().isEmpty()) return null;
        return content.getParts().get(0).getText();
    }
}
