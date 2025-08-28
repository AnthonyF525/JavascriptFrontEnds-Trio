package com.zipcode.userapi.repository;

import com.zipcode.userapi.model.MonsterInRegion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MonsterInRegionRepository extends JpaRepository<MonsterInRegion, Long> {

    List<MonsterInRegion> findByRegionId(Long regionId);
    List<MonsterInRegion> findByElement(String element);
    List<MonsterInRegion> findByMonsterClass(String monsterClass);
    Optional<MonsterInRegion> findByMonsterName(String monsterName);
    boolean existsByMonsterName(String monsterName);
    boolean existsByMonsterNameAndRegionId(String monsterName, Long regionId);
}
