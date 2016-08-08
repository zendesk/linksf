# Securing access to the Parse data store

In Parse, we need to make sure
that malicious users cannot edit our data
without our permission.

To help us secure our data,
Parse provides the concept of "Class-Level Permissions".

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
