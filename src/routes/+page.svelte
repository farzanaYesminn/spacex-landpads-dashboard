<script>
    import { onMount } from 'svelte';
    import Table from './components/Table.svelte';
    import Grid from './components/Grid.svelte';
    import Map from './components/Map.svelte';
    import DoughnutChart from './components/Chart.svelte';
    import { getLandingPads } from './services/spacexApi';

    let landingPads = []; 
    let view = 'table'; 
    let filter = '';
    let filteredPads = []; 
    let successRates = []; 
    let statusOptions = [];

    onMount(async () => {
        try {
            landingPads = await getLandingPads();
            generateStatusOptions();
            updateFilteredPads();  // Initialize the filtered pads when component mounts
            calculateSuccessRates();
        } catch (error) {
            console.error('Error fetching landing pads:', error);
        }
    });

    function generateStatusOptions() {
        const uniqueStatuses = new Set(landingPads.map(pad => pad.status));
        statusOptions = Array.from(uniqueStatuses);
    }

    function updateFilteredPads() {
    filteredPads = filter
        ? landingPads.filter(pad => pad.status === filter)
        : landingPads;
    console.log(filteredPads); // Log to check if the filter is applied correctly
}

    function calculateSuccessRates() {
        const totalLandings = landingPads.reduce(
            (acc, pad) => acc + pad.attempted_landings,
            0
        );
        const successfulLandings = landingPads.reduce(
            (acc, pad) => acc + pad.successful_landings,
            0
        );

        const successRate = totalLandings ? Math.round(
            (successfulLandings / totalLandings) * 100
        ) : 0;

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

    // This reactive statement ensures that filteredPads is updated whenever `filter` changes
    $: filter, updateFilteredPads();
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
    <div class="controls">
        <div>
            <label for="filter">Filter by Status:</label>
            <select id="filter" bind:value={filter}>
                <option value="">Select an Option</option>
                {#each statusOptions as status}
                    <option value={status}>{status}</option>
                {/each}
            </select>
        </div>
        <button on:click={() => (view = view === 'table' ? 'grid' : 'table')}>
            Switch to {view === 'table' ? 'Grid View' : 'Table View'}
        </button>
    </div>

    {#if view === 'table'}
        <Table {filter} />
    {:else}
        <Grid {filteredPads} />
    {/if}

    <h2>Landing Pad Map</h2>
    <Map {filteredPads} />

    <h2>Landing Pad Success Rate</h2>
    <DoughnutChart {successRates} />

    {#if filteredPads.length === 0}
        <p>No landing pads available for this status.</p>
    {/if}
</div>
