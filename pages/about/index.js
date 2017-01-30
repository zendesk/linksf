/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '../../components/Layout';
import s from './about.css'

class AboutPage extends React.Component {

  componentDidMount() {
    document.title = 'About'
  }

  render() {
    return (
      <Layout>
        <img className={s.logo} alt="Link-Dane logo" src="/header-logo.jpg"/>
        <div className={s.inset}>
          <p>
            Link-Dane is Dane County’s first mobile-optimized website that connects homeless and low-income residents with critical and life-saving resources nearby. Focusing on basic services such as food, shelter, medical care, hygiene services, and access to technology, Link-Dane utilizes United Way 2-1-1’s vast database of resources to stream the most up-to-date information to the people who need it most.
          </p>
          <p>
            Zendesk and United Way 2-1-1 began collaborating on the Link-Dane project after being introduced by a colleague at 100 State.  After realizing the potential of the project, the two organizations began brainstorming ways to use 2-1-1 resources to create a product similar to Link-SF. After many design meetings, diving into the data and finalizing the layout, Link-Dane was launched publicly on February 22, 2016.
          </p>
          <p>
            Link-Dane is based on <a href="http://www.link-sf.org/">Link-SF</a>, a project designed and implemented by <a href="http://www.stanthonysf.org/">St. Anthony Foundation</a>, Zendesk, and user testing expert <a href="http://kimberlymccollister.com/design/">Kimberly McCollister</a>. This collaboration emerged as a result of a Community Benefits Agreement in the city of San Francisco. St. Anthony’s Tenderloin Technology Lab reached out to the tech community after observing an increase in the use of smart phones by low-income residents. Link-SF is a result of this process and is an attempt to use mobile technology to assist those most in need.
          </p>
        </div>

        <img className={s.logo} src="/zendesk.svg"/>
        <div className={s.inset}>
          <p>Zendesk is a cloud-based customer service platform. It is designed to be easy to use, easy to customize, and easy to scale. Frustrated with the state of enterprise customer service software in 2007, three Danish entrepreneurs sought out to create beautifully simple software that could change how any company interacted with its customers. Today more than 30,000 companies use Zendesk to provide service to more than 200 million people worldwide.
          Zendesk has offices in eight countries, with headquarters in San Francisco. Funding from Charles River Ventures, Benchmark Capital, Goldman Sachs, GGV Capital, Index Ventures, Matrix Partners, and Redpoint Ventures. Learn more at www.zendesk.com.</p>
        </div>

        <img className={s.logo} src="/unitedway-dane.jpg"/>
        <div className={s.inset}>
          <p>
            United Way of Dane County engages the community, mobilizes volunteers and strengthens local nonprofits to ensure Dane County is a place where everyone can succeed in school, work and life. Their efforts are focused on specific goals in the three priority areas of our community’s Agenda for Change: Education, Income and Health.
          </p>
          <p>
            United Way 2-1-1 is a department within United Way of Dane County and is part of the 2-1-1 Wisconsin network that ensures 100% 2-1-1 coverage for Wisconsin. 2-1-1 is an information and referral service that connects people to a variety of resources such as: help paying bills, housing search assistance, support groups, food pantries, community clinics, and many other services! Dial 2-1-1 for 24-hour free assistance in almost every language. Learn more at <a href="https://www.unitedwaydanecounty.org">www.unitedwaydanecounty.org</a>.
          </p>
        </div>
        <br/>
        <div className={s.inset}>
          Link-Dane is based on Link-SF which is free software. Get it <a href="http://github.com/zendesk/linksf" about="_blank">here</a>
        </div>
        <br/>
        <p className={s.credits}>
          CDN hosting provided graciously by <a href="http://www.fast.ly">fast.ly</a><br/>
          Icons by P.J. Onori, Daniel Bruce, and Dave Gandy, courtesy of <a href="http://fontello.com">fontello.com</a>
        </p>
      </Layout>
    );
  }

}

export default AboutPage;
