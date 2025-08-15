package com.example.oneaccountsample.config;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.io.IOException;

import org.junit.jupiter.api.Test;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

class CookieAuthenticationFilterTest {
    @Test
    void doFilterInternal_addsAuthorizationHeaderIfAccessTokenCookieExists() throws ServletException, IOException {
        CookieAuthenticationFilter filter = new CookieAuthenticationFilter();
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);

        Cookie[] cookies = { new Cookie(CookieAuthenticationFilter.ACCESS_TOKEN_COOKIE_NAME, "dummy-token") };
        when(request.getCookies()).thenReturn(cookies);
        when(request.getHeader("Authorization")).thenReturn(null);

        filter.doFilterInternal(request, response, chain);
        verify(chain, times(1)).doFilter(any(HttpServletRequest.class), eq(response));
    }

    @Test
    void doFilterInternal_doesNotAddAuthorizationHeaderIfNoAccessTokenCookie() throws ServletException, IOException {
        CookieAuthenticationFilter filter = new CookieAuthenticationFilter();
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);

        when(request.getCookies()).thenReturn(null);
        when(request.getHeader("Authorization")).thenReturn(null);

        filter.doFilterInternal(request, response, chain);
        verify(chain, times(1)).doFilter(request, response);
    }
}
