# PrepPal - Your Meal Prep Companion

PrepPal is a cross-platform mobile application that helps users plan meals based on their fitness goals and macros. Built with React Native (Expo) for mobile and Node.js/Express for the backend, PrepPal makes meal planning simple and personalized.

## Features

- **Personalized Nutrition**: Calculate macros based on fitness goals, age, weight, height, and activity level
- **Recipe Management**: Create, edit, and browse recipes with detailed nutritional information
- **Meal Planning**: Plan meals for the week and track your daily macro intake
- **YouTube Recipe Extraction**: Extract recipes from YouTube videos using AI (coming soon)
- **Dietary Preferences**: Filter recipes based on dietary restrictions and allergies
- **Cross-Platform**: Works on both iOS and Android devices

## Tech Stack

### Frontend (Mobile)
- **React Native** with **Expo** - Cross-platform mobile development
- **React Navigation** - Navigation and routing
- **Axios** - HTTP client for API calls
- **AsyncStorage** - Local data persistence
- **React Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** with **Mongoose** - Database and ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **OpenAI API** - AI-powered recipe extraction (planned)

## Project Structure

```
PrepPal/
├── mobile/                    # React Native app
│   ├── src/
│   │   ├── screens/          # Screen components
│   │   ├── components/       # Reusable components
│   │   ├── navigation/       # Navigation configuration
│   │   ├── services/         # API service layer
│   │   ├── context/          # Context providers
│   │   ├── utils/            # Utility functions
│   │   └── App.js           # App entry point
│   ├── package.json
│   ├── app.json
│   └── .env.example
│
├── backend/                   # Node.js API
│   ├── src/
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API routes
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Custom middleware
│   │   └── server.js        # Server entry point
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (free tier available)
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Emulator

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in `.env`:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string for JWT signing
   - `OPENAI_API_KEY`: Your OpenAI API key (optional, for future features)
   - `PORT`: Server port (default: 5000)

5. Start the development server:
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:5000`

6. Test the API health check:
   ```bash
   curl http://localhost:5000/api/health
   ```

### Mobile App Setup

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Configure your API URL in `.env`:
   - For local development: `API_URL=http://localhost:5000/api`
   - For Android emulator: `API_URL=http://10.0.2.2:5000/api`
   - For physical device: Use your computer's local IP address

5. Start the Expo development server:
   ```bash
   npm start
   ```

6. Run on your device:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your physical device

## MongoDB Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. Create a new cluster (free tier available)

3. Create a database user with a username and password

4. Whitelist your IP address (or use 0.0.0.0/0 for development)

5. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `preppal` or your preferred database name

6. Add the connection string to your backend `.env` file

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Recipe Endpoints

- `GET /api/recipes` - Get all recipes (protected)
- `GET /api/recipes/:id` - Get recipe by ID (protected)
- `POST /api/recipes` - Create new recipe (protected)
- `PUT /api/recipes/:id` - Update recipe (protected)
- `DELETE /api/recipes/:id` - Delete recipe (protected)
- `GET /api/recipes/search?q=query` - Search recipes (protected)
- `POST /api/recipes/extract-youtube` - Extract recipe from YouTube (protected, coming soon)

### Meal Plan Endpoints

- `GET /api/meal-plans` - Get all meal plans (protected)
- `GET /api/meal-plans/:id` - Get meal plan by ID (protected)
- `POST /api/meal-plans` - Create new meal plan (protected)
- `PUT /api/meal-plans/:id` - Update meal plan (protected)
- `DELETE /api/meal-plans/:id` - Delete meal plan (protected)
- `GET /api/meal-plans/current-week` - Get current week's meal plan (protected)

### Health Check

- `GET /api/health` - API health check (public)

## Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/preppal
JWT_SECRET=your_super_secret_jwt_key
OPENAI_API_KEY=sk-your-openai-api-key
```

### Mobile (.env)

```env
API_URL=http://localhost:5000/api
```

## Database Models

### User Schema
- Personal information (name, email, password)
- Fitness goals (lose weight, maintain, gain muscle, gain weight)
- Stats (age, gender, height, weight, activity level)
- Calculated macros (calories, protein, carbs, fat)
- Dietary preferences and allergies

### Recipe Schema
- Recipe details (name, description, ingredients, instructions)
- Nutritional information (macros per serving)
- Cooking information (prep time, cook time, servings)
- Media (YouTube URL, image URL)
- Tags and dietary info
- Visibility settings (public/private)

### Meal Plan Schema
- User reference
- Date range (start date, end date)
- Daily meals organized by meal type (breakfast, lunch, dinner, snack)
- Macro tracking for each day
- Completion status for each meal
- Notes and active status

## Development Scripts

### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

### Mobile
```bash
npm start          # Start Expo development server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web
```

## Coming Soon

- AI-powered recipe extraction from YouTube videos
- Barcode scanning for nutritional information
- Shopping list generation
- Social features (share recipes, meal plans)
- Progress tracking and analytics
- Integration with fitness trackers

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

## Support

For issues and questions, please open an issue on the GitHub repository.

---

Built with ❤️ by the PrepPal Team
