package com.smartHiringPipeline.demo.dto.UserUpdation;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UpdateUserRequest {

    private Long userId;

    private String password;

    private String confirmPassword;

}
