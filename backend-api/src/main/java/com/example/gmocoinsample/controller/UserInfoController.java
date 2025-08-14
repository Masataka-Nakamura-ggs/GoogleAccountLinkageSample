package com.example.gmocoinsample.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UserInfoController {

    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getUserInfo(@AuthenticationPrincipal Jwt jwt) {
        Map<String, Object> userInfo = new HashMap<>();
        
        // JWTからユーザー情報を取得
        userInfo.put("subject", jwt.getSubject());
        userInfo.put("username", jwt.getClaimAsString("preferred_username"));
        userInfo.put("email", jwt.getClaimAsString("email"));
        userInfo.put("firstName", jwt.getClaimAsString("given_name"));
        userInfo.put("lastName", jwt.getClaimAsString("family_name"));
        userInfo.put("fullName", jwt.getClaimAsString("name"));
        userInfo.put("emailVerified", jwt.getClaimAsBoolean("email_verified"));
        
        // トークンの有効性情報
        userInfo.put("tokenIssuer", jwt.getIssuer());
        userInfo.put("tokenIssuedAt", jwt.getIssuedAt());
        userInfo.put("tokenExpiresAt", jwt.getExpiresAt());
        
        return ResponseEntity.ok(userInfo);
    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getUserProfile(@AuthenticationPrincipal Jwt jwt) {
        Map<String, Object> profile = new HashMap<>();
        
        // プロフィール情報のみを返す
        profile.put("username", jwt.getClaimAsString("preferred_username"));
        profile.put("email", jwt.getClaimAsString("email"));
        profile.put("firstName", jwt.getClaimAsString("given_name"));
        profile.put("lastName", jwt.getClaimAsString("family_name"));
        profile.put("fullName", jwt.getClaimAsString("name"));
        
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "OK");
        status.put("service", "GMO Coin Sample API");
        return ResponseEntity.ok(status);
    }
}
