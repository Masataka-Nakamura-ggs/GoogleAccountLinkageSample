package com.example.gmocoinsample.config;

/**
 * Spring Securityの設定クラス。
 * <p>
 * - CORS設定
 * - CSRF保護の一部無効化
 * - セッション管理（ステートレス）
 * - CookieAuthenticationFilterの追加
 * - APIエンドポイントの認証/認可
 * - JWTデコーダの設定
 */
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * CORSで許可するオリジン（application.ymlから取得）
     */
    @Value("${cors.allowed-origins}")
    private String allowedOrigins;

    /**
     * JWTのissuer URI（application.ymlから取得）
     */
    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private String issuerUri;

    /**
     * Spring Securityのフィルターチェーンを構成。
     * <ul>
     *   <li>CORS設定</li>
     *   <li>APIエンドポイントのCSRF保護無効化</li>
     *   <li>セッション管理をステートレスに</li>
     *   <li>CookieAuthenticationFilterをBearerTokenAuthenticationFilterの前に追加</li>
     *   <li>API認証/認可ルール</li>
     *   <li>JWTデコーダ設定</li>
     * </ul>
     * @param http HttpSecurity
     * @return SecurityFilterChain
     * @throws Exception 設定例外
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CORS設定
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // APIエンドポイントではCSRF保護を無効に
            .csrf(csrf -> csrf.ignoringRequestMatchers("/api/**"))
            // セッション管理（ステートレス）
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // CookieAuthenticationFilterを追加
            .addFilterBefore(new CookieAuthenticationFilter(), BearerTokenAuthenticationFilter.class)
            // 認可ルール
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/actuator/**").permitAll()
                .requestMatchers("/api/health").permitAll() // ヘルスチェックエンドポイントは認証不要
                .requestMatchers("/api/**").authenticated()
                .anyRequest().permitAll()
            )
            // JWTリソースサーバ設定
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.decoder(jwtDecoder()))
            );

        return http.build();
    }

    /**
     * CORSの設定を生成。
     * <ul>
     *   <li>許可オリジンはapplication.ymlから取得</li>
     *   <li>全メソッド・全ヘッダー許可</li>
     *   <li>Cookie送信許可</li>
     *   <li>キャッシュ有効期間: 3600秒</li>
     * </ul>
     * @return CorsConfigurationSource
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // 許可オリジンを設定
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
        // 許可メソッド
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // 許可ヘッダー
        configuration.setAllowedHeaders(List.of("*"));
        // Cookie送信許可
        configuration.setAllowCredentials(true);
        // キャッシュ有効期間
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * JWTデコーダのBean定義。
     * issuerUriに基づきJWT検証を行う。
     * @return JwtDecoder
     */
    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withIssuerLocation(issuerUri).build();
    }
}
