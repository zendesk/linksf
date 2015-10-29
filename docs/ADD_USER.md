# Creating Your Admin Users

1. **Add Parse Classes**

After creating an app on Parse,
you'll be taken to the app dashboard.
Click `Core` in the top navigation bar
to see an overview of your app's data.

In the left sidebar,
you'll see the different data classes in your application.
You should have a `User` class created for you;
if not, click on `Add Class`,
then select the `User` template from the dropdown
and name the class `User`.

In addition to the `User` class,
you'll also need a `Facility` class
and a `Service` class.
Click  `Add Class`,
and use the `Custom` template from the dropdown,
and create a `Facility` class.
Repeat the process to create `Service`.

1. **Create a User**

Users can be added straight into the data browser by providing a name, email
and password (which is then hidden). Add a user and then copy its `objectId`
for use in the next step.

1. **Set Permissions**

Next, you can set permissions on a per object basis.
We need to give the user you just created
permission to edit facilities and services.

Click on `Facility` in the sidebar, and then click on `Security` in the top bar.
Change the public permissions so they only have `Read` access.
Then paste your user ID into the box and hit enter.
You'll be able to grant your user both `Read` and `Write` permissions.

Repeat that process for the `Service` class,
giving the public `Read`-only permissions,
and your user both `Read` and `Write`.
