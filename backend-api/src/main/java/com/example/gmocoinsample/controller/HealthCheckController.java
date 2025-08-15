package com.example.gmocoinsample.controller;

/**
 * ヘルスチェック用APIコントローラー。
 * <p>
 * /api/health エンドポイントでシステムの稼働状況を確認できます。
 * 認証不要でアクセス可能です。
 */
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthCheckController {

    /**
     * ヘルスチェックAPI。
     * <p>
     * システムが正常稼働している場合 "OK" を返します。
     * @return "OK" の文字列レスポンス
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        // ヘルスチェック結果を返却
        return ResponseEntity.ok("OK");
    }
}
