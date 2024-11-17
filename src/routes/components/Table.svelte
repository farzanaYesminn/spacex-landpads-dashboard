<script>
    import { onMount } from 'svelte';
    import { getLandingPads } from '../services/spacexAPI';
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
    import { Button, Modal } from 'flowbite-svelte';
  
    let defaultModal = false;
    let selectedPad = null; // Variable to store the clicked pad
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
      filteredPads = filter ? landingPads.filter((pad) => pad.status === filter) : landingPads;
    }
  
    // Function to get the status class based on status value
    function getStatusClass(status) {
      switch (status.toLowerCase()) {
        case 'active':
          return 'text-green-800'; // Green for active
        case 'retired':
          return 'text-red-800'; // Red for retired
        case 'under construction':
          return 'text-blue-800 '; // Blue for under construction
        default:
          return 'bg-gray-300 text-black';
      }
    }
  
    // Function to check if the progress should show or not
    function hasProgress(successfulLandings, attemptedLandings) {
      return attemptedLandings > 0; // Return true if there's progress
    }
  
    // Function to open the modal and show selected pad details
    function openModal(pad) {
      selectedPad = pad;
      defaultModal = true; // Open the modal
    }
  
    // Function to close the modal
    function closeModal() {
      defaultModal = false; // Close the modal
      selectedPad = null; // Clear selected pad
    }
  </script>
  
  <Table >
    <TableHead>
      <TableHeadCell>Full Name</TableHeadCell>
      <TableHeadCell>Location Name</TableHeadCell>
      <TableHeadCell>Region</TableHeadCell>
      <TableHeadCell>Details</TableHeadCell>
      <TableHeadCell>Success Rate</TableHeadCell>
      <TableHeadCell>WikiPedia Link</TableHeadCell>
      <TableHeadCell>Status</TableHeadCell>
    </TableHead>
    <TableBody tableBodyClass="divide-y">
      {#each filteredPads as pad}
        <TableBodyRow>
          <TableBodyCell>{pad.full_name}</TableBodyCell>
          <TableBodyCell>{pad.location.name}</TableBodyCell>
          <TableBodyCell class="text-gray-800">{pad.location.region}</TableBodyCell>
          <TableBodyCell>
            <Button on:click={() => openModal(pad)} class="text-gray-800">View Details</Button> <!-- Open modal on button click -->
          </TableBodyCell>
          <TableBodyCell>
            {#if hasProgress(pad.successful_landings, pad.attempted_landings)}
              <div class="relative w-full bg-gray-300 rounded-full h-3">
                <div
                  class=" h-3 rounded-full bg-green-400"
                  style="width: {Math.round((pad.successful_landings / pad.attempted_landings) * 100)}%"
                ></div>
              </div>
              <span class="w-full text-xs text-center text-gray-500 leading-4">
                {Math.round((pad.successful_landings / pad.attempted_landings) * 100)}%
              </span>
            {:else}
              <span class="text-gray-500">N/A</span>
            {/if}
          </TableBodyCell>
          <TableBodyCell>
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <a href="{pad.wikipedia}" target="_blank" >
              <svg class="w-6 h-6 text-blue-600 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961"/>
              </svg>
            </a>
          </TableBodyCell>
          
          <TableBodyCell class={getStatusClass(pad.status)}>{pad.status}</TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
  
  <!-- Modal for Viewing Details -->
  {#if defaultModal && selectedPad}
    <Modal title="Details - {selectedPad.full_name}" bind:open={defaultModal} autoclose class="text-gray-900" >
      <p class="text-gray-500">{selectedPad.details}</p>
    </Modal>
  {/if}
  