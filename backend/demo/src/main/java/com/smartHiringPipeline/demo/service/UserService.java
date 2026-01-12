package com.smartHiringPipeline.demo.service;

import com.smartHiringPipeline.demo.entity.User;
import com.smartHiringPipeline.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private static final PasswordEncoder passwordEncoder=new BCryptPasswordEncoder();

    public String encodePassword(String password){
        return passwordEncoder.encode(password);
    }

    public User findByEmail(String email){
        return userRepository.findByEmail(email);
    }

    public void saveNewUser(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    public void saveUser(User user){
        userRepository.save(user);
    }

    public User findByUserId(Long user_id){
        return userRepository.findByUserId(user_id);
    }

    public boolean matches(String raw,String encoded){
        return passwordEncoder.matches(raw,encoded);
    }

}
