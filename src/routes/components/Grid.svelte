<script>
                    import { onMount } from 'svelte';
                    import { getLandingPads } from '../services/spacexAPI.js'; // Adjust the path to where your spacexAPI.js file is located
                  
                    let landingPads = [];
                  
                    onMount(async () => {
                      try {
                        landingPads = await getLandingPads();
                      } catch (error) {
                        console.error("Error fetching landing pads:", error);
                      }
                    });
                  </script>
                  
                  <style>
                    .grid-container {
                      display: grid;
                      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                      gap: 1rem;
                    }
                    .card {
                      border: 1px solid #ddd;
                      border-radius: 8px;
                      padding: 1rem;
                      background-color: #fff;
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                      transition: transform 0.2s, box-shadow 0.2s;
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
                  </style>
                  
                  <div class="grid-container">
                    {#if landingPads.length === 0}
                      <p>Loading or no data available...</p>
                    {:else}
                      {#each landingPads as pad}
                        <div class="card">
                          <!-- Landing Pad Name -->
                          <div class="card-title">{pad.full_name}</div>
                          
                          <!-- Region -->
                          <div class="card-info">Region: {pad.location.region}</div>
                          
                          <!-- Successful Landings -->
                          <div class="card-info">
                            Successful Landings: {pad.successful_landings}
                          </div>
                          
                          <!-- Attempted Landings -->
                          <div class="card-info">
                            Attempted Landings: {pad.attempted_landings}
                          </div>
                          
                          <!-- Status -->
                          <div class="status {pad.status}">
                            Status: {pad.status}
                          </div>
                        </div>
                      {/each}
                    {/if}
                  </div>
                  