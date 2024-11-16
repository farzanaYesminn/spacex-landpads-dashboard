<script>
                    import { onMount } from 'svelte';
                    import { getLandingPads } from '../services/spacexAPI';
                    
                    export let filter = ''; // The filter is passed as a prop from parent
                    let landingPads = [];
                    let filteredPads = [];
                
                    // Fetch landing pads data on mount
                    onMount(async () => {
                        try {
                            landingPads = await getLandingPads();
                            updateFilteredPads();
                        } catch (error) {
                            console.error('Error fetching landing pads:', error);
                        }
                    });
                
                    // Watch for changes in the `filter` and update filteredPads
                    $: filter, updateFilteredPads();
                
                    function updateFilteredPads() {
                        filteredPads = filter
                            ? landingPads.filter(pad => pad.status === filter)
                            : landingPads;
                    }
                </script>
                
                <table class="min-w-full table-auto border-collapse">
                    <thead class="bg-gray-800 text-white">
                        <tr>
                            <th class="px-4 py-2 text-left">Name</th>
                            <th class="px-4 py-2 text-left">Status</th>
                            <th class="px-4 py-2 text-left">Region</th>
                            <th class="px-4 py-2 text-left">Successful Landings</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white">
                        {#each filteredPads as pad}
                            <tr class="border-b hover:bg-gray-100">
                                <td class="px-4 py-2">{pad.full_name}</td>
                                <td class="px-4 py-2">{pad.status}</td>
                                <td class="px-4 py-2">{pad.location.region}</td>
                                <td class="px-4 py-2">{pad.successful_landings}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
                