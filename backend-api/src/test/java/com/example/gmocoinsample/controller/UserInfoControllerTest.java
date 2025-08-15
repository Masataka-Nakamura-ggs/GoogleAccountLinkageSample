package com.example.gmocoinsample.controller;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.net.URL;
import java.time.Instant;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(UserInfoController.class)
class UserInfoControllerTest {
    @Autowired
    private MockMvc mockMvc;

    // Jwtフィールドは不要

    @Test
    @WithMockUser
    void getUserInfo_ReturnsUserInfo() throws Exception {
        Jwt jwt = mock(Jwt.class);
        when(jwt.getSubject()).thenReturn("user123");
        when(jwt.getClaimAsString("preferred_username")).thenReturn("testuser");
        when(jwt.getClaimAsString("email")).thenReturn("test@example.com");
        when(jwt.getClaimAsString("given_name")).thenReturn("Taro");
        when(jwt.getClaimAsString("family_name")).thenReturn("Yamada");
        when(jwt.getClaimAsString("name")).thenReturn("Taro Yamada");
        when(jwt.getClaimAsBoolean("email_verified")).thenReturn(true);
        when(jwt.getIssuer()).thenReturn(new URL("https://issuer.example.com"));
        when(jwt.getIssuedAt()).thenReturn(Instant.now());
        when(jwt.getExpiresAt()).thenReturn(Instant.now().plusSeconds(3600));


        mockMvc.perform(get("/api/user").with(jwt()
            .jwt(jwt)
            .authorities()
        ))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.subject").value("user123"))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.firstName").value("Taro"))
                .andExpect(jsonPath("$.lastName").value("Yamada"))
                .andExpect(jsonPath("$.fullName").value("Taro Yamada"))
                .andExpect(jsonPath("$.emailVerified").value(true));
    }

    @Test
    @WithMockUser
    void getUserProfile_ReturnsProfile() throws Exception {
        Jwt jwt = mock(Jwt.class);
        when(jwt.getClaimAsString("preferred_username")).thenReturn("testuser");
        when(jwt.getClaimAsString("email")).thenReturn("test@example.com");
        when(jwt.getClaimAsString("given_name")).thenReturn("Taro");
        when(jwt.getClaimAsString("family_name")).thenReturn("Yamada");
        when(jwt.getClaimAsString("name")).thenReturn("Taro Yamada");


        mockMvc.perform(get("/api/profile").with(jwt()
            .jwt(jwt)
            .authorities()
        ))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.firstName").value("Taro"))
                .andExpect(jsonPath("$.lastName").value("Yamada"))
                .andExpect(jsonPath("$.fullName").value("Taro Yamada"));
    }
}
