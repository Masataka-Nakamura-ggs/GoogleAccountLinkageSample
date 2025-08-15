package com.example.oneaccountsample.controller;

/**
 * ユーザー情報APIコントローラー。
 * <p>
 * /api/user でJWTから取得したユーザー情報を返却。
 * /api/profile でプロフィール情報のみ返却。
 * いずれも認証済みユーザーのみアクセス可能。
 */
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

    /**
     * 認証済みユーザーの詳細情報を返却するAPI。
     * <p>
     * JWTから取得したユーザー属性やトークン情報を返します。
     * @param jwt 認証済みユーザーのJWTトークン
     * @return ユーザー情報のMap
     */
    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getUserInfo(@AuthenticationPrincipal Jwt jwt) {
        Map<String, Object> userInfo = new HashMap<>();
        
        // JWTからユーザー情報を取得
        userInfo.put("subject", jwt.getSubject()); // ユーザーID
        userInfo.put("username", jwt.getClaimAsString("preferred_username")); // ユーザー名
        userInfo.put("email", jwt.getClaimAsString("email")); // メールアドレス
        userInfo.put("firstName", jwt.getClaimAsString("given_name")); // 名
        userInfo.put("lastName", jwt.getClaimAsString("family_name")); // 姓
        userInfo.put("fullName", jwt.getClaimAsString("name")); // フルネーム
        userInfo.put("emailVerified", jwt.getClaimAsBoolean("email_verified")); // メール認証済みか
        
        // トークンの有効性情報
        userInfo.put("tokenIssuer", jwt.getIssuer()); // トークン発行者
        userInfo.put("tokenIssuedAt", jwt.getIssuedAt()); // トークン発行日時
        userInfo.put("tokenExpiresAt", jwt.getExpiresAt()); // トークン有効期限
        
        return ResponseEntity.ok(userInfo);
    }

    /**
     * 認証済みユーザーのプロフィール情報のみを返却するAPI。
     * <p>
     * JWTから取得した基本属性のみ返します。
     * @param jwt 認証済みユーザーのJWTトークン
     * @return プロフィール情報のMap
     */
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getUserProfile(@AuthenticationPrincipal Jwt jwt) {
        Map<String, Object> profile = new HashMap<>();
        
        // プロフィール情報のみを返す
        profile.put("username", jwt.getClaimAsString("preferred_username")); // ユーザー名
        profile.put("email", jwt.getClaimAsString("email")); // メールアドレス
        profile.put("firstName", jwt.getClaimAsString("given_name")); // 名
        profile.put("lastName", jwt.getClaimAsString("family_name")); // 姓
        profile.put("fullName", jwt.getClaimAsString("name")); // フルネーム
        
        return ResponseEntity.ok(profile);
    }
}
