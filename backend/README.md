# PrepPal Backend API

Node.js/Express REST API for the PrepPal meal prep application.

## Current Status: MOCK DATA PROTOTYPING

⚠️ **Important**: This API currently uses **MOCK DATA** for rapid prototyping. The recipe extraction endpoint simulates API responses without requiring API keys.

## Quick Start

```bash
# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Start development server
npm run dev

# The API will run on http://localhost:5000
```

## Testing the API

### Health Check

```bash
curl http://localhost:5000/api/health
```

### Extract Recipe from YouTube (MOCK DATA)

```bash
curl -X POST http://localhost:5000/api/recipes/extract-from-youtube \
  -H "Content-Type: application/json" \
  -d '{"youtubeUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recipe_name": "High Protein Chicken & Rice Meal Prep",
    "servings": 5,
    "ingredients": [
      { "item": "Chicken breast", "quantity": "1", "unit": "kg" },
      { "item": "Brown rice", "quantity": "2", "unit": "cups" }
    ],
    "instructions": ["Step 1...", "Step 2..."],
    "macros_per_serving": {
      "calories": 420,
      "protein": 45,
      "carbs": 38,
      "fat": 9
    },
    "prep_time_minutes": 15,
    "cook_time_minutes": 35
  },
  "message": "Recipe extracted successfully (MOCK DATA)"
}
```

## Available Mock Recipes

The mock API returns 3 different recipes based on URL length:

1. **High Protein Chicken & Rice Meal Prep** (American)
   - 420 cal, 45g protein, 38g carbs, 9g fat

2. **Vegetarian Buddha Bowl Meal Prep** (Mediterranean)
   - 385 cal, 15g protein, 58g carbs, 12g fat

3. **Spicy Korean Beef & Veggie Bowls** (Asian)
   - 445 cal, 32g protein, 42g carbs, 16g fat

The API simulates a 2-second processing delay to mimic real API behavior.

## API Endpoints

### Public Endpoints (No Authentication Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/recipes/extract-from-youtube` | Extract recipe from YouTube (MOCK) |

### Protected Endpoints (Authentication Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update user profile |
| GET | `/api/recipes` | Get all recipes |
| GET | `/api/recipes/:id` | Get recipe by ID |
| POST | `/api/recipes` | Create recipe |
| PUT | `/api/recipes/:id` | Update recipe |
| DELETE | `/api/recipes/:id` | Delete recipe |
| GET | `/api/recipes/search` | Search recipes |
| GET | `/api/meal-plans` | Get all meal plans |
| POST | `/api/meal-plans` | Create meal plan |
| GET | `/api/meal-plans/:id` | Get meal plan by ID |
| PUT | `/api/meal-plans/:id` | Update meal plan |
| DELETE | `/api/meal-plans/:id` | Delete meal plan |

## Testing from Mobile App

### Find Your Local IP Address

**Mac/Linux:**
```bash
ifconfig | grep "inet "
```

**Windows:**
```bash
ipconfig
```

Look for your local IP (e.g., `192.168.1.100`)

### Update Mobile App

In `/mobile/.env`:
```
API_URL=http://192.168.1.100:5000/api
```

**Important**:
- Don't use `localhost` or `127.0.0.1` from mobile
- Use your computer's actual IP address
- Make sure your mobile device is on the same WiFi network

## Migrating to Real APIs

When ready to add real YouTube + OpenAI integration:

### 1. Get API Keys

- **YouTube Data API v3**: https://console.cloud.google.com/apis/library/youtube.googleapis.com
- **OpenAI API**: https://platform.openai.com/api-keys

### 2. Update `.env`

```env
YOUTUBE_API_KEY=your_youtube_api_key
OPENAI_API_KEY=sk-your_openai_api_key
```

### 3. Update Controller

Replace `generateMockRecipe()` in `/src/controllers/recipeController.js` with:

```javascript
const axios = require('axios');

async function extractRealRecipe(youtubeUrl) {
  // 1. Extract video ID from URL
  const videoId = extractVideoId(youtubeUrl);

  // 2. Fetch video transcript using YouTube Data API
  const transcript = await getYouTubeTranscript(videoId);

  // 3. Send transcript to OpenAI for recipe extraction
  const recipe = await extractRecipeWithOpenAI(transcript);

  return recipe;
}

async function getYouTubeTranscript(videoId) {
  const response = await axios.get(
    `https://www.googleapis.com/youtube/v3/captions`,
    {
      params: {
        part: 'snippet',
        videoId,
        key: process.env.YOUTUBE_API_KEY
      }
    }
  );

  // Process and return transcript
  return response.data;
}

async function extractRecipeWithOpenAI(transcript) {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a recipe extraction assistant. Extract structured recipe data from video transcripts.'
        },
        {
          role: 'user',
          content: `Extract the recipe from this transcript: ${transcript}`
        }
      ]
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  // Parse and return structured recipe
  return parseRecipeFromResponse(response.data);
}
```

### 4. Response Format

Keep the same response format for compatibility with mobile app.

## Environment Variables

See `.env.example` for all required variables:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key  # For production
YOUTUBE_API_KEY=your_youtube_key  # For production
```

## Error Handling

All errors return this format:

```json
{
  "success": false,
  "error": "Error message here",
  "stack": "Stack trace (development only)"
}
```

## Development

```bash
# Install dependencies
npm install

# Run development server with auto-reload
npm run dev

# Run production server
npm start
```

## Tech Stack

- **Express** - Web framework
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

## Notes

- Mock data removes need for API keys during development
- Easy migration path to real APIs later
- All responses follow same structure for consistency
- 2-second delay simulates real API processing time
- URL-based recipe selection ensures consistency for same URLs

---

Built with ❤️ by the PrepPal Team
