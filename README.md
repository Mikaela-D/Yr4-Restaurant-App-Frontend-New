# FetchLocalhostWeek7

This is a simple mobile application developed using React Native. The app demonstrates navigation between screens and fetching data from an API.
It has local and push notifications. The push notifications are for when a dish is added or deleted.

![App Screenshot](assets/Product%20Management%20App%20Diagram.png)

## Screens

- **Home Screen**: Provides navigation to other screens.
- **Fetch Screen**: Fetches data from an API and displays it.
- **View Product Screen**: Fetches and displays specific product details from an API.
- **Manage Products Screen**: Lists all products and provides options to add, edit, or delete products.
- **Product Details Screen**: Displays detailed information about a selected product.
- **Edit Product Screen**: Allows editing of a selected product.
- **Add Product Screen**: Allows adding a new product.

## How to Run

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Start the application using `npm start`.

## Backend Setup

The backend is built using Express and Mongoose. It provides API routes for managing products.

### API Endpoints

- `GET /`: Fetch all products.
- `POST /`: Fetch all products.
- `GET /getSpecificProduct`: Fetch a specific product by ID.
- `POST /getSpecificProduct`: Fetch a specific product by ID.
- `POST /addProduct`: Add a new product.
- `POST /updateSpecificProduct`: Update an existing product.
- `POST /deleteSpecificProduct`: Delete a product.

### Running the Backend

1. Navigate to the backend directory.
2. Install dependencies using `npm install`.
3. Start the backend server using `node app.js`.

### Using ngrok

To expose your local server to the internet, you can use ngrok.

1. Install ngrok from [ngrok.com](https://ngrok.com/).
2. Start ngrok with the following command:
   ```
   ngrok http 3010
   ```
3. Replace the API endpoint in your React Native app with the ngrok URL provided.

### Configuration

1. Create the .config file in this path: Yr4-Restaurant-App-Frontend\config.js
2. Add this code:

const config = {
ngrokUrl: "https://your-ngrok-token.ngrok-free.app",
};

export default config;

export const expoPushToken = "ExponentPushToken[yourToken]";

### Push Notifications

https://expo.dev/

## Dependencies

- React Native
- React Navigation
- Express
- Mongoose

## License

This project is licensed under the MIT License.
