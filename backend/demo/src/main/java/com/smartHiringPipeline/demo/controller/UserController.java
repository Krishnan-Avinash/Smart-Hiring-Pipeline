package com.smartHiringPipeline.demo.controller;

import com.smartHiringPipeline.demo.entity.User;
import com.smartHiringPipeline.demo.service.UserService;
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

    @GetMapping("findUser/{email}")
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

}
