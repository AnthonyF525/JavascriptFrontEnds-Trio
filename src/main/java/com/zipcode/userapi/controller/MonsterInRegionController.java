package com.zipcode.userapi.controller;

import com.zipcode.userapi.model.MonsterInRegion;
import com.zipcode.userapi.model.Region;
import com.zipcode.userapi.repository.MonsterInRegionRepository;
import com.zipcode.userapi.repository.RegionRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/monsters")
@CrossOrigin(origins = "*")
public class MonsterInRegionController {

    @Autowired
    private MonsterInRegionRepository monsterRepository;

    @Autowired
    private RegionRepository regionRepository;

    @GetMapping
    public List<MonsterInRegion> getAllMonsters() {
        return monsterRepository.findAll();
    }

    // MOVE THESE TO THE TOP (before any /{id} endpoints):
    @GetMapping("/debug")
    public ResponseEntity<String> debugMonsters() {
        List<MonsterInRegion> monsters = monsterRepository.findAll();

        String debug = String.format("Found %d monsters in list", monsters.size());

        if (monsters.isEmpty()) {
            return ResponseEntity.ok("No monsters found in database");
        }

        MonsterInRegion first = monsters.get(0);
        if (first == null) {
            return ResponseEntity.ok("First monster is null! List size: " + monsters.size());
        }

        debug = String.format(
                "First monster: id=%s, name=%s, element=%s, class=%s, regionId=%s",
                first.getId(),
                first.getMonsterName(),
                first.getElement(),
                first.getMonsterClass(),
                first.getRegionId());

        return ResponseEntity.ok(debug);
    }

    @GetMapping("/debug2")
    public ResponseEntity<String> debugMonsters2() {
        try {
            // Try to get just one record by ID
            Optional<MonsterInRegion> monster = monsterRepository.findById(1L);

            if (monster.isPresent()) {
                MonsterInRegion m = monster.get();
                return ResponseEntity.ok(
                        String.format("Monster found: id=%s, name=%s, element=%s",
                                m.getId(), m.getMonsterName(), m.getElement()));
            } else {
                return ResponseEntity.ok("No monster found with ID 1");
            }
        } catch (Exception e) {
            return ResponseEntity.ok("Error: " + e.getMessage());
        }
    }

    @GetMapping("/debug3")
    public ResponseEntity<String> debugRawData() {
        try {
            // Get the count directly from repository
            long count = monsterRepository.count();
            return ResponseEntity.ok("Total monsters in database: " + count);
        } catch (Exception e) {
            return ResponseEntity.ok("Error counting monsters: " + e.getMessage());
        }
    }

    @GetMapping("/simple")
    public ResponseEntity<String> simpleTest() {
        return ResponseEntity.ok("Simple endpoint works!");
    }

    @GetMapping("/{id}") // <-- This is catching "/debug2" as an ID!
    public ResponseEntity<MonsterInRegion> getMonsterById(@PathVariable Long id) {
        Optional<MonsterInRegion> monster = monsterRepository.findById(id);

        if (monster.isPresent()) {
            return ResponseEntity.ok(monster.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createMonster(@Valid @RequestBody MonsterInRegion monster) {
        try {
            if (monster.getRegionId() == null) {
                return ResponseEntity.badRequest()
                        .body("Error: Region ID is required!");
            }

            Optional<Region> region = regionRepository.findById(monster.getRegionId());
            if (!region.isPresent()) {
                return ResponseEntity.badRequest()
                        .body("Error: Region not found!");
            }

            MonsterInRegion savedMonster = monsterRepository.save(monster);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedMonster);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error: Could not create Monster - " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMonster(@PathVariable Long id,
            @Valid @RequestBody MonsterInRegion monsterDetails) {
        try {
            Optional<MonsterInRegion> optionalMonster = monsterRepository.findById(id);

            if (!optionalMonster.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            MonsterInRegion monster = optionalMonster.get();

            // Validate region if it's being changed
            if (monsterDetails.getRegionId() != null) {
                Optional<Region> region = regionRepository.findById(monsterDetails.getRegionId());
                if (!region.isPresent()) {
                    return ResponseEntity.badRequest()
                            .body("Error: Region not found!");
                }
                monster.setRegionId(monsterDetails.getRegionId());
            }

            // Update fields
            monster.setMonsterName(monsterDetails.getMonsterName());
            monster.setElement(monsterDetails.getElement());
            monster.setMonsterClass(monsterDetails.getMonsterClass());

            MonsterInRegion updatedMonster = monsterRepository.save(monster);
            return ResponseEntity.ok(updatedMonster);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error: Could not update Monster - " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMonster(@PathVariable Long id) {
        try {
            Optional<MonsterInRegion> monster = monsterRepository.findById(id);

            if (!monster.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            monsterRepository.deleteById(id);
            return ResponseEntity.ok().body("Monster deleted successfully");

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error: Could not delete Monster - " + e.getMessage());
        }
    }
}
