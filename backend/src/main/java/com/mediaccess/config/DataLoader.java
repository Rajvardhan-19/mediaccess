package com.mediaccess.config;

import com.mediaccess.entity.Role;
import com.mediaccess.entity.User;
import com.mediaccess.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);

            User doctor = new User();
            doctor.setUsername("doctor");
            doctor.setPassword(passwordEncoder.encode("doctor123"));
            doctor.setRole(Role.DOCTOR);
            userRepository.save(doctor);

            User nurse = new User();
            nurse.setUsername("nurse");
            nurse.setPassword(passwordEncoder.encode("nurse123"));
            nurse.setRole(Role.NURSE);
            userRepository.save(nurse);

            System.out.println("Default users created: admin/admin123, doctor/doctor123, nurse/nurse123");
        }
    }
}
