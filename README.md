linksf
======

a preliminary schema

```json
name:        string
addr:        string
description: string
phone:       string
hours:       object
notes:       string
geopoint:    geo
demos:       []
services:    []
```

with this, we can proceed on some action items:

1. convert the existing data (google spreadsheet) into fixture json

and then these distribute time to these parallelizable tasks:
1. implement the Parse query api
1. implement the frontend
1. implement the admin ui
