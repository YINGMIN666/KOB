package com.kob.backend.consumer.utils;


import com.kob.backend.utils.JwtUtil;
import io.jsonwebtoken.Claims;

public class JwtAuthentication {
    //getUserId是静态的，直接在外调用，不需要实例调用
    public static Integer getUserId(String token) {
        int userId = -1;
        try {
            Claims claims = JwtUtil.parseJWT(token);
            userId = Integer.parseInt(claims.getSubject());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return userId;
    }
}
