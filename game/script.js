// Access Camera Feed
const cameraFeed = document.getElementById("camera-feed");

// Function to start the camera
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraFeed.srcObject = stream;
    } catch (err) {
        alert("Camera access is required to play this game.");
        console.error(err);
    }
}

// Call the camera start function
startCamera();

// Geolocation Setup
let userLatitude = 0;
let userLongitude = 0;
const collectible = document.getElementById("collectible-item");

// Get the user's current location
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (position) => {
                userLatitude = position.coords.latitude;
                userLongitude = position.coords.longitude;

                // Update location info on screen
                document.getElementById("latitude").textContent = userLatitude.toFixed(6);
                document.getElementById("longitude").textContent = userLongitude.toFixed(6);

                // Check proximity to collectible
                checkProximity();
            },
            (error) => {
                alert("Location access is required to play this game.");
                console.error(error);
            },
            { enableHighAccuracy: true }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Place the collectible at a random location
let collectibleLatitude = 0;
let collectibleLongitude = 0;

function placeCollectible() {
    // Generate a random position within ~100 meters of user's location
    const offset = 0.0009; // Roughly ~100 meters in latitude/longitude
    collectibleLatitude = userLatitude + (Math.random() * offset - offset / 2);
    collectibleLongitude = userLongitude + (Math.random() * offset - offset / 2);

    console.log(`Collectible placed at: ${collectibleLatitude}, ${collectibleLongitude}`);
}

// Check if the user is close enough to the collectible
function checkProximity() {
    const distance = getDistanceFromLatLonInMeters(
        userLatitude,
        userLongitude,
        collectibleLatitude,
        collectibleLongitude
    );

    console.log(`Distance to collectible: ${distance} meters`);

    // If within 10 meters, score and relocate the collectible
    if (distance < 10) {
        score++;
        document.getElementById("score").textContent = score;
        placeCollectible();
    }
}

// Calculate distance between two coordinates (Haversine Formula)
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Radius of Earth in meters
    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function degToRad(deg) {
    return deg * (Math.PI / 180);
}

// Initial Placement and Start Location Tracking
let score = 0;
placeCollectible();
getUserLocation();
