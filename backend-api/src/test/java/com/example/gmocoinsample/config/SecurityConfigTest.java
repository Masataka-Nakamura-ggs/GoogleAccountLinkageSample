package com.example.gmocoinsample.config;

import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.security.web.SecurityFilterChain;

@SpringBootTest
class SecurityConfigTest {
    @Autowired
    private ApplicationContext context;

    @Test
    void securityFilterChainBeanExists() {
        SecurityFilterChain filterChain = context.getBean(SecurityFilterChain.class);
        assertThat(filterChain).isNotNull();
    }

    @Test
    void corsConfigurationSourceBeanExists() {
        Object corsSource = context.getBean("corsConfigurationSource");
        assertThat(corsSource).isNotNull();
    }

    @Test
    void jwtDecoderBeanExists() {
        Object jwtDecoder = context.getBean("jwtDecoder");
        assertThat(jwtDecoder).isNotNull();
    }
}
