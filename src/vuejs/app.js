const { createApp } = Vue;

createApp({
    //Data function
    data() {
        return {
            appTitle: 'Monster Hunter Guild Tasks',
            appSubtitle: 'Vue.js',

            //will auto update when UI changed
            isLoading: true,
            loadingMessage: 'Initializing Vue Hunt Manager...',

            monsters: [],
            regions: [],
            huntStatuses: new Map(),

            //Stat (computed automagically)
            totalHunts: 0,
            pendingHunts: 0,
            completedHunts: 0,
            totalRegions: 0,

            // ADD THESE MISSING PROPERTIES:
            showHuntForm: false,        // Controls hunt form modal
            showRegionForm: false,      // Controls region form modal
            currentView: 'monsters',    // 'monsters' or 'regions'
            editingMonster: null,       // Monster being edited (if any)
            editingRegion: null,        // Region being edited (if any)

            // Form data for new hunts/regions
            huntFormData: {
                monsterName: '',
                element: 'Fire',
                monsterClass: '',
                regionId: ''
            },
            
            regionFormData: {
                regionName: '',
                climate: '',
                terrain: ''
            },

            // ADD THESE FILTER PROPERTIES:
            selectedRegion: '',     // Currently selected region filter
            selectedElement: '',    // Currently selected element filter
            filteredMonsters: []    // Monsters after applying filters
        }
    },

    template: `
        <div class="container">
            <header class="header">
                <h1>Monster Hunter Guild Task</h1>
                <p>Vue.js</p>
            </header>

            <main>
                <div v-if="isLoading" class="loading">
                    <p>{{ loadingMessage }}</p>
                </div>

                <div v-else>
                    <section class="stats">
                        <div class="stat-card">
                            <h3>{{ totalHunts }}</h3>
                            <p>Total Hunts</p>
                        </div>
                        <div class="stat-card">
                            <h3>{{ pendingHunts }}</h3>
                            <p>Pending Hunts</p>
                        </div>
                        <div class="stat-card">
                            <h3>{{ completedHunts }}</h3>
                            <p>Completed</p>
                        </div>
                        <div class="stat-card">
                            <h3>{{ totalRegions }}</h3>
                            <p>Total Regions</p>
                        </div>
                    </section>

                    <section class="actions">
                        <button class="btn btn-primary" @click="openHuntForm">New Hunt</button>
                        <button class="btn btn-secondary" @click="openRegionForm">New Location</button>
                        <button class="btn btn-info" @click="viewRegions">View Locations</button>
                    </section>

                    <!-- ADD THIS FILTER SECTION -->
                    <section v-if="currentView === 'monsters'" class="filters">
                        <div class="filter-group">
                            <label>Filter by Region:</label>
                            <select v-model="selectedRegion" @change="applyFilters">
                                <option value="">All Regions</option>
                                <option v-for="region in regions" :key="region.id" :value="region.id">
                                    {{ region.regionName }}
                                </option>
                            </select>
                        </div>
                        
                        <div class="filter-group">
                            <label>Filter by Element:</label>
                            <select v-model="selectedElement" @change="applyFilters">
                                <option value="">All Elements</option>
                                <option value="Fire">Fire</option>
                                <option value="Water">Water</option>
                                <option value="Thunder">Thunder</option>
                                <option value="Ice">Ice</option>
                                <option value="Dragon">Dragon</option>
                            </select>
                        </div>
                        
                        <button v-if="selectedRegion || selectedElement" 
                                @click="clearFilters" 
                                class="btn btn-secondary">
                            Clear Filters
                        </button>
                    </section>

                    <!-- UPDATE HUNT CARDS TO USE FILTERED MONSTERS -->
                    <section v-if="currentView === 'monsters'" class="hunt-section">
                        <h2>{{ getResultsTitle() }}</h2>
                        <div class="hunt-grid">
                            <div v-for="monster in filteredMonsters" :key="monster.id" class="hunt-card">
                                <div class="hunt-header">
                                    <h3>{{ monster.monsterName }}</h3>
                                    <span class="hunt-status">{{ getStatusText(monster.id) }}</span>
                                </div>
                                <div class="hunt-details">
                                    <p><strong>Element:</strong> {{ monster.element }}</p>
                                    <p><strong>Region:</strong> {{ getRegionName(monster.regionId) }}</p>
                                    <p><strong>Class:</strong> {{ monster.monsterClass || 'Flying Wyvern' }}</p>
                                </div>
                                <div class="hunt-actions">
                                    <button @click="toggleHuntStatus(monster.id)" class="btn btn-primary">
                                        {{ getActionButtonText(monster.id) }}
                                    </button>
                                    <button class="btn btn-secondary" @click="editHunt(monster)">Edit</button>
                                    <button class="btn btn-danger" @click="deleteHunt(monster.id)">Delete</button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Region View -->
                    <section v-if="currentView === 'regions'" class="regions-view">
                        <div class="view-header">
                            <h2>All Regions</h2>
                            <button @click="switchToMonstersView" class="btn btn-secondary">Back to Hunts</button>
                        </div>
                        <div class="region-grid">
                            <div v-for="region in regions" :key="region.id" class="region-card">
                                <h3>{{ region.regionName }}</h3>
                                <p><strong>Climate:</strong> {{ region.climate }}</p>
                                <p><strong>Terrain:</strong> {{ region.terrain }}</p>
                                <div class="card-actions">
                                    <button @click="editRegion(region)" class="btn btn-primary">Edit</button>
                                    <button @click="deleteRegion(region.id)" class="btn btn-danger">Delete</button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <!-- Hunt Form Modal -->
            <div v-if="showHuntForm" class="modal">
                <div class="modal-content">
                    <span class="close" @click="closeHuntForm">&times;</span>
                    <h2>{{ editingMonster ? 'Edit Hunt' : 'Add New Hunt' }}</h2>
                    <form @submit.prevent="submitHuntForm">
                        <div class="form-group">
                            <label>Monster Name:</label>
                            <input v-model="huntFormData.monsterName" type="text" required>
                        </div>
                        <div class="form-group">
                            <label>Element:</label>
                            <select v-model="huntFormData.element" required>
                                <option value="Fire">Fire</option>
                                <option value="Water">Water</option>
                                <option value="Thunder">Thunder</option>
                                <option value="Ice">Ice</option>
                                <option value="Dragon">Dragon</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Monster Class:</label>
                            <input v-model="huntFormData.monsterClass" type="text" required>
                        </div>
                        <div class="form-group">
                            <label>Region:</label>
                            <select v-model="huntFormData.regionId" required>
                                <option value="">Select Region</option>
                                <option v-for="region in regions" :key="region.id" :value="region.id">
                                    {{ region.regionName }}
                                </option>
                            </select>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                {{ editingMonster ? 'Update' : 'Create' }} Hunt
                            </button>
                            <button type="button" class="btn btn-secondary" @click="closeHuntForm">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Region Form Modal -->
            <div v-if="showRegionForm" class="modal">
                <div class="modal-content">
                    <span class="close" @click="closeRegionForm">&times;</span>
                    <h2>{{ editingRegion ? 'Edit Region' : 'Add New Region' }}</h2>
                    <form @submit.prevent="submitRegionForm">
                        <div class="form-group">
                            <label>Region Name:</label>
                            <input v-model="regionFormData.regionName" type="text" required>
                        </div>
                        <div class="form-group">
                            <label>Climate:</label>
                            <select v-model="regionFormData.climate" required>
                                <option value="">Select Climate</option>
                                <option value="Tropical">Tropical</option>
                                <option value="Hot">Hot</option>
                                <option value="Temperate">Temperate</option>
                                <option value="Cold">Cold</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Terrain:</label>
                            <select v-model="regionFormData.terrain" required>
                                <option value="">Select Terrain</option>
                                <option value="Forest">Forest</option>
                                <option value="Desert">Desert</option>
                                <option value="Mountains">Mountains</option>
                                <option value="Swamp">Swamp</option>
                            </select>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                {{ editingRegion ? 'Update' : 'Create' }} Region
                            </button>
                            <button type="button" class="btn btn-secondary" @click="closeRegionForm">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `,

    methods: {
        // Button click handles
        openHuntForm() {
            this.editingMonster = null;  // Clear any editing state
            this.huntFormData = {        // Reset form
                monsterName: '',
                element: 'Fire',
                monsterClass: '',
                regionId: ''
            };
            this.showHuntForm = true;    // Show the modal
        },

        openRegionForm() {
            this.editingRegion = null;   // Clear any editing state
            this.regionFormData = {      // Reset form
                regionName: '',
                climate: '',
                terrain: ''
            };
            this.showRegionForm = true;  // Show the modal
        },

        viewRegions() {
            this.currentView = 'regions';  // Switch to regions view
        },

        //Get CSS class for hunt card based on status
        getHuntCardClass(monster) {
            const status = this.huntStatuses.get(monster.id) || 'pending';
            return `hunt-${status}`;
        },

        //Get stautus display test
        getStatusText(monsterId) {
            const status = this.huntStatuses.get(monsterId) || 'pending';
            return status.charAt(0).toUpperCase() + status.slice(1);
        },

        getStatusClass(monsterId) {
            const status = this.huntStatuses.get(monsterId) || 'pending';
            return `status-${status}`;
        },

        //Get region name by ID
        getRegionName(regionId) {
            const region = this.regions.find(r => r.id === regionId);
            return region ? region.regionName : 'Unknown Region';
        },

        //toggle hunt status
        toggleHuntStatus(monsterId) {
            const currentStatus = this.huntStatuses.get(monsterId) || 'pending';
            const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
            this.huntStatuses.set(monsterId, newStatus);
            this.updateStats();
        },

        //Get action button class
        getActionButtonClass(monsterId) {
            const status = this.huntStatuses.get(monsterId) || 'pending';
            return status === 'pending' ? 'btn btn-success' : 'btn btn-warning';
        },

        //Action buutton text
        getActionButtonText(monsterId) {
            const status = this.huntStatuses.get(monsterId) || 'pending';
            return status === 'pending' ? 'Complete Hunt' : 'Reopen Hunt';
        },

        //Edit Hunt
        editHunt(monster) {
            this.editingMonster = monster;           // Set the monster being edited
            this.huntFormData = {                    // Pre-populate the form
                monsterName: monster.monsterName,
                element: monster.element,
                monsterClass: monster.monsterClass,
                regionId: monster.regionId
            };
            this.showHuntForm = true;                // Show the modal
        },

        //Delete Hunt
        async deleteHunt(monsterId) {
            if (confirm('Are you sure you want to delete this hunt?')) {
                try {
                    await MonsterAPI.deleteMonster(monsterId);
                    this.monsters = this.monsters.filter(m => m.id !== monsterId);
                    this.huntStatuses.delete(monsterId);
                    this.updateStats();
                    this.applyFilters();  // ADD THIS LINE
                } catch (error) {
                    console.error('Error deleting hunt:', error);
                    alert('Error deleting hunt: ' + error.message);
                }
            }
        },

        // Statistic cal
        updateStats() {
            this.totalHunts = this.monsters.length;
            this.totalRegions = this.regions.length;

            //Count Hunt
            let pending = 0;
            let completed = 0;

            this.monsters.forEach(monster => {
                const status = this.huntStatuses.get(monster.id);
                if (status === 'completed') completed++;
                else pending++;
            });

            this.pendingHunts = pending;
            this.completedHunts = completed;
        },

        closeHuntForm() {
            this.showHuntForm = false;
            this.editingMonster = null;
        },

        closeRegionForm() {
            this.showRegionForm = false;
            this.editingRegion = null;
        },

        switchToMonstersView() {
            this.currentView = 'monsters';
        },

        async submitHuntForm() {
            try {
                if (this.editingMonster) {
                    const response = await MonsterAPI.updateMonster(this.editingMonster.id, this.huntFormData);
                    const index = this.monsters.findIndex(m => m.id === this.editingMonster.id);
                    if (index !== -1) {
                        this.monsters[index] = response;
                    }
                } else {
                    const newMonster = await MonsterAPI.createMonster(this.huntFormData);
                    this.monsters.push(newMonster);
                    this.huntStatuses.set(newMonster.id, 'pending');
                }
                
                this.updateStats();
                this.applyFilters();  // ADD THIS LINE
                this.closeHuntForm();
            } catch (error) {
                console.error('Error saving hunt:', error);
                alert('Error saving hunt: ' + error.message);
            }
        },

        async submitRegionForm() {
            try {
                if (this.editingRegion) {
                    // Update existing region
                    const response = await RegionAPI.updateRegion(this.editingRegion.id, this.regionFormData);
                    const index = this.regions.findIndex(r => r.id === this.editingRegion.id);
                    if (index !== -1) {
                        this.regions[index] = response;
                    }
                } else {
                    // Create new region
                    const newRegion = await RegionAPI.createRegion(this.regionFormData);
                    this.regions.push(newRegion);
                }
                
                this.updateStats();
                this.closeRegionForm();
            } catch (error) {
                console.error('Error saving region:', error);
                alert('Error saving region: ' + error.message);
            }
        },

        editRegion(region) {
            this.editingRegion = region;
            this.regionFormData = {
                regionName: region.regionName,
                climate: region.climate,
                terrain: region.terrain
            };
            this.showRegionForm = true;
        },

        async deleteRegion(regionId) {
            if (confirm('Are you sure you want to delete this region?')) {
                try {
                    await RegionAPI.deleteRegion(regionId);
                    this.regions = this.regions.filter(r => r.id !== regionId);
                    this.updateStats();
                } catch (error) {
                    console.error('Error deleting region:', error);
                    alert('Error deleting region: ' + error.message);
                }
            }
        },

        //Get CSS class for hunt card based on status
        getHuntCardClass(monster) {
            const status = this.huntStatuses.get(monster.id) || 'pending';
            return `hunt-${status}`;
        },

        //Get stautus display test
        getStatusText(monsterId) {
            const status = this.huntStatuses.get(monsterId) || 'pending';
            return status.charAt(0).toUpperCase() + status.slice(1);
        },

        getStatusClass(monsterId) {
            const status = this.huntStatuses.get(monsterId) || 'pending';
            return `status-${status}`;
        },

        //Get region name by ID
        getRegionName(regionId) {
            const region = this.regions.find(r => r.id === regionId);
            return region ? region.regionName : 'Unknown Region';
        },

        applyFilters() {
            this.filteredMonsters = this.monsters.filter(monster => {
                const matchesRegion = this.selectedRegion ? monster.regionId === this.selectedRegion : true;
                const matchesElement = this.selectedElement ? monster.element === this.selectedElement : true;
                return matchesRegion && matchesElement;
            });
        },

        // ADD THESE TWO MISSING METHODS:
    
        clearFilters() {
            this.selectedRegion = '';
            this.selectedElement = '';
            this.applyFilters();
        },

        getResultsTitle() {
            const count = this.filteredMonsters.length;
            
            if (this.selectedRegion && this.selectedElement) {
                const region = this.regions.find(r => r.id === parseInt(this.selectedRegion));
                return `${this.selectedElement} Monsters in ${region?.regionName} (${count})`;
            } else if (this.selectedRegion) {
                const region = this.regions.find(r => r.id === parseInt(this.selectedRegion));
                return `Monsters in ${region?.regionName} (${count})`;
            } else if (this.selectedElement) {
                return `${this.selectedElement} Monsters (${count})`;
            } else {
                return `All Hunts (${count})`;
            }
        },
    },
    // Lifecycle hook - runs when Vue app is mounted to DOM
    async mounted() {
        console.log('Vue app mounted!');

        try {
            this.isLoading = true;
            this.loadingMessage = 'Loading data Monster';
            
            const [monsters, regions] = await Promise.all([
                MonsterAPI.getAllMonsters(),
                RegionAPI.getAllRegions()
            ]);

            this.monsters = monsters;
            this.regions = regions;

            // Initialize hunt statuses
            this.monsters.forEach(monster => {
                if (!this.huntStatuses.has(monster.id)) {
                    this.huntStatuses.set(monster.id, 'pending');
                }
            });

            this.updateStats();
            this.applyFilters();  // ADD THIS LINE
            this.isLoading = false;
            this.loadingMessage = 'Hunt Manager queued up!';

        } catch (error) {
            console.error('Error loading data:', error);
            this.loadingMessage = 'Error loading hunt data';
            this.isLoading = false;
        }
    }
}).mount('#app');