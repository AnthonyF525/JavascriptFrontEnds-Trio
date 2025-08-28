package com.zipcode.userapi.repository;

import com.zipcode.userapi.model.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import java.util.Optional;

@Repository
public interface RegionRepository extends JpaRepository<Region, Long> {

    //String Data JPA automatically implements these methods
    Optional<Region> findByTerrain(String terrain);
    Optional<Region> findByRegionName(String regionName);
    List<Region> findByClimate(String Climate);
    boolean existsByTerrain(String terrain);
    boolean existsByRegionName(String regionName);
    
}
