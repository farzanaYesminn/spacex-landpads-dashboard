<script>
	import { onMount } from 'svelte';
	import Table from './components/Table.svelte';
	import Grid from './components/Grid.svelte';
	import Map from './components/Map.svelte';
	import DoughnutChart from './components/Chart.svelte';
	import { getLandingPads } from './services/spacexApi';

	let statusOptions = ['Active', 'Retired', 'Under Construction'];
	let isDropdownOpen = false;
	let landingPads = [];
	let view = 'table';
	let filter = '';
	let filteredPads = [];
	let successRates = [];

	function toggleDropdown() {
		isDropdownOpen = !isDropdownOpen;
	}

	onMount(async () => {
		try {
			landingPads = await getLandingPads();
			generateStatusOptions();
			updateFilteredPads();
			calculateSuccessRates();
		} catch (error) {
			console.error('Error fetching landing pads:', error);
		}
	});

	function generateStatusOptions() {
		const uniqueStatuses = new Set(landingPads.map((pad) => pad.status));
		statusOptions = Array.from(uniqueStatuses);
	}

	function updateFilteredPads() {
		filteredPads = filter ? landingPads.filter((pad) => pad.status === filter) : landingPads;
	}

	function calculateSuccessRates() {
		const totalLandings = landingPads.reduce((acc, pad) => acc + pad.attempted_landings, 0);
		const successfulLandings = landingPads.reduce((acc, pad) => acc + pad.successful_landings, 0);

		const successRate = totalLandings ? Math.round((successfulLandings / totalLandings) * 100) : 0;

		successRates = [
			{
				label: 'Successful Landings',
				value: successRate,
				color: 'green'
			},
			{
				label: 'Failed Landings',
				value: 100 - successRate,
				color: 'red'
			}
		];
	}
	$: filter, updateFilteredPads();
</script>

<div class="flex justify-center items-center h-16 bg-gray-100 shadow-md">
	<img class="w-48 md:w-64 lg:w-80" src="src/routes/images/spaceX_logo.svg" alt="SpaceX" />
</div>

