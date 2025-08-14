# Use the official Eclipse Temurin (AdoptOpenJDK) 17 image as the build stage
FROM gradle:8.5-jdk17 AS build

WORKDIR /app

# Copy all files
COPY . .

# Build the application
RUN gradle bootJar -x test

# Use Eclipse Temurin (AdoptOpenJDK) for the final stage - more secure than openjdk
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Install curl for health check
RUN apt-get update && apt-get install -y curl && apt-get clean

# Copy the built JAR file from the build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Create a non-root user and group
RUN groupadd -r spring && useradd -r -g spring spring

# Set ownership of the application directory to the non-root user
RUN chown -R spring:spring /app

# Add startup script
COPY --from=build /app/wait-for-keycloak.sh /app/wait-for-keycloak.sh
RUN chmod +x /app/wait-for-keycloak.sh

# Switch to the non-root user
USER spring:spring

# Expose the port
EXPOSE 8080

# Run the application with startup script
ENTRYPOINT ["/app/wait-for-keycloak.sh"]
