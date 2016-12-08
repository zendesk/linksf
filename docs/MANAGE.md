## Managing Organizations, Locations, and Services

Navigate to `<path to linksf instance>/admin` in your browser while Link-SF is running, and log in with the credentials that you used to create your admin user in Firebase. If you already imported Data, you should see it displayed in the list.

### How it's structured

Your data is structured like this:

```
                        Organization A                      Organization B
              Location A          Location B                  Location D
      Service A     Service B     Service C        Service D   Service E   Service F

```

Organizations are the top level item.  Any Organization may have one more more Locations, and any Location may have one more more Services.

### How it works

#### Organizations

An Organization is any non-profit or business that offers services you want to be seen on your Link-SF instance.  For example, St Anthony's Foundation, or the United Way.

Organizations contain high level data that you may want to keep around such as their website and points of contact.

#### Locations

Distinct from an Organization, a Location is any physical place that you could visit.  For example, the United Way may have an East and a West location, each of which offers different services to its visitors.

Locations are what visitors of your Link-SF will see listed after an initial search. They contain a name, short description of the building, and a street address.

#### Services

Services are the bread and butter of your Link-SF instance.  These are the actual resources which are provided at the locations listed.  A soup kitchen, or temporary housing would be examples of individual services.

When a user visits the home page of your Link, they will first select what they are looking for (ex. Food, Housing, Hygiene, Medical, Technology), and the locations of these services will be displayed to them.

Services contain basic information such as a name, description, and category, as well as additional eligibility information.  If a service is gender or age restricted, you will list that here.

### How to change your data

#### Adding new data

Adding new data is as simple as clicking the "Add Organization" button in the upper right of your admin page.

#### Editing existing data

To edit an existing Organization, select it from the list displayed.  If you want to edit a Location or Service, start by selecting the Organization to which it belongs.

Searching and filtering options are available in the top bar to help you find what you're looking for!
