# Firebase Authentication Setup (MathVerse)

To enable **real** login and sign-up (email/password and Google), you need a Firebase project and to paste its config into the site.

## Steps

1. **Create a Firebase project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click **Add project** (or use an existing project)
   - Finish the wizard

2. **Register your app**
   - In the project overview, click the **Web** icon (`</>`)
   - Enter an app nickname (e.g. "MathVerse Web"), then **Register app**
   - Copy the `firebaseConfig` object shown

3. **Enable sign-in methods**
   - In the left sidebar: **Build → Authentication**
   - Open the **Sign-in method** tab
   - Enable **Email/Password**
   - Enable **Google** (add a support email if asked)

4. **Add the config to your site**
   - Open **index.html**
   - Find the script block that sets `window.MATHVERSE_FIREBASE_CONFIG`
   - Replace the placeholder values with your Firebase config:

```javascript
window.MATHVERSE_FIREBASE_CONFIG = {
  apiKey: "AIza...",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

5. **Optional: Authorized domains**
   - In Authentication → **Settings** → **Authorized domains**
   - Ensure your domain (or `localhost` for local testing) is listed

After this, sign-in and sign-up will use Firebase: accounts are stored there, and login only succeeds for valid email/password or Google.

**Continue as Guest** still works without Firebase and does not create an account.
