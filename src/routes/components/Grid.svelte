<script>
	import { onMount } from 'svelte';
	import { getLandingPads } from '../services/spacexAPI.js';

	export let filter = '';
	let landingPads = [];
	let filteredPads = [];

	onMount(async () => {
		try {
			landingPads = await getLandingPads();
			updateFilteredPads();
		} catch (error) {
			console.error('Error fetching landing pads:', error);
		}
	});

	$: filter, updateFilteredPads();

	function updateFilteredPads() {
		filteredPads = filter ? landingPads.filter((pad) => pad.status === filter) : landingPads;
	}
</script>

<div class="grid-container inter">
	{#if filteredPads.length === 0}
		<p>Loading or no data available...</p>
	{:else}
		{#each filteredPads as pad}
			<div class="card">
				<div class="card-title">{pad.full_name}</div>
				<div class="card-info">Region: {pad.location.region}</div>
				<div class="card-info">Successful Landings: {pad.successful_landings}</div>
				<div class="card-info">Attempted Landings: {pad.attempted_landings}</div>
				<div class="status {pad.status}">Status: {pad.status}</div>
			</div>
		{/each}
	{/if}
</div>

<style>
	
	.grid-container {
		display: grid;
		grid-template-columns: repeat(3, 1fr); 
		gap: 1rem;
		padding: 1rem;
	}

	
	.card {
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 1rem;
		background-color: #fff;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}
	.card:hover {
		transform: scale(1.02);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}
	.card-title {
		font-size: 1.2rem;
		font-weight: bold;
		margin-bottom: 0.5rem;
	}
	.card-info {
		font-size: 0.9rem;
		color: #555;
	}
	.status {
		font-weight: bold;
		text-transform: capitalize;
		margin-top: 0.5rem;
	}
	.status.active {
		color: green;
	}
	.status.inactive {
		color: red;
	}

	@media (max-width: 768px) {
		.grid-container {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 480px) {
		.grid-container {
			grid-template-columns: 1fr; 
		}
	}
</style>
