package com.mediaccess.controller;

import com.mediaccess.entity.MedicalRecord;
import com.mediaccess.entity.Patient;
import com.mediaccess.repository.MedicalRecordRepository;
import com.mediaccess.repository.PatientRepository;
import com.mediaccess.service.QRCodeService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PatientController {

    private final PatientRepository patientRepository;
    private final MedicalRecordRepository requestRecordRepository;
    private final QRCodeService qrCodeService;

    public PatientController(PatientRepository patientRepository, 
                             MedicalRecordRepository requestRecordRepository,
                             QRCodeService qrCodeService) {
        this.patientRepository = patientRepository;
        this.requestRecordRepository = requestRecordRepository;
        this.qrCodeService = qrCodeService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientRepository.findAll());
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addPatient(@RequestBody MedicalRecord request) {
        Patient savedPatient = patientRepository.save(request.getPatient());
        request.setPatient(savedPatient);
        request.setCreatedAt(LocalDateTime.now());
        requestRecordRepository.save(request);
        return ResponseEntity.ok(request);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<?> getPatient(@PathVariable Long id) {
        Optional<MedicalRecord> record = requestRecordRepository.findByPatientId(id);
        if(record.isPresent()) {
            return ResponseEntity.ok(record.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/token/{qrToken}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<?> getPatientByToken(@PathVariable String qrToken) {
        Optional<Patient> patient = patientRepository.findByQrToken(qrToken);
        if(patient.isPresent()) {
            return getPatient(patient.get().getId());
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<?> updatePatient(@PathVariable Long id, @RequestBody MedicalRecord updateReq) {
        Optional<MedicalRecord> existingOpt = requestRecordRepository.findByPatientId(id);
        if(!existingOpt.isPresent()) return ResponseEntity.notFound().build();

        MedicalRecord existing = existingOpt.get();
        Patient p = existing.getPatient();
        Patient updateP = updateReq.getPatient();
        
        // update patient details
        p.setName(updateP.getName());
        p.setAge(updateP.getAge());
        p.setGender(updateP.getGender());
        p.setBloodGroup(updateP.getBloodGroup());
        p.setEmergencyContact(updateP.getEmergencyContact());
        patientRepository.save(p);

        // update medical record
        existing.setMedicalHistory(updateReq.getMedicalHistory());
        existing.setCurrentDiagnosis(updateReq.getCurrentDiagnosis());
        existing.setMedications(updateReq.getMedications());
        existing.setAllergies(updateReq.getAllergies());
        requestRecordRepository.save(existing);

        return ResponseEntity.ok(existing);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletePatient(@PathVariable Long id) {
        Optional<MedicalRecord> existingOpt = requestRecordRepository.findByPatientId(id);
        if(existingOpt.isPresent()) {
            requestRecordRepository.delete(existingOpt.get());
        }
        patientRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/qr/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<byte[]> getQRCode(@PathVariable Long id) {
        Optional<Patient> patient = patientRepository.findById(id);
        if(!patient.isPresent()) return ResponseEntity.notFound().build();

        String frontendUrl = System.getenv("FRONTEND_URL");
        if (frontendUrl == null || frontendUrl.isEmpty()) {
            frontendUrl = "http://localhost:5173";
        }
        String qrText = frontendUrl + "/scan-redirect/" + patient.get().getQrToken();
        
        byte[] qrImage = qrCodeService.generateQRCode(qrText, 250, 250);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"qr_" + id + ".png\"")
                .contentType(MediaType.IMAGE_PNG)
                .body(qrImage);
    }
}
