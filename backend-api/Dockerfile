# Use the official OpenJDK 17 image as the build stage
FROM gradle:8.5-jdk17 AS build

WORKDIR /app

# Copy gradle files
COPY build.gradle settings.gradle ./
COPY gradle gradle
COPY gradlew gradlew.bat ./

# Download dependencies
RUN gradle build -x test --parallel --continue

# Copy source code
COPY src src

# Build the application
RUN gradle bootJar -x test

# Use the official OpenJDK 17 runtime image for the final stage
FROM openjdk:17-jre-slim

WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Expose the port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
