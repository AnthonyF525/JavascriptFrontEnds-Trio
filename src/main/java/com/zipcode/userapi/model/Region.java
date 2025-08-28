package com.zipcode.userapi.model;



import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "region")  
public class Region {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Region name is required")
    @Column(name = "region_name", unique = true)
    private String regionName;

    @NotBlank(message = "Climate is required")
    @Column(name = "climate")
    private String climate;

    
    @NotBlank(message = "Terrain is required")
    @Column(name = "terrain")
    private String terrain;


    //Default constructor (Required by JPA)
    public Region() {}

    // Constructor for creating region
    public Region(String regionName, String climate, String terrain) {
        this.regionName = regionName;
        this.climate = climate;
        this.terrain = terrain;
        
    }

    // Getter and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRegionName() {
        return regionName;
    }

    public void setRegionName(String regionName) {
        this.regionName = regionName;
    }

    public String getClimate() {
        return climate;
    }

    public void setClimate(String climate) {
        this.climate = climate;
    }

    public String getTerrain() {
        return terrain;
    }

    public void setTerrain(String terrain) {
        this.terrain = terrain;
    }

    @Override
    public String toString() {
        return "Region{" + 
                "id=" + id +   
                ", regionName='" + regionName + '\'' + 
                ", climate='" + climate + '\'' +
                ", terrain='" + terrain + '\'' +
                '}';
    }
}
