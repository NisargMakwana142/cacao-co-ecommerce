package com.ecommerce.cacao.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFound(
            ResourceNotFoundException exception
    ) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of(
                        "status", 404,
                        "message", exception.getMessage(),
                        "timestamp", LocalDateTime.now()
                ));
    }

    @ExceptionHandler(InsufficientStockException.class)
    public ResponseEntity<Map<String, Object>> handleInsufficientStock(
            InsufficientStockException exception
    ) {

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(Map.of(
                        "status", 409,
                        "message", exception.getMessage(),
                        "timestamp", LocalDateTime.now()
                ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(
            MethodArgumentNotValidException exception
    ) {

        Map<String, String> errors = new HashMap<>();

        exception.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "status", 400,
                        "message", "Validation failed",
                        "errors", errors,
                        "timestamp", LocalDateTime.now()
                ));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleUnreadableBody(
            HttpMessageNotReadableException exception
    ) {

        exception.printStackTrace();

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "status", 400,
                        "message", "Invalid request body: "
                                + rootMessage(exception),
                        "timestamp", LocalDateTime.now()
                ));
    }

    /*
     * Catch-all for any unexpected error.
     *
     * Without this, Spring returns a 500 with NO message, so the
     * frontend can only show "Something went wrong". This prints
     * the full stack trace in the Spring console and sends the
     * root cause back so it is visible in the browser.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleUnexpected(
            Exception exception
    ) throws Exception {

        // Let Spring Security handle its own exceptions (401 / 403).
        if (exception instanceof AccessDeniedException
                || exception instanceof AuthenticationException) {
            throw exception;
        }

        // Keep Spring's own status codes (404, 405, 415, ...).
        if (exception instanceof ErrorResponse errorResponse) {
            return ResponseEntity
                    .status(errorResponse.getStatusCode())
                    .body(Map.of(
                            "status",
                            errorResponse.getStatusCode().value(),
                            "message",
                            String.valueOf(exception.getMessage()),
                            "timestamp", LocalDateTime.now()
                    ));
        }

        System.out.println("========== UNEXPECTED SERVER ERROR ==========");
        exception.printStackTrace();
        System.out.println("=============================================");

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                        "status", 500,
                        "message", rootMessage(exception),
                        "timestamp", LocalDateTime.now()
                ));
    }

    private static String rootMessage(Throwable throwable) {

        Throwable root = throwable;

        while (root.getCause() != null
                && root.getCause() != root) {
            root = root.getCause();
        }

        return root.getClass().getSimpleName()
                + ": "
                + root.getMessage();
    }
}