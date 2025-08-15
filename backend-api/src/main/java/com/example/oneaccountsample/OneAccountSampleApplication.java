package com.example.oneaccountsample;

/**
 * OneAccount連携サンプル Spring Boot アプリケーションのエントリポイント。
 * <p>
 * このクラスからSpring Bootアプリケーションが起動します。
 */
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class OneAccountSampleApplication {

    /**
     * アプリケーションのメインメソッド。
     * <p>
     * Spring Bootアプリケーションを起動します。
     * @param args コマンドライン引数
     */
    public static void main(String[] args) {
        // Spring Bootアプリケーションの起動
        SpringApplication.run(OneAccountSampleApplication.class, args);
    }

}
