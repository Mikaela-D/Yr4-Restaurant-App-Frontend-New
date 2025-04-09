import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Alert } from "react-native";
import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import HomeScreen from "./screens/HomeScreen";
import AllProductsScreen from "./screens/AllProductsScreen";
import ManageProductsScreen from "./screens/ManageProductsScreen";
import ProductDetailsScreen from "./screens/ProductDetailsScreen";
import EditProductScreen from "./screens/EditProductScreen";
import ViewProductScreen from "./screens/ViewProductScreen";
import FetchScreen from "./screens/FetchScreen";
import AddProductScreen from "./screens/AddProductScreen";
import LoginScreen from "./screens/LoginScreen";
import NearbyStoresScreen from "./screens/NearbyStoresScreen";
import TrackInventoryScreen from "./screens/TrackInventoryScreen";
import CartScreen from "./screens/CartScreen";
import { CartProvider } from "./contexts/CartContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Stack = createNativeStackNavigator();

export default App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    async function configurePushNotifications() {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;

      if (finalStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert(
          "Permission required",
          "Push notifications need the appropriate permissions."
        );
        return;
      }

      const subscription1 = Notifications.addNotificationReceivedListener(
        (notification) => {
          console.log("NOTIFICATION RECEIVED");
          console.log(notification);
        }
      );

      const subscription2 =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log("NOTIFICATION RESPONSE RECEIVED");
          console.log(JSON.stringify(response));
        });

      return () => {
        subscription1.remove();
        subscription2.remove();
      };
    }

    configurePushNotifications();
  }, []);

  return (
    <CartProvider>
      <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Home" options={{ title: "Restaurant App" }}>
            {(props) => (
              <HomeScreen
                {...props}
                toggleTheme={toggleTheme}
                isDarkMode={isDarkMode}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Fetch" component={FetchScreen} />
          <Stack.Screen name="ViewProduct" component={ViewProductScreen} />
          <Stack.Screen
            name="ManageProducts"
            component={ManageProductsScreen}
          />
          <Stack.Screen
            name="ProductDetails"
            component={ProductDetailsScreen}
          />
          <Stack.Screen name="AddProduct" component={AddProductScreen} />
          <Stack.Screen name="EditProduct" component={EditProductScreen} />
          <Stack.Screen name="All Products" component={AllProductsScreen} />
          <Stack.Screen name="NearbyStores" component={NearbyStoresScreen} />
          <Stack.Screen
            name="TrackInventory"
            component={TrackInventoryScreen}
          />
          <Stack.Screen name="Cart" component={CartScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
};
