<template>
	<div id="jitsi__con" class="w-full h-full"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router';

let route = useRoute();
let meet_id = route.params.meetid;


onMounted(() => {

	// let domain = "meet.jit.si";
	// let domain = "meet.localhost:8443";
	// let domain = "legion.tailaadcc.ts.net:8443";

	let domain = "raxen-meet.duckdns.org";
	let options = {
		roomName: meet_id,
		// parentNode: document.querySelector("#jitsi__con"),
		height: 100,
		parentNode: document.querySelector("#jitsi__con"),
		configOverwrite: {},
		interfaceConfigOverwrite: {}
	}

	let api = new JitsiMeetExternalAPI(domain, options);

	const user = inject('$user');
	console.log("user: ", user);
	api.executeCommand('displayName', user);

})


</script>

<style>
html, body, #app, iframe {
  min-height: 100svh;
}
</style>
