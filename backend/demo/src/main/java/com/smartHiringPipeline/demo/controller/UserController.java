package com.smartHiringPipeline.demo.controller;

import com.smartHiringPipeline.demo.dto.UserUpdation.UpdateUserRequest;
import com.smartHiringPipeline.demo.entity.User;
import com.smartHiringPipeline.demo.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

//    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("findUserByEmail/{email}")
    public ResponseEntity<?> findUserByEmail(@PathVariable String email){
        User user= userService.findByEmail(email);
        if (user!=null){
            return ResponseEntity.ok(user);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

//    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("createUser")
    public ResponseEntity<?> createUser(@RequestBody User user){
        if (userService.findByEmail(user.getEmail())!=null){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User with this email already exists");
        }
        userService.saveNewUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body("User created successfully");
    }

    @GetMapping("findUserById/{user_id}")
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> findUserById(@PathVariable Long user_id){
//        System.out.println("IN");
        User user=userService.findByUserId(user_id);
//        System.out.println(user);
        if(user==null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        return ResponseEntity.ok(user);
    }

    @Transactional
    @PutMapping("updatePassword")
//    @PreAuthorize("hasAnyRole('ADMIN','CANDIDATE','RECRUITER')")
    public ResponseEntity<?> updatePassword(@RequestBody UpdateUserRequest body){
        User user=userService.findByUserId(body.getUserId());
        if(user==null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        if(!body.getPassword().equals(body.getConfirmPassword())){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Passwords do not match");
        }
        if(userService.matches(body.getPassword(),user.getPassword())){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("New password cannot be same as old password");
        }
        user.setPassword(userService.encodePassword(body.getPassword()));
        userService.saveUser(user);
        return ResponseEntity.ok("Password updated successfully");
    }

//    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("updateActiveStatus/{id}")
    public ResponseEntity<?> updateActiveStatus(@PathVariable Long id){
        User user=userService.findByUserId(id);
        if(user==null){
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        }
        user.setActive(!user.getIsActive());
        userService.saveUser(user);
        return ResponseEntity
                .ok("User active status updated successfully");
    }

}
