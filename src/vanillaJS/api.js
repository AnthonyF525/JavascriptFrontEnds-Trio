// Vanilla JS set up
const API_BASE_URL = 'http://localhost:8080/api';

//Utility fns for API calls
async function apiCall(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
    
}

//Monster API fns
const MonsterAPI = {
    //Get all monsters
    async getAllMonsters() {
        return await apiCall(`${API_BASE_URL}/monsters`);
    },

    //Create New Monster
    async createMonster(monsterData) {
        return await apiCall(`${API_BASE_URL}/monsters`, {
            method: 'POST',
            body: JSON.stringify(monsterData),
        });
    },

    //Update Monster
    async updateMonster(id, monsterData) {
        return await apiCall(`${API_BASE_URL}/monsters/${id}`, {
            method: 'PUT',
            body: JSON.stringify(monsterData),
        });
    },

    //Delete monster
    async deleteMonster(id) {
        return await apiCall(`${API_BASE_URL}/monsters/${id}`, {
            method: 'DELETE',
        });
    },
};

//Region API fns
const RegionAPI = {
    //Get all regions
    async getAllRegions() {
        return await apiCall(`${API_BASE_URL}/regions`);
    },

    //Create New region
    async createRegion(regionData) {
        return await apiCall(`${API_BASE_URL}/regions`, {
            method: 'POST',
            body: JSON.stringify(regionData),
        });
    },

    //Update region
    async updateRegion(id, regionData) {
        return await apiCall(`${API_BASE_URL}/regions/${id}`, {
            method: 'PUT',
            body: JSON.stringify(regionData),
        });
    },

    //Delete region
    async deleteRegion(id) {
        return await apiCall(`${API_BASE_URL}/regions/${id}`, {
            method: 'DELETE',
        });
    },
};