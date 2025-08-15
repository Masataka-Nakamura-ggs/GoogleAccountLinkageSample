package com.example.oneaccountsample.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;

@Configuration
@ConfigurationProperties(prefix = "cors") // ymlの "cors" プレフィックスを指定
public class CorsProperties {

    @Getter @Setter
    private String allowedOrigins;
    @Getter @Setter
    private String allowedMethods;
    @Getter @Setter
    private String allowedHeaders;
    @Getter @Setter
    private boolean allowCredentials;
}
