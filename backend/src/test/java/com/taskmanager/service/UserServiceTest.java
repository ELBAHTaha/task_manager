package com.taskmanager.service;

import com.taskmanager.model.User;
import com.taskmanager.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private String testEmail;
    private String rawPassword;
    private String encodedPassword;

    @BeforeEach
    void setUp() {
        testEmail = "test@example.com";
        rawPassword = "password123";
        encodedPassword = "$2a$10$encodedPasswordHash";

        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail(testEmail);
        testUser.setPassword(encodedPassword);
    }

    @Test
    void findByEmail_WhenUserExists_ShouldReturnUser() {
        // Given
        when(userRepository.findByEmail(testEmail)).thenReturn(Optional.of(testUser));

        // When
        Optional<User> result = userService.findByEmail(testEmail);

        // Then
        assertTrue(result.isPresent());
        assertEquals(testUser, result.get());
        assertEquals(testEmail, result.get().getEmail());

        verify(userRepository, times(1)).findByEmail(testEmail);
    }

    @Test
    void findByEmail_WhenUserDoesNotExist_ShouldReturnEmpty() {
        // Given
        when(userRepository.findByEmail(testEmail)).thenReturn(Optional.empty());

        // When
        Optional<User> result = userService.findByEmail(testEmail);

        // Then
        assertFalse(result.isPresent());

        verify(userRepository, times(1)).findByEmail(testEmail);
    }

    @Test
    void findByEmail_WithNullEmail_ShouldHandleGracefully() {
        // Given
        when(userRepository.findByEmail(null)).thenReturn(Optional.empty());

        // When
        Optional<User> result = userService.findByEmail(null);

        // Then
        assertFalse(result.isPresent());

        verify(userRepository, times(1)).findByEmail(null);
    }

    @Test
    void findByEmail_WithEmptyEmail_ShouldHandleGracefully() {
        // Given
        String emptyEmail = "";
        when(userRepository.findByEmail(emptyEmail)).thenReturn(Optional.empty());

        // When
        Optional<User> result = userService.findByEmail(emptyEmail);

        // Then
        assertFalse(result.isPresent());

        verify(userRepository, times(1)).findByEmail(emptyEmail);
    }

    @Test
    void verifyPassword_WhenPasswordMatches_ShouldReturnTrue() {
        // Given
        when(passwordEncoder.matches(rawPassword, encodedPassword)).thenReturn(true);

        // When
        boolean result = userService.verifyPassword(rawPassword, encodedPassword);

        // Then
        assertTrue(result);

        verify(passwordEncoder, times(1)).matches(rawPassword, encodedPassword);
    }

    @Test
    void verifyPassword_WhenPasswordDoesNotMatch_ShouldReturnFalse() {
        // Given
        String wrongPassword = "wrongPassword";
        when(passwordEncoder.matches(wrongPassword, encodedPassword)).thenReturn(false);

        // When
        boolean result = userService.verifyPassword(wrongPassword, encodedPassword);

        // Then
        assertFalse(result);

        verify(passwordEncoder, times(1)).matches(wrongPassword, encodedPassword);
    }

    @Test
    void verifyPassword_WithNullRawPassword_ShouldReturnFalse() {
        // Given
        when(passwordEncoder.matches(null, encodedPassword)).thenReturn(false);

        // When
        boolean result = userService.verifyPassword(null, encodedPassword);

        // Then
        assertFalse(result);

        verify(passwordEncoder, times(1)).matches(null, encodedPassword);
    }

    @Test
    void verifyPassword_WithNullEncodedPassword_ShouldReturnFalse() {
        // Given
        when(passwordEncoder.matches(rawPassword, null)).thenReturn(false);

        // When
        boolean result = userService.verifyPassword(rawPassword, null);

        // Then
        assertFalse(result);

        verify(passwordEncoder, times(1)).matches(rawPassword, null);
    }

    @Test
    void save_WithNewUser_ShouldEncodePasswordAndSave() {
        // Given
        User newUser = new User();
        newUser.setEmail("newuser@example.com");
        newUser.setPassword(rawPassword);

        User savedUser = new User();
        savedUser.setId(2L);
        savedUser.setEmail("newuser@example.com");
        savedUser.setPassword(encodedPassword);

        when(passwordEncoder.encode(rawPassword)).thenReturn(encodedPassword);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // When
        User result = userService.save(newUser);

        // Then
        assertNotNull(result);
        assertEquals(savedUser.getId(), result.getId());
        assertEquals(savedUser.getEmail(), result.getEmail());
        assertEquals(encodedPassword, result.getPassword());

        verify(passwordEncoder, times(1)).encode(rawPassword);
        verify(userRepository, times(1)).save(newUser);
    }

    @Test
    void save_WithExistingUser_ShouldUpdatePasswordAndSave() {
        // Given
        testUser.setPassword(rawPassword); // Set raw password for encoding

        User updatedUser = new User();
        updatedUser.setId(testUser.getId());
        updatedUser.setEmail(testUser.getEmail());
        updatedUser.setPassword(encodedPassword);

        when(passwordEncoder.encode(rawPassword)).thenReturn(encodedPassword);
        when(userRepository.save(testUser)).thenReturn(updatedUser);

        // When
        User result = userService.save(testUser);

        // Then
        assertNotNull(result);
        assertEquals(testUser.getId(), result.getId());
        assertEquals(testUser.getEmail(), result.getEmail());
        assertEquals(encodedPassword, result.getPassword());

        verify(passwordEncoder, times(1)).encode(rawPassword);
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void save_WithNullUser_ShouldThrowException() {
        // When & Then
        assertThrows(RuntimeException.class, () -> userService.save(null));

        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void save_WhenRepositoryThrowsException_ShouldPropagateException() {
        // Given
        User newUser = new User();
        newUser.setEmail("newuser@example.com");
        newUser.setPassword(rawPassword);

        when(passwordEncoder.encode(rawPassword)).thenReturn(encodedPassword);
        when(userRepository.save(any(User.class))).thenThrow(new RuntimeException("Database error"));

        // When & Then
        assertThrows(RuntimeException.class, () -> userService.save(newUser));

        verify(passwordEncoder, times(1)).encode(rawPassword);
        verify(userRepository, times(1)).save(newUser);
    }

    @Test
    void save_ShouldModifyOriginalUserPassword() {
        // Given
        User newUser = new User();
        newUser.setEmail("newuser@example.com");
        newUser.setPassword(rawPassword);

        String originalPassword = newUser.getPassword();

        when(passwordEncoder.encode(rawPassword)).thenReturn(encodedPassword);
        when(userRepository.save(newUser)).thenReturn(newUser);

        // When
        userService.save(newUser);

        // Then
        assertNotEquals(originalPassword, newUser.getPassword());
        assertEquals(encodedPassword, newUser.getPassword());

        verify(passwordEncoder, times(1)).encode(originalPassword);
        verify(userRepository, times(1)).save(newUser);
    }
}
