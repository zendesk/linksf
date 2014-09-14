# Creating Your Admin Users

1. **Add Parse Classes**
 
 After creating an app on Parse, click data browser, click 'New Class', choose `'User'` type then click 'create.' This app will have three classes in total: `User`, `Facility`, and `Service`. Add `Facility` and `Service` in the same way, as `'Custom'` type classes.
1. **Create a User**

 Users can be added straight into the data browser by providing a name, email and password (which is then hidden). Add a user and then copy its `objectId` for use in the next step.
1. **Set Permissions**

 Next, you can set permissions on a per object basis. For Link-SF, that includes the `Facility` class and the `Service` class. Select the class in the Parse data browser and click the ‘More’ menu and select ‘Set permissions.’

 Here you can click on the actions that should not be public, one at a time. Click Update, then uncheck “Any user can perform this action.” In the users box below, add the `objectId` of the user that you created before.
