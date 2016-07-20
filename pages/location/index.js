import React, { Component } from 'react'
import Layout from '../../components/Layout'
import Location from '../../components/Location'

const location = {
   "description":"Multi-service center",
   "id":0,
   "latitude":37.7800103,
   "longitude":-122.40772170000002,
   "name":"City Team Ministries",
   "organization_id":"cbUguDmnTb",
   "services":[
      {
         "applicationProcess":"Dinner: Tues-Fri arrive 5:45pm for 6pm (optional church group). Those who come to church group are fed first. A hot meal. Lunch: Saturday 1pm-3pm. Saturday Laundry",
         "description":"A hot meal served 5 days a week",
         "eligibility":{
            "gender":"M"
         },
         "id":"NsmASEQlga",
         "location_id":"cbUguDmnTb",
         "name":"Free hot meal",
         "organization":"cbUguDmnTb",
         "schedules":[
            [
               {
                  "closes_at":1900,
                  "id":63,
                  "location_id":"cbUguDmnTb",
                  "opens_at":1745,
                  "organization_id":"cbUguDmnTb",
                  "service_id":"NsmASEQlga",
                  "weekday":"Tuesday"
               },
               {
                  "closes_at":1900,
                  "id":63,
                  "location_id":"cbUguDmnTb",
                  "opens_at":1745,
                  "organization_id":"cbUguDmnTb",
                  "service_id":"NsmASEQlga",
                  "weekday":"Wednesday"
               },
               {
                  "closes_at":1900,
                  "id":63,
                  "location_id":"cbUguDmnTb",
                  "opens_at":1745,
                  "organization_id":"cbUguDmnTb",
                  "service_id":"NsmASEQlga",
                  "weekday":"Thursday"
               },
               {
                  "closes_at":1900,
                  "id":63,
                  "location_id":"cbUguDmnTb",
                  "opens_at":1745,
                  "organization_id":"cbUguDmnTb",
                  "service_id":"NsmASEQlga",
                  "weekday":"Friday"
               },
               {
                  "closes_at":1500,
                  "id":63,
                  "location_id":"cbUguDmnTb",
                  "opens_at":1300,
                  "organization_id":"cbUguDmnTb",
                  "service_id":"NsmASEQlga",
                  "weekday":"Saturday"
               }
            ]
         ],
         "taxonomy":"food"
      },
      {
         "application_process":"Call ahead if you can; apply clean & sober. Stay up to 9 months.  Ask about 10-12 month drug recovery program.",
         "description":"One-year residential drug recovery program.  Individual and group counseling, Alcoholics Anonymous meetings, sexual addiction classes, anger management meetings, Bible studies, life skills classes, education classes, career enhancement classes, and an after care program for graduates. Our recovery program is based on the Classic Alcoholics Anonymous Way Out Program that is client driven. To learn responsibility, leadership, and stewardship they also are required to work at the mission in all capacities, including dish washing, cooking, cleaning, etc.",
         "eligibility":{
            "gender":"M"
         },
         "id":"3uOf4xwbYz",
         "location_id":"cbUguDmnTb",
         "name":"Men's only residential recovery program",
         "organization":"cbUguDmnTb",
         "schedules":[
            [
               {
                  "closes_at":1000,
                  "id":64,
                  "location_id":"cbUguDmnTb",
                  "opens_at":900,
                  "organization_id":"cbUguDmnTb",
                  "service_id":"3uOf4xwbYz",
                  "weekday":"Monday"
               },
               {
                  "closes_at":1000,
                  "id":64,
                  "location_id":"cbUguDmnTb",
                  "opens_at":900,
                  "organization_id":"cbUguDmnTb",
                  "service_id":"3uOf4xwbYz",
                  "weekday":"Tuesday"
               },
               {
                  "closes_at":1000,
                  "id":64,
                  "location_id":"cbUguDmnTb",
                  "opens_at":900,
                  "organization_id":"cbUguDmnTb",
                  "service_id":"3uOf4xwbYz",
                  "weekday":"Wednesday"
               },
               {
                  "closes_at":1000,
                  "id":64,
                  "location_id":"cbUguDmnTb",
                  "opens_at":900,
                  "organization_id":"cbUguDmnTb",
                  "service_id":"3uOf4xwbYz",
                  "weekday":"Thursday"
               },
               {
                  "closes_at":1000,
                  "id":64,
                  "location_id":"cbUguDmnTb",
                  "opens_at":900,
                  "organization_id":"cbUguDmnTb",
                  "service_id":"3uOf4xwbYz",
                  "weekday":"Friday"
               },
               {
                  "closes_at":1500,
                  "id":64,
                  "location_id":"cbUguDmnTb",
                  "opens_at":1300,
                  "organization_id":"cbUguDmnTb",
                  "service_id":"3uOf4xwbYz",
                  "weekday":"Saturday"
               }
            ]
         ],
         "taxonomy":"housing"
      }
   ]
}


export default class LocationPage extends Component {
  render() {
    const match = this.props.route.pattern.exec(window.location.pathname)
    return (
      <Layout>
        <Location location={location} />
      </Layout>
    )
  }
}
