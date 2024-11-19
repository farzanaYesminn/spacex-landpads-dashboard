<script>
	import { onMount } from 'svelte';
	import { getLandingPads } from '../services/spacexApi';
	import Map from 'ol/Map';
	import View from 'ol/View';
	import TileLayer from 'ol/layer/Tile';
	import OSM from 'ol/source/OSM';
	import Feature from 'ol/Feature';
	import Point from 'ol/geom/Point';
	import { fromLonLat } from 'ol/proj';
	import { Icon, Style } from 'ol/style';
	import VectorLayer from 'ol/layer/Vector';
	import VectorSource from 'ol/source/Vector';

	let landingPads = [];

	onMount(async () => {
		try {
			landingPads = await getLandingPads();
			initializeMap();
		} catch (error) {
			console.error('Error fetching landing pads:', error);
		}
	});

	const initializeMap = () => {
		const map = new Map({
			target: 'map',
			layers: [
				new TileLayer({
					source: new OSM({
						attributions: []
					})
				})
			],
			controls: [],
			view: new View({
				center: fromLonLat([-80, 28]),
				zoom: 2
			})
		});

		const createStyle = (status) => {
			let iconColor;
			switch (status) {
				case 'active':
					iconColor = 'green';
					break;
				case 'retired':
					iconColor = 'red';
					break;
				case 'under construction':
					iconColor = 'orange';
					break;
				default:
					iconColor = 'gray';
			}

			return new Style({
				image: new Icon({
					src:
						'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30"><circle cx="15" cy="15" r="10" fill="' +
						iconColor +
						'"/></svg>',
					scale: 0.5
				})
			});
		};

		const features = landingPads.map((pad) => {
			const marker = new Feature({
				geometry: new Point(fromLonLat([pad.location.longitude, pad.location.latitude]))
			});
			marker.setStyle(createStyle(pad.status));
			return marker;
		});

		const vectorLayer = new VectorLayer({
			source: new VectorSource({
				features: features
			})
		});
		map.addLayer(vectorLayer);
	};
</script>

<div id="map"></div>

<style>
	#map {
		height: 350px;
		width: 550px;
	}
</style>
