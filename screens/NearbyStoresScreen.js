import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';

// Sample grocery store data (as we can't use Places API directly from the client)
const sampleGroceryStores = [
  {
    id: '1',
    name: 'Whole Foods Market',
    vicinity: '123 Main St',
    latitude: 0, 
    longitude: 0, 
    rating: 4.5,
    distance: 0.3,
  },
  {
    id: '2',
    name: 'Trader Joe\'s',
    vicinity: '456 Oak Avenue',
    latitude: 0,
    longitude: 0,
    rating: 4.7,
    distance: 0.5,
  },
  {
    id: '3',
    name: 'Safeway',
    vicinity: '789 Pine Street',
    latitude: 0,
    longitude: 0,
    rating: 4.0,
    distance: 0.8,
  },
  {
    id: '4',
    name: 'Kroger',
    vicinity: '101 Cedar Road',
    latitude: 0,
    longitude: 0,
    rating: 4.2,
    distance: 1.1,
  },
  {
    id: '5',
    name: 'Aldi',
    vicinity: '202 Maple Drive',
    latitude: 0,
    longitude: 0,
    rating: 4.1,
    distance: 1.4,
  },
];

export default function NearbyStoresScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        // Request location permissions
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setLoading(false);
          return;
        }

        // Get current location
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        
        // Generate nearby store coordinates based on the user's location
        const nearbyStores = generateNearbyStores(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude
        );
        
        setStores(nearbyStores);
        setLoading(false);
      } catch (error) {
        console.error('Error setting up location:', error);
        setErrorMsg('Error accessing your location');
        setLoading(false);
      }
    })();
  }, []);

  const generateNearbyStores = (userLat, userLng) => {
    // Create stores around the user's location
    return sampleGroceryStores.map((store, index) => {
      // Create variation in location to spread stores around the user
      // Using different offsets for each store to create distribution
      const latOffset = (Math.random() * 0.01) * (index % 2 === 0 ? 1 : -1);
      const lngOffset = (Math.random() * 0.01) * (index % 3 === 0 ? 1 : -1);
      
      return {
        ...store,
        latitude: userLat + latOffset,
        longitude: userLng + lngOffset,
      };
    });
  };

  const handleStorePress = (store) => {
    setSelectedStore(store);
    // Additional actions when store is selected
  };

  const getDirections = (store) => {
    Alert.alert(
      "Get Directions",
      `Directions to ${store.name} (${store.distance} miles away)`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Open Maps", 
          onPress: () => {
            // This would typically open the device's map app with directions
            Alert.alert("Would open maps app with directions to this store");
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#89387b" />
        <Text style={styles.loadingText}>Finding nearby grocery stores...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {location ? (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0222,
              longitudeDelta: 0.0121,
            }}
          >
            {/* User's location */}
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="You are here"
              pinColor="#89387b"
            />
            
            {/* Nearby grocery stores */}
            {stores.map(store => (
              <Marker
                key={store.id}
                coordinate={{
                  latitude: store.latitude,
                  longitude: store.longitude,
                }}
                title={store.name}
                description={`${store.vicinity}${store.rating ? ` • Rating: ${store.rating}` : ''}`}
              />
            ))}
          </MapView>
          
          {stores.length > 0 && (
            <View style={styles.storeCountContainer}>
              <Text style={styles.storeCount}>
                Found {stores.length} grocery stores nearby
              </Text>
            </View>
          )}
        </>
      ) : (
        <Text style={styles.text}>Waiting for location...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  storeCountContainer: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 20,
  },
  storeCount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
