package com.smartHiringPipeline.demo.service.ResumeParsing;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Arrays;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class TextExtraction {

    //HANDLING GOOGLE DRIVE LINKS
    private static String extractFileId(String url) {
        Pattern pattern = Pattern.compile("/d/([a-zA-Z0-9_-]+)");
        Matcher matcher = pattern.matcher(url);
        if (matcher.find()) {
            return matcher.group(1);
        }
        throw new IllegalArgumentException("Invalid Google Drive URL");
    }

    public static String normalize(String url) {
        if (url.contains("drive.google.com")) {
            String fileId = extractFileId(url);
            return "https://drive.google.com/uc?export=download&id=" + fileId;
        }
        return url;
    }

    public static String extractTextFromUrl(String resumeUrl) throws IOException {
        String normalizedUrl = normalize(resumeUrl);
        URL url = new URL(normalizedUrl);

        try (InputStream in = url.openStream()) {
            PDDocument doc = PDDocument.load(in);
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(doc);
        }
    }

    public static String normalizeText(String text) {
        return text.toLowerCase()
                .replaceAll("[^a-z0-9+.# ]", " ")
                .replaceAll("\\s+", " ");
    }




    private static final Pattern SPLIT_PATTERN = Pattern.compile("[,\\n;/|]+");

    public static Set<String> tokenizeSkills(String skills){
        return Arrays.stream(SPLIT_PATTERN.split(skills.toLowerCase()))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .collect(Collectors.toSet());
    }



}
