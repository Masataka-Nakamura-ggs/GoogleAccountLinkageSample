package com.example.gmocoinsample.config;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.Enumeration;

import org.springframework.lang.NonNull;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;

/**
 * CookieAuthenticationFilterは、リクエストのCookieからアクセストークンを取得し、
 * Authorizationヘッダーが存在しない場合に自動的に付与するSpringのフィルターです。
 * <p>
 * Cookie名 "access_token" からトークンを取得し、ラップしたリクエストに
 * "Bearer {token}" 形式でAuthorizationヘッダーを追加します。
 */
public class CookieAuthenticationFilter extends OncePerRequestFilter {

    /** アクセストークンを格納するCookieの名前 */
    public static final String ACCESS_TOKEN_COOKIE_NAME = "access_token";

    /**
     * リクエストのCookieからアクセストークンを取得し、Authorizationヘッダーが
     * 存在しない場合はヘッダーを追加してフィルターチェーンを進めます。
     *
     * @param request  HTTPリクエスト
     * @param response HTTPレスポンス
     * @param filterChain フィルターチェーン
     * @throws ServletException サーブレット例外
     * @throws IOException 入出力例外
     */
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        // リクエストからCookie配列を取得
        Cookie[] cookies = request.getCookies();

        // "access_token" Cookieが存在する場合は値を取得
        final String tokenValue = cookies == null ? null :
                Arrays.stream(cookies)
                        .filter(cookie -> ACCESS_TOKEN_COOKIE_NAME.equals(cookie.getName()))
                        .map(Cookie::getValue)
                        .findFirst()
                        .orElse(null);

        // Authorizationヘッダーが未設定かつトークンが存在する場合はヘッダーを追加
        if (tokenValue != null && request.getHeader("Authorization") == null) {
            HttpServletRequestWrapper wrappedRequest = new HttpServletRequestWrapper(request) {
                @Override
                public String getHeader(String name) {
                    // Authorizationヘッダー要求時はBearerトークンを返す
                    if ("Authorization".equalsIgnoreCase(name)) {
                        return "Bearer " + tokenValue;
                    }
                    return super.getHeader(name);
                }

                @Override
                public Enumeration<String> getHeaders(String name) {
                    // Authorizationヘッダー要求時はBearerトークンのみを返す
                    if ("Authorization".equalsIgnoreCase(name)) {
                        return Collections.enumeration(Collections.singletonList("Bearer " + tokenValue));
                    }
                    return super.getHeaders(name);
                }
            };
            // ラップしたリクエストでフィルターチェーンを進める
            filterChain.doFilter(wrappedRequest, response);
        } else {
            // そのままフィルターチェーンを進める
            filterChain.doFilter(request, response);
        }
    }
}