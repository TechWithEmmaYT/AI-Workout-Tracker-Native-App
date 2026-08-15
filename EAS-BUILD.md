# Building Your Expo App with EAS (Android + iOS)

A simple walkthrough of setting up EAS Build for both platforms, with `preview` and `production` profiles explained.

## 1. Install the EAS CLI

```bash
npm install -g eas-cli
```

This gives you the `eas` command globally, so you can run it from any project.

## 2. Log in to your Expo account

```bash
eas login
```

---

## For deploying your api to EAS Hosting

(npx expo export --platform web

## only api to be build

npx expo export --platform web --no-ssg

eas deploy --alias <pick_a_name>
)
----

Builds run on Expo's servers, so it needs to know which account they belong to.

## 3. Configure your project for EAS

```bash
eas build:configure
```

Run this once per project. It creates the `eas.json` file (build profiles) and adds a `projectId` under `extra.eas` in your `app.json`/`app.config.js`, linking this local project to a project on Expo's servers.

## 4. Understand `eas.json`

This is the file that controls _how_ each build behaves. Here's a standard setup with comments explaining each part:

```jsonc
{
  "cli": {
    // Pins the EAS CLI version so builds behave the same on every machine,
    // including CI — avoids "works on my machine" surprises.
    "version": ">= 10.0.0",
  },
  "build": {
    "development": {
      // For local development — includes the dev client so you get
      // hot reload, debugging tools, etc. Not for testers or the store.
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk", // apk installs directly on a device, no store needed
      },
    },
    "preview": {
      // For testers — a real, installable build (no dev tools attached),
      // but not submitted anywhere. Share the link/APK directly.
      "distribution": "internal",
      "android": {
        "buildType": "apk",
      },
      // No "ios.simulator" flag here — omitting it (or setting it to false)
      // means this profile builds for REAL devices, which is what you want
      // for handing a build to yourself or a tester. Simulator builds are
      // a separate, optional use case — see the note in step 6.
    },
    "production": {
      // The real deal — what actually gets submitted to the App Store
      // and Google Play. Android builds as an .aab (required by Play Store),
      // not an .apk.
      "autoIncrement": true, // bumps the build number automatically each build
    },
  },
  "submit": {
    "production": {},
    // Settings for `eas submit` go here later (Apple ID, Play service account, etc.)
  },
}
```

**The key difference between `preview` and `production`:** `preview` gives you something installable to test with right now, on a real device. `production` gives you the actual file format each store requires, plus things like auto-incrementing build numbers that stores expect to increase with every release.

## 5. iOS-only: register your device BEFORE building

Android has no equivalent to this step — skip straight to step 6 if you're only building for Android.

Apple requires every physical iPhone to be explicitly registered before any build (yours or the App Store's) can install on it. This needs a paid **Apple Developer account** ($99/year).

```bash
eas device:create
```

This gives you a link/QR code. Open it **on the iPhone you want to test on** — it registers that device's UDID with your Apple Developer account. Repeat this for every tester's iPhone before they can install your build.

> Note: this step is only needed for real-device builds. If you've already been testing locally with `expo run:ios`, that already builds and runs on a simulator or connected device through Xcode — you don't need `eas device:create` or an EAS build just to keep doing that. EAS's simulator build option exists for a different case: sharing a build with a collaborator who doesn't have your project set up locally, so they can drag it into their own simulator. It's not part of the real-device testing flow below.

## 6. Run a preview build

```bash
eas build --profile preview --platform android
```

```bash
eas build --profile preview --platform ios
```

Or both at once:

```bash
eas build --profile preview --platform all
```

`--profile` picks which block from `eas.json` to use. `--platform` picks which OS to build for (`android`, `ios`, or `all`). For iOS, this builds specifically for the device(s) you registered in step 5.

This uploads your project to EAS's servers, builds it there, and gives you a download link when it's done — no Xcode or Android Studio needed locally.

## 7. Install the preview build on a device

Build finishes → EAS gives you a download link and QR code, for both platforms.

- **Android**: open the link on the phone, download and install the `.apk` directly (you may need to allow installs from unknown sources). Works on any Android phone, no registration needed.
- **iOS**: open the link **on the same iPhone you registered in step 5** (must be Safari). It installs like a normal app icon. Then go to **Settings → General → VPN & Device Management**, tap the developer profile, and trust it — without this step the app installs but refuses to open. Only registered devices can install; any other iPhone is rejected.

## 8. Run a production build

```bash
eas build --profile production --platform android
```

```bash
eas build --profile production --platform ios
```

Same command shape as preview — just swap the profile. This produces the `.aab` (Android) and `.ipa` (iOS) files the stores actually require.

## 9. Submit to the stores

```bash
eas submit --platform android
```

```bash
eas submit --platform ios
```

This takes your most recent production build and uploads it directly to Google Play / App Store Connect — no manual upload through a browser needed. First time through, EAS will walk you through connecting your Google Play service account / Apple credentials.

## Quick mental model

| Profile       | Who it's for                       | Output                                                    |
| ------------- | ---------------------------------- | --------------------------------------------------------- |
| `development` | You, while coding                  | Dev client build, hot reload                              |
| `preview`     | Testers, yourself on a real device | Installable APK (Android) / registered-device build (iOS) |
| `production`  | The App Store / Play Store         | `.aab` / `.ipa`, ready to submit                          |

## Android vs iOS, side by side

|                                          | Android | iOS                                       |
| ---------------------------------------- | ------- | ----------------------------------------- |
| Account needed to test on a real device? | No      | Yes — paid Apple Developer account        |
| Device registration needed?              | No      | Yes — `eas device:create`, per device     |
| Anyone can install the preview link?     | Yes     | No — only registered devices              |
| Extra step after install?                | No      | Yes — trust developer profile in Settings |
