<script>
                    import { onMount } from 'svelte';
                    import { Chart } from 'flowbite-svelte';
                    import { getLandingPads } from '../services/spacexApi';
                  
                    let options = {
                      series: [],
                      colors: ['#7F9CF5', '#9F7AEA', '#63B3ED', '#48BB78', '#E53E3E'],
                      chart: {
                        height: 320,
                        type: 'donut',
                      },
                      labels: [],
                      legend: {
                        show: false,
                      },
                      plotOptions: {
                        pie: {
                          donut: {
                            size: '75%',
                            labels: {
                              show: true,
                              total: {
                                show: true,
                                showAlways: true,
                                label: 'Landing Pads',
                                fontSize: '18px',
                                color: '#4a5568',
                                formatter: function (w) {
                                  return w.globals.seriesTotals.length;
                                },
                              },
                            },
                          },
                        },
                      },
                      dataLabels: {
                        enabled: false,
                      },
                    };
                  
                    let isLoading = true;
                    let error = null;
                  
                    onMount(async () => {
                      try {
                        const landingPads = await getLandingPads();
                  
                        if (!landingPads || landingPads.length === 0) {
                          throw new Error('No data available');
                        }
                  
                        const labels = [];
                        const series = [];
                  
                        landingPads.forEach((pad) => {
                          labels.push(pad.full_name);
                          const successRate =
                            pad.attempted_landings > 0
                              ? Math.round((pad.successful_landings / pad.attempted_landings) * 100)
                              : 0;
                          series.push(successRate);
                        });
                  
                        options = { ...options, labels, series };
                      } catch (err) {
                        console.error('Error loading data for the chart:', err);
                        error = err.message || 'Failed to load data';
                      } finally {
                        isLoading = false;
                      }
                    });
                  </script>
                  
                  {#if isLoading}
                    <div class="text-center py-6">Loading chart data...</div>
                  {:else if error}
                    <div class="text-center text-red-600 py-6">Error: {error}</div>
                  {:else}
                    <Chart {options} class="py-6" />
                  {/if}
                  
                  <style>
                    :global(.apexcharts-datalabels) {
                      pointer-events: none;
                    }
                  
                    :global(.apexcharts-donut-label) {
                      font-weight: bold;
                      font-size: 24px;
                      color: #2d3748;
                      text-align: center;
                    }
                  
                    :global(.apexcharts-donut-label + .apexcharts-donut-text-label) {
                      margin-top: 4px;
                      font-size: 14px;
                      color: #4a5568;
                      font-weight: normal;
                    }
                  </style>
                  