let map;
let userMarker;
let placeMarker;
let directionsService;
let directionsRenderer;

function testMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: { lat: 23.223, lng: 72.65 }, // Default center (e.g., Gandhinagar)
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({ map: map });
}

function searchPlace() {
  const searchInput = document.getElementById("searchInput").value;
  if (!searchInput) {
    alert("Please enter a destination.");
    return;
  }

  // Step 1: Get user's current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // Add/Update user marker
        if (userMarker) userMarker.setMap(null);
        userMarker = new google.maps.Marker({
          position: userLocation,
          map: map,
          label: "You",
        });

        // Step 2: Geocode destination
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: searchInput }, (results, status) => {
          if (status === "OK") {
            const destination = results[0].geometry.location;

            // Add/Update destination marker
            if (placeMarker) placeMarker.setMap(null);
            placeMarker = new google.maps.Marker({
              position: destination,
              map: map,
              label: "Dest",
            });

            // Step 3: Draw route & show distance
            directionsService.route(
              {
                origin: userLocation,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING,
              },
              (response, status) => {
                if (status === "OK") {
                  directionsRenderer.setDirections(response);
                  const leg = response.routes[0].legs[0];
                  document.getElementById("distanceInfo").textContent =
                  `Distance: ${leg.distance.text} | Estimated Time: ${leg.duration.text};`
                } else {
                  alert("Failed to get directions: " + status);
                }
              }
            );
          } else {
            alert("Could not find destination: " + status);
          }
        });
      },
      (err) => {
        alert("Error getting your location: " + err.message);
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
}
}
