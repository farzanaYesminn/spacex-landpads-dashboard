<script>
                    import { onMount } from 'svelte';
                    import Table from './components/Table.svelte';
                    import Grid from './components/Grid.svelte';
                    import Map from './components/Map.svelte';
                    import DoughnutChart from './components/Chart.svelte'; // Replace with your actual chart component if needed
                    import { getLandingPads } from './services/spacexApi';
                
                    let landingPads = []; // Array to store data from the API
                    let view = 'table'; // Default view: 'table' or 'grid'
                    let filter = 'all'; // Default filter: 'all', 'active', or 'inactive'
                
                    let filteredPads = []; // Filtered landing pad data
                    let successRates = []; // Success rates for doughnut chart
                
                    // Fetch data from API when the page loads
                    onMount(async () => {
                        try {
                            landingPads = await getLandingPads();
                            updateFilteredPads();
                            calculateSuccessRates();
                        } catch (error) {
                            console.error('Error fetching landing pads:', error);
                        }
                    });
                
                    // Filter landing pads based on selected status
                    function updateFilteredPads() {
                        if (filter === 'all') {
                            filteredPads = landingPads;
                        } else {
                            filteredPads = landingPads.filter(pad => pad.status === filter);
                        }
                    }
                
                    // Calculate success rates for the doughnut chart
                    function calculateSuccessRates() {
                        const totalLandings = landingPads.reduce(
                            (acc, pad) => acc + pad.attempted_landings,
                            0
                        );
                        const successfulLandings = landingPads.reduce(
                            (acc, pad) => acc + pad.successful_landings,
                            0
                        );
                
                        const successRate = Math.round(
                            (successfulLandings / totalLandings) * 100
                        );
                
                        successRates = [
                            {
                                label: 'Successful Landings',
                                value: successRate,
                                color: 'green',
                            },
                            {
                                label: 'Failed Landings',
                                value: 100 - successRate,
                                color: 'red',
                            },
                        ];
                    }
                
                    // Update filteredPads whenever the filter value changes
                    $: updateFilteredPads();
                </script>
                
                <style>
                    .container {
                        margin: 2rem auto;
                        max-width: 1200px;
                        padding: 0 1rem;
                    }
                    .controls {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 1rem;
                    }
                </style>
                
                <div class="container">
                    <!-- Controls for filtering and view toggling -->
                    <div class="controls">
                        <div>
                            <label for="filter">Filter by Status:</label>
                            <select id="filter" bind:value={filter}>
                                <option value="all">All</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <button on:click={() => (view = view === 'table' ? 'grid' : 'table')}>
                            Switch to {view === 'table' ? 'Grid View' : 'Table View'}
                        </button>
                    </div>
                
                    <!-- Table/Grid View -->
                    {#if view === 'table'}
                        <Table {filteredPads} />
                    {:else}
                        <Grid {filteredPads} />
                    {/if}
                
                    <!-- Map -->
                    <h2>Landing Pad Map</h2>
                    <Map {filteredPads} />
                
                    <!-- Doughnut Chart -->
                    <h2>Landing Pad Success Rate</h2>
                    <DoughnutChart {successRates} />
                </div>
                