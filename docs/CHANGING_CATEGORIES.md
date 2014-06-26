Changing a category in your instance of LinkSF
===

## Part I: The category name
There is a total of three files that you will need to edit in your link-sf project.

1. The first thing you will need to edit is the categories file, found at /shared/js/lib/categories.js
It shows you a list of categories in the following format:   `{ icon: 'desktop', key: 'technology', title: 'Technology' }`

  First, edit the values for key and title; i.e. change lowercase 'technology' to a lowercase, space-free version of your new category name. For example, if I want to swap Technology for School Services, I would change this key to the following: 'schoolServices'

  Then change the title to the name of your new category. For example at this point I could have something like:
  `{ icon: 'desktop', key: 'schoolServices', title: 'School Services' }`
  or
  `{ icon: 'desktop', key: 'legal', title: 'Legal' }`

2. Next, find the test for this at /test/acceptance/tests.js 
After the word 'expected' you will see an array of categories. Change the name of the one that you want to replace with your new category.

3. Find the edit template at /admin/js/templates/edit.hbs
Search for the html element: `<select name="categories" id="categories" class="span2">`
At the time of writing, this begins on line 98. Find the option for the category you are replacing, and fill it in with your new category key and title from step 1. For example, I might change `<option value="technology">Technology</option>` into this: `<option value="legal">Legal</option>`

This completes part 1.

## Part II: The category Icon
At this point your instance of LinkSF should show your new category name everywhere. But if it doesn't match the icon, you may want to change this for a better user experience.

1. Locate our current icon set at /vendor/fontello***.zip, where the asterisks will be a random looking string of numbers and/or letters. This is a zipfile of our icons.

2. Go to http://fontello.com/
Click the wrench icon at the top-right, next to the search bar, then click on 'Import' from the drop-down. Select the zipfile mentioned in step 1 and upload it. Now a set of the icons currently used by LinkSF will be selected in fontello. Search through the icons and pick one out that best suits your new category name. Perhaps I would choose the icon called hammer for our example.

  Once you have selected the icon that you want to use, and if you like, de-selected the one you no longer need, click the big red button at the top-right that says 'Download Webfont'

3. This gives you a new zipfile. Delete the one currently in /vendor/ in link-sf, and replace it with this new one. You also need to expand/open the zipfile to get its contents

4. Inside the un-compressed zipfile you will see folders for fonts and for css. In link-sf, replace the "icons" fils inside of /vendor/font/ with the new icons files from the fontello unzipped folder. Then replace the css in /vendor/css/icons.css with the new css that was included in the unzipped folder.

Your LinkSF should now be showing your new icons alongside your new category names.
