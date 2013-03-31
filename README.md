linksf
======

####a preliminary schema

Two objects, Facility and Service.

Facility:

```
name:         string
addr:         string
description:  string
phone:        string
hours:        object
notes:        string
demographics: array
geopoint:     geo
```

Service:

```
facilityId:   string # linkage
name:         string # like 'showers', 'hiv testing'
category:     string # 'hygiene'|'food'|'medical'|'shelter'|'technology'
hours:        object
notes:        string
demographics: array  # maybe?  unclear whether necessary      
```





####with this, we can proceed on some action items:

1. convert the existing data (google spreadsheet) into fixture json

####then these parallelizable tasks:

1. implement the Parse query api
1. implement the frontend
1. implement the admin ui

####a changelog of sorts

* Added a scaffold [cloudcode](https://www.parse.com/docs/cloud_code_guide) app
