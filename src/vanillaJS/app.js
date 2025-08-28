class HuntTaskManager {
    constructor() {
        //Manually track all states
        this.state = {
            monsters: [],
            regions: [],
            filteredMonsters: [],
            currentFilter: {
                status: '',   //All monsters from API
                region: '',   // All regions from API
                priority: ''  // Monster after filtering
            },
            huntStatuses: new Map(), // Track completion status
            isLoading: false,
            error: null,
            editingMonster: null
        };

        //Vanilla JS DOM element reference
        this.elements = {
            huntContainer: document.getElementById('hunt-container'),
            loading: document.getElementById('loading'),
            errorMessage: document.getElementById('error-message'),

            //Stats Elements
            totalHunts: document.getElementById('total-hunts'),
            pendingHunts: document.getElementById('pending-hunts'),
            completedHunts: document.getElementById('completed-hunts'),
            totalRegions: document.getElementById('total-regions'),

            //Filter elements
            statusFilter: document.getElementById('status-filter'),
            regionFilter: document.getElementById('region-filter'),
            priorityFilter: document.getElementById('priority-filter'),

            //Action buttons
            addHuntBtn: document.getElementById('add-hunt-btn'),
            addRegionBtn: document.getElementById('add-region-btn'),
            viewRegionsBtn: document.getElementById('view-regions-btn'),

            // Model elements
            huntFormModal: document.getElementById('hunt-form-modal'),
            huntForm: document.getElementById('hunt-form'),
            huntFormTitle: document.getElementById('hunt-form-title'),
            closeHuntForm: document.getElementById('close-hunt-form'),
            cancelHunt: document.getElementById('cancel-hunt'),
            huntRegionSelect: document.getElementById('hunt-region')
        };

        this.init();
    }

    async init() {
        try {
            this.attachEventListeners();
            await this.loadInitialData();
        } catch (error) {
            this.showError('Failed to initialize application');
        }
    }

    attachEventListeners() {
        //Action button events
        this.elements.addHuntBtn.addEventListener('click', () => this.openHuntForm());
        this.elements.addRegionBtn.addEventListener('click', () => this.openRegionForm());
        this.elements.viewRegionsBtn.addEventListener('click', () => this.viewRegions());

        //Filter events
        this.elements.statusFilter.addEventListener('change', () => this.applyFilters());
        this.elements.regionFilter.addEventListener('change', () => this.applyFilters());
        this.elements.priorityFilter.addEventListener('change', () => this.applyFilters());

        //Modal events
        this.elements.closeHuntForm.addEventListener('click', () => this.closeHuntForm());
        this.elements.cancelHunt.addEventListener('click', () => this.closeHuntForm());
        this.elements.huntForm.addEventListener('submit', (e) => this.handleHuntSubmit(e));

        //Modal background click to close
        this.elements.huntFormModal.addEventListener('click', (e) => {
            if (e.target === this.elements.huntFormModal) {
                this.closeHuntForm();
            }
        });
    }

    async loadInitialData() {
        this.setLoading(true);
        try {
            const [monsters, regions] = await Promise.all([
                MonsterAPI.getAllMonsters(),
                RegionAPI.getAllRegions()
            ]);

            this.state.monsters = monsters;
            this.state.regions = regions;
            this.state.filteredMonsters = monsters;

            this.populateRegionFilter();
            this.renderHunts();
            this.updateStats();
        } catch (error) {
            this.showError('Failed to load data');
        } finally {
            this.setLoading(false);
        }
    }

    renderHunts() {
        const container = this.elements.huntContainer;

        // Manual DOM maniplulation
        if (this.state.filteredMonsters.length === 0) {
            container.innerHTML = `
                <div class="no-hunts">
                    <p>No hunts found. Start your hunting adventure!</p>
                </div>
            `;
            return;
        }

        // Manually building HTML String
        const huntsHTML = this.state.filteredMonsters.map(monster => {
            const status = this.getHuntStatus(monster.id);
            const priorityEmoji = this.getPriorityEmoji(monster.element);
            const region = this.state.regions.find(r => r.id === monster.regionId);

            return `
                <div class="hunt-card" data-monster-id="${monster.id}">
                    <h3>${monster.monsterName}</h3>
                    <div class="hunt-detail">
                        <strong>Description:</strong> ${monster.monsterClass}
                    </div>
                    <div class="hunt-detail">
                        <strong>Priority:</strong> ${priorityEmoji} ${monster.element}
                    </div>
                    <div class="hunt-detail">
                        <strong>Location:</strong> ${region ? region.regionName : 'Unknown'}
                    </div>
                    <div class="hunt-detail">
                        <strong>Status:</strong>
                        <span class="status-${status}">${this.getStatusLabel(status)}</span>
                    </div>
                    <div class="hunt-actions">
                        <button class="btn btn-secondary" onclick="huntManager.toggleHuntStatus(${monster.id})">
                            ${status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
                        </button>
                        <button class="btn btn-info" onclick="huntManager.editHunt(${monster.id})">
                            Edit
                        </button>
                        <button class="btn btn-danger" onclick="huntManager.deleteHunt(${monster.id})">
                            Delete
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        //DOM Manipulation
        container.innerHTML = huntsHTML;
    }

    getHuntStatus(monsterId) {
        return this.state.huntStatuses.get(monsterId) || 'pending';
    }

    getStatusLabel(status) {
        const labels = {
            'pending': 'Pending',
            'in-progress': 'In Progress',
            'completed': 'Completed'
        };
        return labels[status] || '? Unknown';
    }

    getPriorityEmoji(element) {
    return '';
}

    toggleHuntStatus(monsterId) {
        const currentStatus = this.getHuntStatus(monsterId);
        const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';

        this.state.huntStatuses.set(monsterId, newStatus);
        this.renderHunts();
        this.updateStats();
    }

    setLoading(isLoading) {
        this.state.isLoading = isLoading;
        this.elements.loading.style.display = isLoading ? 'block' : 'none';
    }

    showError(message) {
        this.state.error = message;
        this.elements.errorMessage.textContent = message;
        this.elements.errorMessage.style.display = 'block';

        setTimeout(() => {
            this.elements.errorMessage.style.display = 'none';
        }, 5000);
    }

    //manual Stats cal
    updateStats() {
        const totalHunts = this.state.monsters.length;
        const completedHunts = this.state.monsters.filter(monster => this.getHuntStatus(monster.id) === 'completed').length;
        const pendingHunts = totalHunts - completedHunts;
        const totalRegions = this.state.regions.length;


        //Manual DOM updates for stats
        this.elements.totalHunts.textContent = totalHunts;
        this.elements.pendingHunts.textContent = pendingHunts;
        this.elements.completedHunts.textContent = completedHunts;
        this.elements.totalRegions.textContent = totalRegions;
    }

    //Manual filtering
    applyFilters() {
        const filters = {
            status: this.elements.statusFilter.value,
            region: this.elements.regionFilter.value,
            priority: this.elements.priorityFilter.value
        };

        this.state.filteredMonsters = this.state.monsters.filter(monster => {
            //Status filter
            if (filters.status) {
                const huntStatus = this.getHuntStatus(monster.id);
                if (huntStatus !== filters.status) return false;
            }

            if (filters.region && monster.regionId !== parseInt(filters.region)) {
                return false;
            }

            //Priority Filter (element)
            if (filters.priority && monster.element !== filters.priority) {
                return false;
            }

            return true;
        });

        this.renderHunts();
        this.updateStats();
    }
    //Populate dropdown options
    populateRegionFilter() {
        const regionSelect = this.elements.regionFilter;
        const huntRegionSelect = this.elements.huntRegionSelect;

        //Clear existing options
        regionSelect.innerHTML = '<option value="">All locations</option>';
        huntRegionSelect.innerHTML = '<option value="">Select Location</option>';

        //add Region options
        this.state.regions.forEach(region => {
            const option = `<option value="${region.id}">${region.regionName}</option>`;
            regionSelect.innerHTML += option;
            huntRegionSelect.innerHTML += option;
        });
    }

    //Manual form handling
    openHuntForm(monster = null) {
        this.state.editingMonster = monster;

        if (monster) {
            //edit
            this.elements.huntFormTitle.textContent = 'Edit Hunt';
            this.fillHuntForm(monster);
        } else {
            //create
            this.elements.huntFormTitle.textContent = 'Add New Hunt';
            this.clearHuntForm();
        }

        this.elements.huntFormModal.style.display = 'flex';
    }

    closeHuntForm() {
        this.elements.huntFormModal.style.display = 'none';
        this.state.editingMonster = null;
        this.clearHuntForm();
    }

    fillHuntForm(monster) {
        document.getElementById('monster-name').value = monster.monsterName;
        document.getElementById('monster-class').value = monster.monsterClass;
        document.getElementById('priority').value = monster.element;
        document.getElementById('hunt-region').value = monster.regionId;
    }

    clearHuntForm() {
        this.elements.huntForm.reset();
    }

    async handleHuntSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const huntData = {
            monsterName: formData.get('monsterName'),
            monsterClass: formData.get('monsterClass'),
            element: formData.get('element'),
            regionId: parseInt(formData.get('regionId'))
        };

        try {
            this.setLoading(true);

            if (this.state.editingMonster) {
                //Update exsiting hunt
                await MonsterAPI.updateMonster(this.state.editingMonster.id, huntData);
            } else {
                //Create New hunt
                await MonsterAPI.createMonster(huntData);
            }

            await this.loadInitialData();
            this.closeHuntForm();
        } catch (error) {
            this.showError('Failed to save hunt');
        } finally {
            this.setLoading(false);
        }


    }

    //Edit and delete
    editHunt(monsterId) {
        const monster = this.state.monsters.find(m => m.id === monsterId);
        if (monster) {
            this.openHuntForm(monster);
        }
    }

    async deleteHunt(monsterId) {
        if (!confirm('Are you sure you want to delete this hunt?')) {
            return;
        }

        try {
            this.setLoading(true);
            await MonsterAPI.deleteMonster(monsterId);
            await this.loadInitialData();
        } catch (error) {
            this.showError('Failed to delete hunt');
        } finally {
            this.setLoading(false);
        }
    }

    openRegionForm() {
        const regionName = prompt('Enter new hunting location name:');
        if (regionName && regionName.trim()) {
            this.createRegion(regionName.trim());
        }
    }

    async createRegion(regionName) {
        try {
            this.setLoading(true);
            await RegionAPI.createRegion({ regionName });
            await this.loadInitialData();
        } catch (error) {
            this.showError('Failed to create hunting location');
        } finally {
            this.setLoading(false);
        }
    }

    viewRegions() {
        if (this.state.regions.length === 0) {
            alert('No hunting locations found. Create some first!');
            return;
        }

        const regionList = this.state.regions
            .map(region => `• ${region.regionName}`)
            .join('\n');

        alert(`Hunting Locations:\n\n${regionList}`);
    }

       
}

 document.addEventListener('DOMContentLoaded', () => {
    window.huntManager = new HuntTaskManager();
})