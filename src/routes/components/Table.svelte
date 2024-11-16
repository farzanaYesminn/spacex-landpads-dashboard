<script>
                    import { onMount } from 'svelte';
                    import { getLandingPads } from '../services/spacexAPI';
                    
                    export let landingPads = [];
                    
                    onMount(async () => {
                      landingPads = await getLandingPads();
                    });
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
                      {#each landingPads as pad}
                        <tr class="border-b hover:bg-gray-100">
                          <td class="px-4 py-2">{pad.full_name}</td>
                          <td class="px-4 py-2">{pad.status}</td>
                          <td class="px-4 py-2">{pad.location.region}</td>
                          <td class="px-4 py-2">{pad.successful_landings}</td>
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                  