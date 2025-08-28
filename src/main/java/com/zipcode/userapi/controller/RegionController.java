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
@RequestMapping("/api/regions")
@CrossOrigin(origins = "*")
public class RegionController {

    @Autowired
    private RegionRepository regionRepository;

    @Autowired
    private MonsterInRegionRepository monsterInRegionRepository;

    @GetMapping
    public List<Region> getAllRegions() {
        return regionRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Region> getRegionById(@PathVariable Long id) {
        Optional<Region> region = regionRepository.findById(id);

        if (region.isPresent()) {
            return ResponseEntity.ok(region.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    } 

    @PostMapping
    public ResponseEntity<?> createRegion(@Valid @RequestBody Region region) {
        try {
            // Check for dupes
            // if (regionRepository.existsByRegionName(region.getRegionName())) {
            //     return ResponseEntity.badRequest()
            //         .body("Error: Region name is already in use!");
            // }
            
            // if (regionRepository.existsByTerrain(region.getTerrain())) {
            //     return ResponseEntity.badRequest()
            //         .body("Error: Terrain is already in use!");
            // }

            Region savedRegion = regionRepository.save(region);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedRegion);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error: Could not create Region - " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRegion(@PathVariable Long id,
                                        @Valid @RequestBody Region regionDetails) {
        try {
            Optional<Region> optionalRegion = regionRepository.findById(id);

            if (!optionalRegion.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Region region = optionalRegion.get();


            // KEEP this region name check - region names should be unique
            if (!region.getRegionName().equals(regionDetails.getRegionName()) &&
                regionRepository.existsByRegionName(regionDetails.getRegionName())) {
                return ResponseEntity.badRequest()
                     .body("Error: Region name is already in use!");
            }
            
            //Update fields
            region.setRegionName(regionDetails.getRegionName());
            region.setClimate(regionDetails.getClimate());
            region.setTerrain(regionDetails.getTerrain());
            

            Region updatedRegion = regionRepository.save(region);
            return ResponseEntity.ok(updatedRegion);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error: Could not update Region - " + e.getMessage());
        }
    
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRegion(@PathVariable Long id) {
        try {
            Optional<Region> region = regionRepository.findById(id);

            if (!region.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            regionRepository.deleteById(id);
            return ResponseEntity.ok().body("Region deleted successfully");

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error: Could not delete Region - " + e.getMessage());
        }
    }

    @GetMapping("/{id}/monsters")
    public ResponseEntity<List<MonsterInRegion>> getMonstersByRegion(@PathVariable Long id) {
        Optional<Region> region = regionRepository.findById(id);

        if (!region.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        List<MonsterInRegion> monsters = monsterInRegionRepository.findByRegionId(id);
        return ResponseEntity.ok(monsters);
    }
}