<div class="bodyContainer inter">
	{#if view === 'table'}
		<!-- Table -->
		<div class="flex">
			<div class="flex flex-col">
				<div class="controls">
					<button aria-label="Toggle View" class="flex gap-5">
						<svg
							class="w-8 h-8 text-gray-800 hover:text-[#1C64F2] cursor-pointer"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							on:click={() => (view = 'table')}
						>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-width="2"
								d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"
							/>
						</svg>

						<svg
							class="w-7 h-7 pt-1 text-gray-800 hover:text-[#1C64F2] cursor-pointer"
							aria-hidden="true"
							fill="currentColor"
							viewBox="0 0 24 24"
							on:click={() => (view = 'grid')}
						>
							<path
								fill-rule="evenodd"
								d="M4.857 3A1.857 1.857 0 0 0 3 4.857v4.286C3 10.169 3.831 11 4.857 11h4.286A1.857 1.857 0 0 0 11 9.143V4.857A1.857 1.857 0 0 0 9.143 3H4.857Zm10 0A1.857 1.857 0 0 0 13 4.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 9.143V4.857A1.857 1.857 0 0 0 19.143 3h-4.286Zm-10 10A1.857 1.857 0 0 0 3 14.857v4.286C3 20.169 3.831 21 4.857 21h4.286A1.857 1.857 0 0 0 11 19.143v-4.286A1.857 1.857 0 0 0 9.143 13H4.857Zm10 0A1.857 1.857 0 0 0 13 14.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 19.143v-4.286A1.857 1.857 0 0 0 19.143 13h-4.286Z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>

					<div class="flex">
						<svg
							class="w-8 h-8 text-gray-800 pt-2"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								d="M5 13.17a3.001 3.001 0 0 0 0 5.66V20a1 1 0 1 0 2 0v-1.17a3.001 3.001 0 0 0 0-5.66V4a1 1 0 0 0-2 0v9.17ZM11 20v-9.17a3.001 3.001 0 0 1 0-5.66V4a1 1 0 1 1 2 0v1.17a3.001 3.001 0 0 1 0 5.66V20a1 1 0 1 1-2 0Zm6-1.17V20a1 1 0 1 0 2 0v-1.17a3.001 3.001 0 0 0 0-5.66V4a1 1 0 1 0-2 0v9.17a3.001 3.001 0 0 0 0 5.66Z"
							/>
						</svg>

						<div class="dropdown">
							<div class="flex items-center gap-2">
								<select
									id="filter"
									bind:value={filter}
									on:focus={() => (isDropdownOpen = true)}
									on:blur={() => (isDropdownOpen = false)}
									class="appearance-none bg-transparent w-full border border-gray-300 rounded px-4 py-2"
									style="background-image: none;"
								>
									<option value="">Filter by Status</option>
									{#each statusOptions as status}
										<option value={status}>{status}</option>
									{/each}
								</select>

								<svg
									class="w-6 h-6 text-gray-800 cursor-pointer"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									on:click={toggleDropdown}
								>
									{#if isDropdownOpen}
										<path
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M5 15l7-7 7 7"
										/>
									{:else}
										<path
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 9l-7 7-7-7"
										/>
									{/if}
								</svg>
							</div>
						</div>
					</div>
				</div>
				<Table {filter} />
			</div>
			<div>
				<div class="flex flex-col gap-10 px-[75px]">
					<div>
						<h2 class="pb-5 font-semibold text-[16px] inter">Map View</h2>
						<Map class="h-[350px] w-[5550px]" />
					</div>

					<div>
						<h2 class="py-5 font-semibold text-[16px] inter">Success Rate Chart</h2>
						<DoughnutChart />
					</div>
				</div>
			</div>

			{#if filteredPads.length === 0}
				<p>No landing pads available for this status.</p>
			{/if}
		</div>
	{:else}
		<!-- grid -->
		<div class="flex">
			<div class="flex flex-col">
				<div class="controls">
					<button aria-label="Toggle View" class="flex gap-5">
						<svg
							class="w-8 h-8 text-gray-800 cursor-pointer"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							on:click={() => (view = 'table')}
						>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-width="2"
								d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"
							/>
						</svg>
						<svg
							class="w-7 h-7 pt-1 text-gray-800 cursor-pointer"
							aria-hidden="true"
							fill="currentColor"
							viewBox="0 0 24 24"
							on:click={() => (view = 'grid')}
						>
							<path
								fill-rule="evenodd"
								d="M4.857 3A1.857 1.857 0 0 0 3 4.857v4.286C3 10.169 3.831 11 4.857 11h4.286A1.857 1.857 0 0 0 11 9.143V4.857A1.857 1.857 0 0 0 9.143 3H4.857Zm10 0A1.857 1.857 0 0 0 13 4.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 9.143V4.857A1.857 1.857 0 0 0 19.143 3h-4.286Zm-10 10A1.857 1.857 0 0 0 3 14.857v4.286C3 20.169 3.831 21 4.857 21h4.286A1.857 1.857 0 0 0 11 19.143v-4.286A1.857 1.857 0 0 0 9.143 13H4.857Zm10 0A1.857 1.857 0 0 0 13 14.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 19.143v-4.286A1.857 1.857 0 0 0 19.143 13h-4.286Z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>

					<div class="flex">
						<svg
							class="w-8 h-8 text-gray-800 pt-2"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								d="M5 13.17a3.001 3.001 0 0 0 0 5.66V20a1 1 0 1 0 2 0v-1.17a3.001 3.001 0 0 0 0-5.66V4a1 1 0 0 0-2 0v9.17ZM11 20v-9.17a3.001 3.001 0 0 1 0-5.66V4a1 1 0 1 1 2 0v1.17a3.001 3.001 0 0 1 0 5.66V20a1 1 0 1 1-2 0Zm6-1.17V20a1 1 0 1 0 2 0v-1.17a3.001 3.001 0 0 0 0-5.66V4a1 1 0 1 0-2 0v9.17a3.001 3.001 0 0 0 0 5.66Z"
							/>
						</svg>

						<div class="dropdown">
							<div class="flex items-center gap-2">
								<select
									id="filter"
									bind:value={filter}
									on:focus={() => (isDropdownOpen = true)}
									on:blur={() => (isDropdownOpen = false)}
									class="appearance-none bg-transparent w-full border border-gray-300 rounded px-4 py-2"
									style="background-image: none;"
								>
									<option value="">Filter by Status</option>
									{#each statusOptions as status}
										<option value={status}>{status}</option>
									{/each}
								</select>

								<svg
									class="w-6 h-6 text-gray-800 cursor-pointer"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									on:click={toggleDropdown}
								>
									{#if isDropdownOpen}
										<path
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M5 15l7-7 7 7"
										/>
									{:else}
										<path
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 9l-7 7-7-7"
										/>
									{/if}
								</svg>
							</div>
						</div>
					</div>
				</div>
				<Grid {filter} />
			</div>
			<div>
				<div class="flex flex-col gap-10 px-[75px]">
					<div>
						<h2 class="pb-5 font-semibold text-[16px] inter">Map View</h2>
						<Map class="h-[350px] w-[5550px]" />
					</div>

					<div>
						<h2 class="py-5 font-semibold text-[16px] inter">Success Rate Chart</h2>
						<DoughnutChart />
					</div>
				</div>
			</div>

			{#if filteredPads.length === 0}
				<p>No landing pads available for this status.</p>
			{/if}
		</div>
	{/if}
</div>

<style>
	.bodyContainer {
		margin: 2rem auto;
		padding: 0 1rem;
		width: 1920px;
	}
	.controls {
		display: flex;
		justify-content: space-between;
		padding: 0 1rem;
		margin-bottom: 44px;
	}

	select {
		border: none;
		outline: none;
		appearance: none;
	}
</style>
