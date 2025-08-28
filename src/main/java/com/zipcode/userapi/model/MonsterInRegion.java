package com.zipcode.userapi.model;

import jakarta.persistence.*;

@Entity
@Table(name = "monster_in_region")  
public class MonsterInRegion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")  
    private Long id;  

    @Column(name = "region_id")
    private Long regionId;

    @Column(name = "monster_name")
    private String monsterName;

    @Column(name = "element")
    private String element;

    @Column(name = "monster_class")
    private String monsterClass;

    
    public MonsterInRegion() {}

    // GETTERS
    public Long getId() {
        return id;
    }

    public Long getRegionId() {
        return regionId;
    }

    public String getMonsterName() {
        return monsterName;
    }

    public String getElement() {
        return element;
    }

    public String getMonsterClass() {
        return monsterClass;
    }

    // SETTERS
    public void setId(Long id) {
        this.id = id;
    }

    public void setRegionId(Long regionId) {
        this.regionId = regionId;
    }

    public void setMonsterName(String monsterName) {
        this.monsterName = monsterName;
    }

    public void setElement(String element) {
        this.element = element;
    }

    public void setMonsterClass(String monsterClass) {
        this.monsterClass = monsterClass;
    }

    @Override
    public String toString() {
        return "MonsterInRegion{" +
                "id=" + id +
                ", regionId=" + regionId +
                ", monsterName='" + monsterName + '\'' +
                ", element='" + element + '\'' +
                ", monsterClass='" + monsterClass + '\'' +
                '}';
    }
    
    
}
