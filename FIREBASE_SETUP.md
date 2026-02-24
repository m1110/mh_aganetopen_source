# Firebase Setup for Image Upload

To enable image upload functionality in the Edit Profile modal, you need to configure Firebase in your environment.

## 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable **Firestore Database** and **Storage**

## 2. Environment Variables

Add these environment variables to your `.env.local` file:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 3. Firebase Storage Rules

Update your Firebase Storage rules to allow image uploads:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /user-avatars/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 4. Firestore Security Rules

Update your Firestore rules to allow user profile updates:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /introspect-ai/development/users/{userId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 5. How It Works

- Users can upload square images (1024x1024 or smaller) via the Edit Profile modal
- Images are stored in Firebase Storage under `user-avatars/{userId}/`
- User profile data (customUserImage, preferredName, preferredEmail) is stored in Firestore
- The custom image is displayed as the user's avatar in chat messages 