import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, TextInput, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const INVENTORY_DIR = FileSystem.documentDirectory + 'inventory/';
const IMAGE_DIR = INVENTORY_DIR + 'images/';
const INVENTORY_FILE = INVENTORY_DIR + 'inventory.json';

export default function TrackInventoryScreen() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera roll permission is needed!');
      }
      await loadInventory();
    })();
  }, []);

  const ensureDirExists = async (dir) => {
    const dirInfo = await FileSystem.getInfoAsync(dir);
    if (!dirInfo.exists) await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  };

  const loadInventory = async () => {
    try {
      await ensureDirExists(INVENTORY_DIR);
      const fileInfo = await FileSystem.getInfoAsync(INVENTORY_FILE);
      if (fileInfo.exists) {
        const content = await FileSystem.readAsStringAsync(INVENTORY_FILE);
        setInventoryItems(JSON.parse(content));
      }
    } catch (error) {
      console.error('Load error:', error);
    }
  };

  const saveInventory = async (data) => {
    try {
      await ensureDirExists(INVENTORY_DIR);
      await FileSystem.writeAsStringAsync(INVENTORY_FILE, JSON.stringify(data));
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const pickImageFromSource = async (source) => {
    try {
      const result = await (source === 'camera'
        ? ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.7 })
        : ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.7 }));
      if (!result.canceled) setSelectedImage(result.assets[0].uri);
    } catch (error) {
      console.error('Image pick error:', error);
    }
  };

  const saveImage = async (uri) => {
    try {
      await ensureDirExists(IMAGE_DIR);
      const fileName = Date.now() + '.jpg';
      const newUri = IMAGE_DIR + fileName;
      await FileSystem.copyAsync({ from: uri, to: newUri });
      return newUri;
    } catch (error) {
      console.error('Save image error:', error);
      return uri;
    }
  };

  const addInventoryItem = async () => {
    if (!itemName.trim()) {
      Alert.alert('Missing Info', 'Item name is required');
      return;
    }

    const imageUri = selectedImage ? await saveImage(selectedImage) : null;

    const newItem = {
      id: Date.now().toString(),
      name: itemName,
      quantity: itemQuantity || '1',
      imageUri,
      date: new Date().toISOString()
    };

    const updatedInventory = [...inventoryItems, newItem];
    setInventoryItems(updatedInventory);
    await saveInventory(updatedInventory);

    setItemName('');
    setItemQuantity('');
    setSelectedImage(null);
    Alert.alert('Item Added', 'Inventory updated');
  };

  const deleteInventoryItem = async (itemId) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            const item = inventoryItems.find(i => i.id === itemId);
            if (item?.imageUri) {
              const info = await FileSystem.getInfoAsync(item.imageUri);
              if (info.exists) await FileSystem.deleteAsync(item.imageUri);
            }
            const updated = inventoryItems.filter(i => i.id !== itemId);
            setInventoryItems(updated);
            await saveInventory(updated);
          } catch (error) {
            console.error('Delete error:', error);
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Track Inventory</Text>
          <TextInput style={styles.input} placeholder="Item Name" value={itemName} onChangeText={setItemName} />
          <TextInput style={styles.input} placeholder="Quantity" value={itemQuantity} onChangeText={setItemQuantity} keyboardType="numeric" />

          <View style={styles.imagePickerContainer}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            ) : (
              <View style={styles.noPreviewImage}><Text style={styles.noImageText}>No Image</Text></View>
            )}
            <View style={styles.imageButtonsContainer}>
              <TouchableOpacity style={styles.imageButton} onPress={() => pickImageFromSource('camera')}>
                <Text style={styles.buttonText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.imageButton} onPress={() => pickImageFromSource('gallery')}>
                <Text style={styles.buttonText}>Pick Image</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.addButton} onPress={addInventoryItem}>
            <Text style={styles.buttonText}>Add Item</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.inventoryTitle}>Your Inventory</Text>
        {inventoryItems.length > 0 ? (
          inventoryItems.map(item => (
            <View key={item.id} style={styles.inventoryItem}>
              {item.imageUri ? (
                <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
              ) : (
                <View style={styles.noImage}><Text style={styles.noImageText}>No Image</Text></View>
              )}
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                <Text style={styles.itemDate}>{new Date(item.date).toLocaleDateString()}</Text>
              </View>
              <TouchableOpacity onPress={() => deleteInventoryItem(item.id)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No items yet</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: '#333' },
  formContainer: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 16, elevation: 2 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 4, padding: 12, marginBottom: 12, fontSize: 16 },
  imagePickerContainer: { marginBottom: 16 },
  previewImage: { width: '100%', height: 200, borderRadius: 8, marginBottom: 8 },
  noPreviewImage: { width: '100%', height: 200, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginBottom: 8 },
  noImageText: { color: '#888', fontSize: 14 },
  imageButtonsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  imageButton: { backgroundColor: '#89387b', padding: 12, borderRadius: 4, flex: 0.48, alignItems: 'center' },
  addButton: { backgroundColor: '#89387b', padding: 14, borderRadius: 4, alignItems: 'center', marginTop: 4 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  inventoryTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 12, color: '#333' },
  emptyText: { textAlign: 'center', fontSize: 16, color: '#888', marginTop: 16 },
  inventoryItem: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 12, elevation: 1 },
  itemImage: { width: 80, height: 80, borderRadius: 4 },
  noImage: { width: 80, height: 80, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', borderRadius: 4 },
  itemDetails: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  itemName: { fontSize: 18, fontWeight: 'bold' },
  itemQuantity: { fontSize: 14, color: '#555' },
  itemDate: { fontSize: 12, color: '#888' },
  deleteButton: { justifyContent: 'center', alignItems: 'center', width: 30, height: 30 },
  deleteButtonText: { fontSize: 24, color: '#ff3b30', fontWeight: 'bold' },
});
