package com.smartHiringPipeline.demo.controller;

import com.smartHiringPipeline.demo.dto.UserUpdation.UpdateUserRequest;
import com.smartHiringPipeline.demo.entity.User;
import com.smartHiringPipeline.demo.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("findUserByEmail/{email}")
    public ResponseEntity<?> findUserByEmail(@PathVariable String email){
        User user= userService.findByEmail(email);
        if(user!=null){
            return new ResponseEntity<>(user, HttpStatus.FOUND);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("createUser")
    public ResponseEntity<?> createUser(@RequestBody User user){
        if(user!=null){
            userService.saveNewUser(user);
            return new ResponseEntity<>(HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @GetMapping("findUserById/{user_id}")
    public ResponseEntity<?> findUserById(@PathVariable Long user_id){
        System.out.println("IN");
        User user=userService.findByUserId(user_id);
        System.out.println(user);
        if(user==null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(user,HttpStatus.FOUND);
    }

    @Transactional
    @PutMapping("updatePassword")
    public ResponseEntity<?> updatePassword(@RequestBody UpdateUserRequest body){
        User user=userService.findByUserId(body.getUserId());
        if(user==null){
            return ResponseEntity.notFound().build();
        }
        if(!body.getPassword().equals(body.getConfirmPassword())){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Passwords do not match");
        }
        if(userService.matches(body.getPassword(),user.getPassword())){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("New password cannot be same as old password");
        }
        user.setPassword(userService.encodePassword(body.getPassword()));
        userService.saveUser(user);
        return ResponseEntity.ok("Password updated successfully");
    }

    @PatchMapping("updateActiveStatus/{id}")
    public ResponseEntity<?> updateActiveStatus(@PathVariable Long id){
        User user=userService.findByUserId(id);
        if(user==null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        user.setActive(!user.getIsActive());
        userService.saveUser(user);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
