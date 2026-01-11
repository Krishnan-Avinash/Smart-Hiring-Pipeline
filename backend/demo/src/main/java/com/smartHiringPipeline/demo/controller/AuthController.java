package com.smartHiringPipeline.demo.controller;

import com.smartHiringPipeline.demo.dto.LoginRequest;
import com.smartHiringPipeline.demo.dto.LoginResponse;
import com.smartHiringPipeline.demo.entity.User;
import com.smartHiringPipeline.demo.service.JwtService;
import com.smartHiringPipeline.demo.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("auth")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserService userService, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request){
        User user=userService.findByEmail(request.getEmail());
        if(user==null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if(passwordEncoder.matches(request.getPassword(), user.getPassword())==false){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        String token=jwtService.generateToken(user);
        return new ResponseEntity<>(
                new LoginResponse(token,user.getUser_id(),user.getRole()),
                HttpStatus.FOUND);
    }
}
