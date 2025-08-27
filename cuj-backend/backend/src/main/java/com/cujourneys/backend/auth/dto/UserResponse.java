package com.cujourneys.backend.auth.dto;

import com.cujourneys.backend.model.User;
import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String name;
    private String email;

    public static UserResponse from(User user) {
        UserResponse res = new UserResponse();
        res.setId(user.getId());
        res.setName(user.getName());
        res.setEmail(user.getEmail());
        return res;
    }
}
