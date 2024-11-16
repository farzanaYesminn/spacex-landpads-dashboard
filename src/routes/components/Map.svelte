<script>
                    import { onMount } from 'svelte';
                    import Map from 'ol/Map';
                    import View from 'ol/View';
                    import TileLayer from 'ol/layer/Tile';
                    import OSM from 'ol/source/OSM';
                    import Feature from 'ol/Feature';
                    import Point from 'ol/geom/Point';
                    import { fromLonLat } from 'ol/proj';
                
                    export let landingPads = [];
                
                    onMount(() => {
                        const map = new Map({
                            target: 'map',
                            layers: [
                                new TileLayer({
                                    source: new OSM(),
                                }),
                            ],
                            view: new View({
                                center: fromLonLat([0, 0]),
                                zoom: 2,
                            }),
                        });
                
                        landingPads.forEach(pad => {
                            const marker = new Feature({
                                geometry: new Point(fromLonLat([pad.location.longitude, pad.location.latitude])),
                            });
                
                            // Add styles for active/inactive pads
                        });
                    });
                </script>
                