# C1 RWA Site

Static website for C1 RWA. It is ready for free hosting on GitHub Pages.

## Photo Gallery

Put gallery photos in:

```text
assets/gallery
```

Then run this from the project root to regenerate the gallery list:

```powershell
.\tools\update-gallery.ps1
```

Commit the generated `js/gallery-images.js` file with the images. GitHub Pages cannot scan folders at runtime, so the committed manifest is what the browser uses.

Supported gallery image types: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.svg`.

To import photos from another folder and rename them cleanly:

```powershell
.\tools\import-gallery.ps1 -Source "C:\path\to\photos" -Prefix "community-event"
```

This copies the images into `assets/gallery` as names like `community-event-01.jpeg`, `community-event-02.jpeg`, then regenerates `js/gallery-images.js`.

To replace the existing gallery while importing:

```powershell
.\tools\import-gallery.ps1 -Source "C:\path\to\photos" -Prefix "community-event" -ClearExisting
```

## GitHub Pages

1. Push this folder to a GitHub repository.
2. Go to repository `Settings` -> `Pages`.
3. Select `Deploy from a branch`.
4. Choose the branch, usually `main`, and folder `/root`.
5. Save. GitHub will publish the site for free.
