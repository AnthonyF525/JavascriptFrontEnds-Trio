const API_BASE = '/api';
let allMonsters = [];
let allRegions = [];

//Load all monster from API
async function loadAllMonsters() {
    showLoading(true);
    try {
        const response = await fetch(`${API_BASE}/monsters`);
        allMonsters = await response.json();
        displayMonsters(allMonsters);
        updateResultsTitle(`All Monsters (${allMonsters.length})`);
    } catch (error) {
        console.error('Error loading monsters:', error);
        showError('Failed to load monsters');
    }
    showLoading(false);
}

//Load all regions from API
async function loadAllRegions() {
    showLoading(true);
    try {
        const response = await fetch(`${API_BASE}/regions`);
        allRegions = await response.json();
        populateRegionFilter();
        displayRegions(allRegions);
        updateResultsTitle(`All Regions (${allRegions.length})`);
    } catch (error) {
        console.error('Error loading regions:', error);
        showError('Failed to load regions');
    }
    showLoading(false);
}

//Display monster as cards
function displayMonsters(monsters) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    monsters.forEach(monster => {
        const monsterCard = document.createElement('div');
        monsterCard.className = `monster-card element-${monster.element.toLowerCase()}`;
        monsterCard.innerHTML = `
        <h3>${monster.monsterName}</h3>
        <p><strong>Element:</strong> ${monster.element}</p>
        <p><strong>Class:</strong> ${monster.monsterClass}</p>
        <p><strong>Region ID:</strong> ${monster.regionId}</p>
        <p><strong>ID:</strong> ${monster.id}</p>
        `;
        resultsDiv.appendChild(monsterCard);
    });
}

//Display regions
function displayRegions(regions) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    
    regions.forEach(region => {
        const regionCard = document.createElement('div');
        regionCard.className = 'monster-card';
        regionCard.innerHTML = `
            <h3>${region.regionName}</h3>
            <p><strong>Climate:</strong> ${region.climate}</p>
            <p><strong>Terrain:</strong> ${region.terrain}</p>
            <p><strong>ID:</strong> ${region.id}</p>
            <button onclick="loadMonstersByRegion(${region.id})">View Monsters</button>
        `;
        resultsDiv.appendChild(regionCard);
    });
}

//Filter by selected region
function filterByRegion() {
    applyFilters(); // Use combined filter function
}

// Filter by element  
function filterByElement() {
    applyFilters(); // Use combined filter function
}

// NEW: Combined filter function
function applyFilters() {
    const regionId = document.getElementById('regionFilter').value;
    const element = document.getElementById('elementFilter').value;
    
    let filtered = allMonsters;
    
    // Apply region filter if selected
    if (regionId) {
        filtered = filtered.filter(monster => monster.regionId === parseInt(regionId));
    }
    
    // Apply element filter if selected  
    if (element) {
        filtered = filtered.filter(monster => monster.element === element);
    }
    
    displayMonsters(filtered);
    
    // Update title to reflect both filters
    let title = '';
    if (element && regionId) {
        const region = allRegions.find(r => r.id === parseInt(regionId));
        title = `${element} Monsters in ${region ? region.regionName : 'Region ' + regionId} (${filtered.length})`;
    } else if (element) {
        title = `${element} Monsters (${filtered.length})`;
    } else if (regionId) {
        const region = allRegions.find(r => r.id === parseInt(regionId));
        title = `Monsters in ${region ? region.regionName : 'Region ' + regionId} (${filtered.length})`;
    } else {
        title = `All Monsters (${filtered.length})`;
    }
    
    updateResultsTitle(title);
}

//Filter Monsters by region (for "View Monsters" buttons)
function loadMonstersByRegion(regionId) {
    // Set the region filter dropdown
    document.getElementById('regionFilter').value = regionId;
    // Clear element filter
    document.getElementById('elementFilter').value = '';
    // Apply filters
    applyFilters();
}

// Populate region filter dropdown
function populateRegionFilter() {
    const select = document.getElementById('regionFilter');
    select.innerHTML = '<option value="">All Regions</option>';

    allRegions.forEach(region => {
        const option = document.createElement('option');
        option.value = region.id;
        option.textContent = region.regionName;
        select.appendChild(option);
    });
}

//Utility Stuff
function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

function updateResultsTitle(title) {
    document.getElementById('resultsTitle').textContent = title;
}

function showError(message) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<p style="color: #ff4444;">Error: ${message}</p>`;
}

function showAddForm() {
    alert('Add Monster form coming soon!');
}

// Load regions on page load
document.addEventListener('DOMContentLoaded', function() {
    loadAllRegions();
    loadAllMonsters();
});