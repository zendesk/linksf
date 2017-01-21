To replace or add to the icons being used, follow these steps:

1. Locate the current icon set as a zip file at `/icons/zipfiles/`. 
1. Go to http://fontello.com/. Click the wrench icon at the top-right, then import the .zip file. You should see the current set of icons in a section called 'Custom Icons' that are circled with red.
1. Search through the icons below and pick those that best suit your categories/taxonomies (like "food", "hygiene"). If you are replacing icons, you can pick an icon you like better, and then deselect the older/original icon in the 'Custom Icons' section.
1. Go to the 'Customize Names' tab and update the names of the icons to reflect the category.  The icon for the Food category should be named `icon-food`, and for reference, the other default category icons should be named `icon-family`, `icon-housing`, `icon-medical`, `icon-technology`.  
1. If you have extra categories/taxonomies, you'll want to check your project's taxonomies in Firebase under `https://console.firebase.google.com/project/---YOUR-PROJECT-IN-FIREBASE---/database/data/taxonomies` and name your icon `icon-TAXONOMYNAME` for each additional taxonomy.
1. Click the red button at the top right that says 'Download Webfont'. 
1. Save the zipfile in the `/icons/zipfiles/` folder so you have a reference for later. Unzip the file.
1. Inside the decompressed zipfile you will see a `font` and `css` folder. Replace the `font` and `css` folders under the `/icons/` folder with these ones.
1. That should be it and you should see your updated/new icons if you're already running `npm start`.