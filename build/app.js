require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//Register partials
Handlebars.registerPartial('filterCategories',    require('templates/_filter_categories'));
Handlebars.registerPartial('editService',         require('templates/_edit_service'));
Handlebars.registerPartial('openHours',           require('templates/_open_hours'));
Handlebars.registerPartial('nav',                 require('templates/_nav'));
Handlebars.registerPartial('queryRepresentation', require('templates/_query_representation'));

$(function() {
  window.FastClick(document.body);
  Parse.initialize('Z2l0Zn6NGrHCDoBPKUeD7Tf1fAUDaazQihQFqnL8', 'kGPp7cydleuFbhKB4mrviTmbIjrbTjhxGP4dP7Ls');
  require('routers/router').instance;
  Backbone.history.start();
});

},{"routers/router":"3BtXL3","templates/_edit_service":"eFFxjk","templates/_filter_categories":"NzBEuT","templates/_nav":"GF+cLy","templates/_open_hours":"nRddQv","templates/_query_representation":"DWnzWF"}],"lib/features":[function(require,module,exports){
module.exports=require('QqYPpM');
},{}],"QqYPpM":[function(require,module,exports){
function isMobile () {
  return window.navigator.userAgent.match(/Mobile/);
}

var Features = {
  isMobile: isMobile
};

module.exports = Features;

},{}],"routers/router":[function(require,module,exports){
module.exports=require('3BtXL3');
},{}],"3BtXL3":[function(require,module,exports){
/*globals Backbone*/

var BaseController        = require('shared/lib/base_controller'),
    DetailView            = require('views/detail_view'),
    EditView              = require('views/edit_view'),
    FilterView            = require('views/filter_view'),
    IndexView             = require('views/index_view'),
    ListView              = require('shared/views/list_view'),
    AboutView             = require('views/about_view'),
    Query                 = require('shared/lib/query'),
    applicationController = new BaseController({ el: '#linksf' }),
    facilities            = require('shared/collections/facilities').instance,
    FacilityCollection    = require('shared/collections/facilities').FacilityCollection,
    fetchLocation         = require('shared/lib/fetch_location');

var Router = Backbone.Router.extend({
  routes: {
    '':                   'index',
    'query?:queryString': 'query',
    'query':              'query',
    'detail/:id':         'detail',
    'edit/:id':           'edit',
    'about' :             'about',
    'filter':             'filter'
  },

  listView: null,

  listViewClass: ListView,
  initialize: function() {
    this.routesHit = 0;
    //keep count of number of routes handled by your application
    Backbone.history.on('route', function() { this.routesHit++; }, this);
  },
  back: function() {
    if(this.routesHit > 1) {
      //more than one route hit -> user did not land to current page directly
      window.history.back();
    } else {
      //otherwise go to the home page. Use replaceState if available so
      //the navigation doesn't create an extra history entry
      this.navigate('', {trigger:true, replace:true});
    }
  },
  index: function() {
    var indexView = new IndexView();
    return applicationController.render(indexView);
  },

  query: function(queryString) {
    var listViewClass = this.listViewClass,
        self          = this,
        queryParams;

    this.listView = this.listView || new listViewClass({ collection: facilities, isSingleton: true });

    fetchLocation().always(function(loc) {
      queryParams       = self.listView.generateQueryParams(queryString);
      queryParams.limit = 20;
      self.listView.options.categories = queryParams.filter.categories || [];
      if (loc.lon && loc.lat) {
        $.extend(queryParams, loc);
        self.listView.options.currentLocation = loc;
      }
      applicationController.render(self.listView);
      self.listView.showSpinner();
      window.scrollTo(0, 0);

      self.listView.submitQuery(queryParams).done(function(results) {
        self.listView.hideSpinner();
        window.scrollTo(0, 0); // Scroll to top
      }).fail(function() {
        console.log('submitQuery error', arguments);
        self.listView.hideSpinner();
      });
    });

  },

  filter: function() {
    var self = this;

    fetchLocation().always(function(loc) {
      self.filterView = self.filterView || new FilterView({isSingleton: true });

      if (loc.lon && loc.lat) {
        self.filterView.options.currentLocation = loc;
      }

      applicationController.render(self.filterView);
    });
  },

  renderFacility: function(facility, options) {
    var detailView = new DetailView({ model: facility.presentJSON() });
    if (options) { detailView.options = options; }
    window.scrollTo(0, 0); // Scroll to top
    return applicationController.render(detailView);
  },

  renderEdit: function(facility) {
    var editView = new EditView({ model: facility });
    return applicationController.render(editView);
  },

  detail: function(id) {
    var self = this, options = {};

    fetchLocation().always(function(loc) {
      if (loc.lon && loc.lat) {
        options.currentLocation = loc;
      }

      self._getFacility(id, function(facility) {
        self.renderFacility(facility, options);
      });
    });
  },

  edit: function(id) {
    this._getFacility(id, function(fac) {
      this.renderEdit(fac);
    }.bind(this));
  },
  about: function() {
    this.aboutView = this.aboutView || new AboutView();
    applicationController.render(this.aboutView);
  },

  _getFacility: function(id, done) {
    var facility = facilities.get(id);

    if ( !facility ) {
      //Fetch Facility from backend if not in collection
      Query.getByID(id).then(function(facility) {
        done(facility);
      });
    } else {
      done(facility);
    }
  }
});

var instance = new Router();
module.exports = { instance: instance };

},{"shared/collections/facilities":"o90k/8","shared/lib/base_controller":"bwPs82","shared/lib/fetch_location":"ZSw8ws","shared/lib/query":"lf76si","shared/views/list_view":"vZbfJV","views/about_view":"4+z0LO","views/detail_view":"mVBmkq","views/edit_view":"ORtplp","views/filter_view":"/9hwvq","views/index_view":"dcajBu"}],"templates/_edit_service":[function(require,module,exports){
module.exports=require('eFFxjk');
},{}],"eFFxjk":[function(require,module,exports){
var Handlebars = require('handlebars-runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;


  buffer += "<div class=\"service-edit-row container\">\n  <input type=\"hidden\" name=\"services[][id]\" value=\"";
  if (stack1 = helpers.objectId) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.objectId; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n  <div class=\"control-group\">\n    <label for=\"services[][category]\">Category</label>\n    <p>\n      ";
  if (stack1 = helpers.category) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.category; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n      <input type=\"hidden\" name=\"services[][category]\" value=\"";
  if (stack1 = helpers.category) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.category; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    </p>\n  </div>\n  <div class=\"control-group\">\n    <label for=\"services[][name]\">Service name</label>\n    <input type=\"text\" class=\"hasPopover\" data-trigger='hover' data-content='example: \"showers\" or \"breakfast\"' name=\"services[][name]\" value=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"span2 required\">\n  </div>\n  <div class=\"control-group\">\n    <label for=\"services[][description]\">Description</label>\n    <textarea class=\"autosize span5 hasPopover\" data-trigger='hover' data-content=\"A brief description of the service\" name=\"services[][description]\">";
  if (stack1 = helpers.description) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.description; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</textarea>\n    </div>\n  <div class=\"control-group\">\n    <label for=\"services[][notes]\">Notes</label>\n    <textarea class=\"autosize span5 hasPopover\" data-trigger='hover' data-content=\"Further detail regarding the service\" name=\"services[][notes]\">";
  if (stack1 = helpers.notes) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.notes; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</textarea>\n  </div>\n  <div>\n    Open Hours\n    ";
  stack1 = self.invokePartial(partials.editServiceHours, 'editServiceHours', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    <br/>\n    <p>\n      <a id=\"remove_category\" href=\"#\">Remove service</a>\n    </p>\n  </div>\n</div>\n";
  return buffer;
  });

},{"handlebars-runtime":42}],"templates/_edit_service_hours":[function(require,module,exports){
module.exports=require('kU1ZHm');
},{}],"kU1ZHm":[function(require,module,exports){
var Handlebars = require('handlebars-runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <tr>\n      <td class=\"label-hour\"> ";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " </td>\n      <td> <input type=\"text\" class=\"day hasPopover\" name=\"";
  if (stack1 = helpers.key) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.key; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" value=\"";
  if (stack1 = helpers.hours) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.hours; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-trigger=\"hover\" data-content=\"example: 9am-3pm, 6pm-8pm\"> </td>\n      <td> <label class=\"checkbox\"> <input type=\"checkbox\" class=\"closed\" name=\"";
  if (stack1 = helpers.key) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.key; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"> Closed </label> </td>\n    </tr>\n  ";
  return buffer;
  }

  buffer += "<div class=\"hours\">\n  <table>\n  ";
  stack1 = helpers.each.call(depth0, depth0.days, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    <tr><td colspan=\"3\">&nbsp;</td></tr>\n    <tr>\n      <td id=\"preview_label\" class=\"label-hour\">Preview</td><td colspan=\"2\" id=\"preview_hours\"></td>\n    </tr>\n  </table>\n</div>\n";
  return buffer;
  });

},{"handlebars-runtime":42}],"NzBEuT":[function(require,module,exports){
var Handlebars = require('handlebars-runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <li class=\"unselectable\">\n      <div class=\"category btn\" data-value=\"";
  if (stack1 = helpers.key) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.key; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n        <i class=\"category-icon icon-";
  if (stack1 = helpers.icon) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.icon; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></i>";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n      </div>\n    </li>\n  ";
  return buffer;
  }

  buffer += "<ul class=\"filter-categories btn-group\">\n  ";
  stack1 = helpers.each.call(depth0, depth0.categories, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>\n";
  return buffer;
  });

},{"handlebars-runtime":42}],"templates/_filter_categories":[function(require,module,exports){
module.exports=require('NzBEuT');
},{}],"templates/_nav":[function(require,module,exports){
module.exports=require('GF+cLy');
},{}],"GF+cLy":[function(require,module,exports){
var Handlebars = require('handlebars-runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      ";
  stack1 = helpers.each.call(depth0, depth0.navButtons, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <button\n          type=\"button\"\n          ";
  stack1 = helpers['if'].call(depth0, depth0.id, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          class=\"unselectable ";
  if (stack1 = helpers['class']) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0['class']; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n          ";
  if (stack1 = helpers.text) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.text; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n        </button>\n      ";
  return buffer;
  }
function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"";
  return buffer;
  }

  buffer += "<nav>\n  <div class=\"nav-container\">\n    ";
  stack1 = helpers['if'].call(depth0, depth0.navButtons, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    <a class=\"logo\" href=\"#\"><img src=\"images/linksf_logo.png\" alt=\"Link-SF\"/></a>\n  </div>\n</nav>\n";
  return buffer;
  });

},{"handlebars-runtime":42}],"templates/_open_hours":[function(require,module,exports){
module.exports=require('nRddQv');
},{}],"nRddQv":[function(require,module,exports){
var Handlebars = require('handlebars-runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  ";
  stack1 = helpers['if'].call(depth0, depth0.hours, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <tr>\n      <td class=\"label-hour\"><b>";
  if (stack1 = helpers.day) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.day; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</b>:</td>\n      <td class=\"hour\">";
  if (stack1 = helpers.hours) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.hours; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n    </tr>\n  ";
  return buffer;
  }

  buffer += "<table class=\"open-hours\">\n";
  stack1 = helpers.each.call(depth0, depth0.openHours, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</table>\n";
  return buffer;
  });

},{"handlebars-runtime":42}],"templates/_query_representation":[function(require,module,exports){
module.exports=require('DWnzWF');
},{}],"DWnzWF":[function(require,module,exports){
var Handlebars = require('handlebars-runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <i class=\"list-header-item category-icon icon-";
  if (stack1 = helpers.icon) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.icon; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></i>\n      <span>";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " </span>\n    ";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return "\n      <i class=\"list-header-item category-icon icon-th\"></i>\n      <span>All </span>\n    ";
  }

  buffer += "<div class=\"query-representation\">\n  <div class=\"query-representation-content\">\n    ";
  stack1 = helpers.each.call(depth0, depth0.searchParams, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  options = {hash:{},inverse:self.program(3, program3, data),fn:self.noop,data:data};
  if (stack1 = helpers.searchParams) { stack1 = stack1.call(depth0, options); }
  else { stack1 = depth0.searchParams; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if (!helpers.searchParams) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </div>\n</div>\n";
  return buffer;
  });

},{"handlebars-runtime":42}],"1Y6a27":[function(require,module,exports){
var Handlebars = require('handlebars-runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, self=this;


  stack1 = self.invokePartial(partials.nav, 'nav', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n<div class=\"about-us\">\n	<img src=\"images/link-sf.jpg\" alt=\"Link-SF\"/>\n	<div class=\"inset\">\n    <p>\n      Link-SF was thought up by staff at the Tenderloin Technology Lab, a partnership of San Francisco Network Ministries and the St. Anthony Foundation, as a means to connect those in need to the basic services around them.\n    </p><p>\n      Through our work, bridging the digital divide, offering free computer training and access, we observed an increase in the use of smart phones by our guests. Link-SF is our attempt to use mobile technology to assist those most in need. As community driven organizations, we strive to be on the forefront of innovative community programs.\n    </p>\n	</div>\n  <img src=\"images/zendesk.png\" alt=\"Zendesk, Inc.\"/>\n	<div class=\"inset\">\n    <p>\n      Zendesk builds software that helps any organization deliver better customer service instantly. By enabling all companies to engage directly, honestly and openly with customers, companies and customers have much more meaningful relationships, and great service becomes lifetime customer relationships. More than 30,000 companies, such as Gilt Groupe, Disney and Box, use Zendesk to provide customer service to more than 200 million people worldwide.\n    </p><p>\n      Founded in 2007, and based in San Francisco, Zendesk has offices in six countries and funding from Charles River Ventures, Benchmark Capital, Goldman Sachs, GGV Capital, Index Ventures, Matrix Partners, and Redpoint Ventures. Learn more at <a href=\"https://www.zendesk.com\">www.zendesk.com</a>.\n    </p>\n  </div>\n</div>\n\n<p class=\"credits\">\n  Icons by P.J. Onori, Daniel Bruce, and Dave Gandy, courtesy of <a href=\"http://fontello.com\">fontello.com</a>\n</p>\n";
  return buffer;
  });

},{"handlebars-runtime":42}],"templates/about":[function(require,module,exports){
module.exports=require('1Y6a27');
},{}],"QxWleN":[function(require,module,exports){
var Handlebars = require('handlebars-runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, stack2, options, self=this, functionType="function", escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n	<div class=\"admin-filter\">\n		<span>Filter by Category: </span>\n		";
  stack1 = self.invokePartial(partials.filterCategories, 'filterCategories', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " <div class=\"category btn\" data-value=\"\">All</div>\n	</div>\n";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <li class=\"facility\">\n      <p class=\"facility-name\"><a href=\"#/edit/"
    + escapeExpression(((stack1 = depth0.objectId),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"facility-link\">"
    + escapeExpression(((stack1 = depth0.name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a></p>\n      <p class=\"facility-address\">"
    + escapeExpression(((stack1 = depth0.address),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\n    </li>\n  ";
  return buffer;
  }

function program5(depth0,data) {
  
  
  return "<p class=\"not-found\">Sorry, no results found.</p>";
  }

  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.facilities),stack1 == null || stack1 === false ? stack1 : stack1.length), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n<ul class=\"admin-list facility-list\">\n  ";
  stack2 = helpers.each.call(depth0, depth0.facilities, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n  ";
  options = {hash:{},inverse:self.program(5, program5, data),fn:self.noop,data:data};
  if (stack2 = helpers.facilities) { stack2 = stack2.call(depth0, options); }
  else { stack2 = depth0.facilities; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  if (!helpers.facilities) { stack2 = blockHelperMissing.call(depth0, stack2, options); }
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n</ul>\n";
  return buffer;
  });

},{"handlebars-runtime":42}],"templates/admin_list":[function(require,module,exports){
module.exports=require('QxWleN');
},{}],"ainqDI":[function(require,module,exports){
var Handlebars = require('handlebars-runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data,depth1) {
  
  var buffer = "", stack1;
  buffer += "\n<div class=\"container\">\n  <h3>";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h3>\n\n  <div class=\"facility-info\">\n    <p class=\"title\">Hours</p>\n    <div class=\"inset\">\n      ";
  stack1 = self.invokePartial(partials.openHours, 'openHours', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n\n    <p class=\"title\">Welcome</p>\n    <div class=\"inset\">\n      <p>";
  if (stack1 = helpers.demographics) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.demographics; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</p>\n    </div>\n\n    <p class=\"title\">Services</p>\n    <div class=\"inset\">\n      ";
  stack1 = helpers.each.call(depth0, depth0.distinctCategories, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n\n    <div class=\"inset-gmap\">\n      <div id=\"detail-gmap\"></div>\n      <p>";
  if (stack1 = helpers.address) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.address; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</p>\n      ";
  stack1 = helpers['with'].call(depth0, depth0.destination, {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n\n    <div class=\"inset-call\">\n      <i class=\"icon-phone\"></i>\n      <label>Call</label>\n      ";
  stack1 = helpers['if'].call(depth0, depth1.isMobile, {hash:{},inverse:self.program(11, program11, data),fn:self.program(9, program9, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      <i class=\"icon-right-open right\"></i>\n    </div>\n\n    <div class=\"inset-directions\">\n      <i class=\"icon-compass\"></i>\n      <label>Directions</label>\n      <i class=\"icon-right-open right\"></i>\n    </div>\n\n    ";
  stack1 = helpers.each.call(depth0, depth0.services, {hash:{},inverse:self.noop,fn:self.program(13, program13, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </div>\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <span class=\"facility-services\"><i class=\"category-icon icon-";
  if (stack1 = helpers.icon) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.icon; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></i>";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n      ";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        ";
  stack1 = helpers['if'].call(depth0, depth0.showDistance, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        ";
  stack1 = helpers['if'].call(depth0, depth0.showWalkingTime, {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      ";
  return buffer;
  }
function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<p class=\"destination\">";
  if (stack1 = helpers.distance) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.distance; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " miles</p>";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<p class=\"destination\">";
  if (stack1 = helpers.walkingTime) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.walkingTime; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " minutes walking</p>";
  return buffer;
  }

function program9(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <a href=\"tel:";
  if (stack1 = helpers.phone) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.phone; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.phone) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.phone; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a>\n      ";
  return buffer;
  }

function program11(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <span>";
  if (stack1 = helpers.phone) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.phone; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n      ";
  return buffer;
  }

function program13(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <p class=\"title\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</p>\n      <div class=\"inset-services\">\n        <label>Description:</label>\n        <p>";
  if (stack1 = helpers.description) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.description; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</p>\n        ";
  stack1 = helpers['if'].call(depth0, depth0.notes, {hash:{},inverse:self.noop,fn:self.program(14, program14, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      </div>\n    ";
  return buffer;
  }
function program14(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n          <label>Notes:</label>\n         <p>";
  if (stack1 = helpers.notes) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.notes; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</p>\n        ";
  return buffer;
  }

  stack1 = self.invokePartial(partials.nav, 'nav', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n";
  stack1 = helpers['with'].call(depth0, depth0.facility, {hash:{},inverse:self.noop,fn:self.programWithDepth(1, program1, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });

},{"handlebars-runtime":42}],"templates/detail":[function(require,module,exports){
module.exports=require('ainqDI');
},{}],"templates/edit":[function(require,module,exports){
module.exports=require('UsIBUJ');
},{}],"UsIBUJ":[function(require,module,exports){
var Handlebars = require('handlebars-runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<div>\n  <dl>\n  <div id=\"errorMessages\">\n  </div>\n  <form Id=\"facilityForm\" class=\"form-horizontal\">\n    <div class=\"control-group\">\n      <label class=\"control-label\" for=\"name\">Facility Name</label>\n      <div class=\"controls\">\n        <input class=\"required\" type=\"text\" name=\"name\" value=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n      </div>\n    </div>\n\n    <div class=\"control-group\">\n      <label class=\"control-label\" for=\"address\">Address</label>\n      <div class=\"controls\">\n        <input class=\"required\" type=\"text\" name=\"address\" value=\"";
  if (stack1 = helpers.address) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.address; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n      </div>\n    </div>\n    <div class=\"control-group\">    \n      <label class=\"control-label\" for=\"city\">City</label>\n      <div class=\"controls\">\n        <input class=\"required\" type=\"text\" name=\"city\" value=\"";
  if (stack1 = helpers.city) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.city; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n      </div>\n    </div>\n\n    <div class=\"control-group\">\n      <label class=\"control-label\" for=\"phone\">Phone</label>\n      <div class=\"controls\">\n        <input type=\"text\" name=\"phone\" value=\"";
  if (stack1 = helpers.phone) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.phone; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n      </div>\n    </div>\n\n    <div class=\"control-group\">\n      <label class=\"control-label\" for=\"notes\">Notes</label>\n      <div class=\"controls\">\n        <textarea data-trigger=\"hover\" data-content=\"Brief description of the facility\" name=\"notes\" class=\"autosize span5 hasPopover\">";
  if (stack1 = helpers.notes) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.notes; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</textarea>\n      </div>\n    </div>\n\n    <div class=\"control-group\">\n      <label class=\"control-label\" for=\"gender\">Gender</label>\n      <div class=\"controls\">\n        <div class=\"hasPopover\" data-trigger=\"hover\" data-content=\"Who is welcome in the facility\" style=\"width:150px;\">\n          <label class=\"radio\"> <input type=\"radio\" name=\"gender\" id=\"gender_\" value=\"\"> Everyone </label>\n          <label class=\"radio\"> <input type=\"radio\" name=\"gender\" id=\"gender_M\" value=\"M\"> Male </label>\n          <label class=\"radio\"> <input type=\"radio\" name=\"gender\" id=\"gender_F\" value=\"F\"> Female </label>\n        </div>\n      </div>\n    </div>\n    <div class=\"control-group\">\n      <label class=\"control-label\" for=\"age\">Ages</label>\n      <div class=\"controls hasPopover\" style=\"width:150px;\" data-trigger=\"hover\" data-content=\"Who is welcome in the facility\">\n        <label class =\"checkbox\"> <input type=\"checkbox\" name=\"age\" id=\"age_everyone\" value=\"\"> Everyone </label>\n        <label class =\"checkbox\"> <input type=\"checkbox\" name=\"age\" id=\"age_C\" value=\"C\"> Children </label>\n        <label class =\"checkbox\"> <input type=\"checkbox\" name=\"age\" id=\"age_Y\" value=\"Y\"> Youth </label>\n        <label class =\"checkbox\"> <input type=\"checkbox\" name=\"age\" id=\"age_A\" value=\"A\"> Adults </label>\n        <label class =\"checkbox\"> <input type=\"checkbox\" name=\"age\" id=\"age_S\" value=\"S\"> Seniors </label>\n      </div>\n    </div>\n    <div>\n      <label class=\"control-label\">Services</label>\n      <div class=\"controls\" id=\"services\">\n        ";
  stack1 = helpers.each.call(depth0, depth0.services, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      </div>\n    </div>\n    <div class=\"control-group\">\n      <div class=\"controls\">\n        <select name=\"categories\" id=\"categories\" class=\"span2\">\n          <option value=\"food\">Food</option>\n          <option value=\"housing\">Housing</option>\n          <option value=\"hygiene\">Hygiene</option>\n          <option value=\"medical\">Medical</option>\n          <option value=\"technology\">Technology</option>\n        </select>\n        <span><a id=\"add_category\" href=\"#\">Add new service in this category</a></span>\n      </div>\n    </div>\n    <div class=\"alert\" id=\"facilitySaved\" style=\"display:none;\">\n      ";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " saved.\n    </div>\n    <div class=\"alert\" id=\"facilitySaveError\" style=\"display:none;\">\n      Error saving ";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n    </div>\n\n    <div class=\"control-group\" style=\"padding-top:20px;\">\n      <div class=\"controls\">\n        <input type=\"button\" id=\"submit\" value='save changes' class=\"btn-large\">\n      </div>\n    </div>\n  </form>\n</div>\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n          ";
  stack1 = self.invokePartial(partials.editService, 'editService', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        ";
  return buffer;
  }

  stack1 = helpers['with'].call(depth0, depth0.facility, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });

},{"handlebars-runtime":42}],"templates/filter":[function(require,module,exports){
module.exports=require('ri5Kd5');
},{}],"ri5Kd5":[function(require,module,exports){
var Handlebars = require('handlebars-runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  
  return "\n      <button data-value=\"near\" class=\"btn first\" disabled>Distance</button>\n      <button data-value=\"name\" class=\"btn last active\">Name</button>\n    ";
  }

function program3(depth0,data) {
  
  
  return "\n      <button data-value=\"near\" class=\"btn first active\">Distance</button>\n      <button data-value=\"name\" class=\"btn last\">Name</button>\n    ";
  }

function program5(depth0,data) {
  
  
  return "\n    <div class=\"filter-sort alert\">\n      <strong>Distance disabled:</strong> current location unavailable\n    </div>\n  ";
  }

  stack1 = self.invokePartial(partials.nav, 'nav', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n<div id=\"filter\">\n  <span class=\"categories-header\">Sort by</span>\n  <div class=\"filter filter-sort btn-group\" data-toggle=\"buttons-radio\">\n    ";
  stack1 = helpers['if'].call(depth0, depth0.distanceDisabled, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </div>\n\n  ";
  stack1 = helpers['if'].call(depth0, depth0.distanceDisabled, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n  <span class=\"categories-header\">Service</span>\n  ";
  stack1 = self.invokePartial(partials.filterCategories, 'filterCategories', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n  <span class=\"categories-header\">Suitable for</span>\n  <div class=\"filter filter-demographics btn-group\" data-toggle=\"buttons-checkbox\">\n    <button data-value=\"C\" class=\"btn first\">Children</button>\n    <button data-value=\"Y\" class=\"btn\">Teens/Youth</button>\n    <button data-value=\"A\" class=\"btn\">Adults</button>\n    <button data-value=\"S\" class=\"btn last\">Seniors</button>\n  </div>\n\n  <span class=\"categories-header\">Welcome</span>\n  <div class=\"filter filter-gender btn-group\" data-toggle=\"buttons-radio\">\n    <button data-value=\"A\" class=\"btn first active\">All</button>\n    <button data-value=\"M\"  class=\"btn\">Men</button>\n    <button data-value=\"F\"  class=\"btn last\">Women</button>\n  </div>\n\n  <div class=\"search\">\n    <button class=\"btn btn-info search-button\">Search</button>\n  </div>\n</div>\n";
  return buffer;
  });

},{"handlebars-runtime":42}],"templates/index":[function(require,module,exports){
module.exports=require('zNt+Bp');
},{}],"zNt+Bp":[function(require,module,exports){
var Handlebars = require('handlebars-runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, self=this;


  stack1 = self.invokePartial(partials.nav, 'nav', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n<div id=\"index\">\n  <h3 class=\"title\">What are you looking for?</h3>\n\n  <form id=\"search-form\">\n    <input type=\"submit\" style=\"display:none;\">\n    <span class=\"filter-categories\">Service</span>\n    ";
  stack1 = self.invokePartial(partials.filterCategories, 'filterCategories', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n    <div class=\"filter-name\">Search by name</div>\n    <input id=\"search-term\" class=\"search-input\" type=\"text\" placeholder=\"Enter facility name\">\n  </form>\n</div>\n\n<footer>\n  <a href=\"#/about\">About</a>\n</footer>\n";
  return buffer;
  });

},{"handlebars-runtime":42}],"templates/list":[function(require,module,exports){
module.exports=require('eS8YFF');
},{}],"eS8YFF":[function(require,module,exports){
var Handlebars = require('handlebars-runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <li class=\"facility\">\n      <a href=\"#/detail/";
  if (stack1 = helpers.objectId) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.objectId; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"facility-item-link\">\n        <i class=\"icon-right-open right chevron\"></i>\n        <div>\n          <p class=\"facility-name\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</p>\n          <span class=\"facility-info\">\n            <span class=\"label-status ";
  if (stack1 = helpers.status) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.status; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.status) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.status; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n            ";
  stack1 = helpers['if'].call(depth0, depth0.showWalkingTime, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          </span>\n          </p>\n        </div>\n        <div class=\"facility-categories\">\n          ";
  stack1 = helpers.each.call(depth0, depth0.serviceCategories, {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </div>\n      </a>\n    </li>\n  ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<span class=\"label-status\">";
  if (stack1 = helpers.walkingTime) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.walkingTime; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " minutes walking</span>";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            <span class=\"facility-services\"><i class=\"category-icon icon-";
  if (stack1 = helpers.icon) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.icon; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></i>";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n          ";
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\n    ";
  options = {hash:{},inverse:self.program(7, program7, data),fn:self.noop,data:data};
  if (stack1 = helpers.facilities) { stack1 = stack1.call(depth0, options); }
  else { stack1 = depth0.facilities; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if (!helpers.facilities) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  ";
  return buffer;
  }
function program7(depth0,data) {
  
  
  return "<p class=\"not-found\">Sorry, no results found.</p>";
  }

  stack1 = self.invokePartial(partials.nav, 'nav', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n<div id='loading-spinner'>\n  <img src=\"images/spinner.gif\">Loading...\n</div>\n";
  stack1 = self.invokePartial(partials.queryRepresentation, 'queryRepresentation', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n<ul class=\"facility-list\">\n  ";
  stack1 = helpers.each.call(depth0, depth0.facilities, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  <li id=\"load-more\" class=\"facility\"></li>\n  ";
  stack1 = helpers.unless.call(depth0, depth0.loadingResults, {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>\n";
  return buffer;
  });

},{"handlebars-runtime":42}],"views/about_view":[function(require,module,exports){
module.exports=require('4+z0LO');
},{}],"4+z0LO":[function(require,module,exports){
var AboutView = Backbone.View.extend({
  template: require('templates/about'),

  render: function() {
    this.$el.html(this.template({
      navButtons: [
        { class: 'left', id: 'backNav-button', text: 'Back' }
      ]
    }));

    this.$('#backNav-button').click(function(){
      require('routers/router').instance.back();
    });

    return this;
  }
});

module.exports = AboutView;

},{"routers/router":"3BtXL3","templates/about":"1Y6a27"}],"views/detail_view":[function(require,module,exports){
module.exports=require('mVBmkq');
},{}],"mVBmkq":[function(require,module,exports){
var Features                         = require('lib/features'),
    Hours                            = require('shared/models/hours'),
    fetchLocation                    = require('shared/lib/fetch_location'),
    calculateDistanceFromService     = require('shared/lib/distance').calculateDistanceFromService,
    calculateWalkingTimeFromDistance = require('shared/lib/distance').calculateWalkingTimeFromDistance;

var aggregateOpenHours = function(facility) {
  var mergedHours = Hours.merge.apply(
    Hours,
    facility.services.map(function(service) {
      return Hours.fromData(service.openHours);
    })
  );

  return mergedHours.humanize();
  // giant hack to get humanize() output into template-ready shape
  // var unformatted = mergedHours.humanize(),
  //     formatted = [];

  // function capitalize(string) {
  //   return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
  // }

  // ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].forEach(function(day) {
  //   if (unformatted[day].length) {
  //     formatted.push({
  //       label: capitalize(day),
  //       interval: unformatted[day]
  //     });
  //   }
  // });

  // return formatted;
};

function extractDistanceTime(location, currentLocation) {
  var destination = {};
  if (location && currentLocation) {
    destination.distance     = calculateDistanceFromService(location, currentLocation);
    destination.walkingTime  = calculateWalkingTimeFromDistance(destination.distance);
    destination.showDistance = destination.showWalkingTime = true;
  }
  return destination;
}

var DetailView = Backbone.View.extend({
  template: require('templates/detail'),

  events: {
    'render.done':             'setMap',
    'click .inset-directions': 'launchDirections',
    'click .inset-gmap':       'launchDirections'
  },

  render: function() {
    var facility = this.model,
        $mapdiv  =  this.$('#detail-gmap');

    facility.destination = extractDistanceTime(facility.location, this.options.currentLocation);
    facility.openHours   = aggregateOpenHours(facility);

    this.$el.html(this.template({
      facility:    facility,
      isMobile:    Features.isMobile(),
      navButtons: [
        { 'class': 'left', id: 'backNav-button', text: 'Back' }
      ]
    }));

    this.$('#backNav-button').click(function(){
      require('routers/router').instance.back();
    });

    _.defer(
      function(view) { view.setMap(); },
      this
    );

    return this;
  },

  launchDirections: function() {
    var isMobile = Features.isMobile(),
        dAddr = encodeURIComponent(
          this.model.address + '@' +
          this.model.location.latitude + ',' +
          this.model.location.longitude
        ),
        directionsUrl;

    if ( isMobile ) {
      directionsUrl = 'comgooglemaps://?daddr=' + dAddr;
      document.location = directionsUrl;
    } else {
      fetchLocation().done(function(loc) {
        var sAddr = '@' + loc.lat + ',' + loc.lon;
        directionsUrl = 'https://maps.google.com?daddr=' + dAddr + '&saddr=' + sAddr;
      }).fail(function() {
        directionsUrl = 'https://maps.google.com?daddr=' + dAddr;
      });
      window.open(directionsUrl, '_blank');
    }

    return false;
  },

  setMap: function(){
    var location, mapOptions, map;

    if ( !this.$('#detail-gmap') ) return;

    location = new google.maps.LatLng(
      this.model.location.latitude,
      this.model.location.longitude
    );

    mapOptions = {
      center:            location,
      zoom:              15,
      mapTypeId:         google.maps.MapTypeId.ROADMAP,
      mapTypeControl:    false,
      scrollwheel:       false,
      navigationControl: false,
      draggable:         false,
      streetViewControl: false,
      zoomControl:       false
    };

    map = new google.maps.Map(
      this.$('#detail-gmap')[0],
      mapOptions
    );

    fetchLocation().done(function(current) {
      var directionsService = new google.maps.DirectionsService(),
          directionsDisplay = new google.maps.DirectionsRenderer(),
          request;

      request = {
        origin:      new google.maps.LatLng(current.lat, current.lon),
        destination: location,
        travelMode:  google.maps.DirectionsTravelMode.WALKING
      };

      directionsDisplay.setMap(map);

      directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
        }
      });

    }).fail(function() {
      new google.maps.Marker({
        map:       map,
        position:  location,
        draggable: false
      });
    });
  }
});

module.exports = DetailView;

},{"lib/features":"QqYPpM","routers/router":"3BtXL3","shared/lib/distance":"CgvdKG","shared/lib/fetch_location":"ZSw8ws","shared/models/hours":"sxL0B6","templates/detail":"ainqDI"}],"views/edit_view":[function(require,module,exports){
module.exports=require('ORtplp');
},{}],"ORtplp":[function(require,module,exports){
var Service             = require('shared/models/service'),
    Hours               = require('shared/models/hours'),
    fetchLocation       = require('shared/lib/fetch_location'),
    editServiceTemplate = require('templates/_edit_service'),
    openHoursTemplate   = require('templates/_open_hours'),
    facilities          = require('shared/collections/facilities').instance;

function modelSaveFailCallback(args) {
  this.$("#facilitySaveError").show().focus();
  console.log("failed.");
  console.log(args);
}

function modelSaveSuccessCallback(args) {
  this.$("#facilitySaved").show().focus();
  this.$("#facilitySaved").delay(5000).fadeOut();

  console.log("saved.");
  console.log(args);
}

var days = [
  {key: "SUN", name: "Sunday"},
  {key: "MON", name: "Monday"},
  {key: "TUE", name: "Tuesday"},
  {key: "WED", name: "Wednesday"},
  {key: "THU", name: "Thursday"},
  {key: "FRI", name: "Friday"},
  {key: "SAT", name: "Saturday"}
];

function saveFacility(model, services, successCallback, failCallback) {
  model.save().then(function(foo) {
    model.get("services").forEach(function(service) {
      service.destroy();
    });

    var serviceObjects = services.map(function(serviceData) {
      var service = new Service();
      service.set("facility", model);

      delete serviceData.id;
      service.set(serviceData);

      return service;
    });

    Service.saveAll(serviceObjects, function(services, error) {
      facilities.reset();

      if (services) {
        model.set("services", services);

        model.save()
          .then(function(fac) {
            successCallback(fac);
          }, function(error) {
            failCallback(error);
          });

      } else {
        failCallback(error);
      }
    });
  },
  failCallback);
}

var EditView = Backbone.View.extend({
  template: require('templates/edit'),

  events: {
    'click #add_category':    'addCategory',
    'click #remove_category': 'removeCategory',
    'click .closed':          'previewHours',
    'blur .hours input':      'previewHours'
  },

  previewHours: function(event) {
    var openHours, mergedHours, preview, html,
        $hours = $(event.target).closest('.hours'),
        hours  = this.parseHours($hours);

    if ( !hours.isEmpty() )  {
      openHours = hours.serialize();
    }

    mergedHours = Hours.merge.apply(
      Hours,
      [ { hours: openHours } ]
    );

    preview = mergedHours.humanize();
    html    = openHoursTemplate({ openHours: preview });
    $hours.find('#preview_hours').html(html);
  },

  addCategory: function(argument) {
    var context = { category: this.$('#categories').val(), days: days };
    var service = $(editServiceTemplate(context));

    this.setupServiceElements(service);
    $('#services').append(service);
    return false;
  },

  removeCategory: function(event) {
    var parent = this.$(event.target).closest('.service-edit-row');
    parent.remove();
    return false;
  },

  parseHourElement: function(hours, el, options) {
    options = options || {};
    var closedCheckbox = $(el).next("input.closed");

    if ( closedCheckbox.prop("checked") || el.value === "" || el.value === "CLOSED" ) {
      return;
    }

    try {
      hours.addDay(el.name, el.value);
    } catch(err) {
      if (options.validate) {
        $(el).closest("tr").after($("<tr class='dayError'></tr>").html('<td></td><td colspan="2">' + err.message + '</td>'));
      }
    }
  },

  parseHours: function(container, options) {
    options = options || {};
    var serviceHours = new Hours();

    _($(container).find('input.day')).each(function(el) {
      this.parseHourElement(serviceHours, el, options);
    }.bind(this));

    return serviceHours;
  },

  setupServiceElements: function(container) {
    $(container).find("input.day").first().attr("placeholder", "example: 9am-3pm, 6pm-8pm");
    $(container).find("input.day").blur(function(ev) {
      this.parseHourElement(new Hours(), ev.target, { validate: true });
      return true;
    }.bind(this));

    $(container).find("input.closed").change(function(ev) {
      var el = ev.target;
      var textBox = $(el).closest("tr").find("input.day[name='" + el.name + "']");

      $(textBox).prop("disabled", $(el).prop("checked"));
      if ( $(el).prop("checked") ) {
        textBox.val("CLOSED");
      } else {
        textBox.val("");
      }
    });

    $(container).find("input.day").keyup(function(ev) {
      $(ev.target).closest("tr").next("tr.dayError").remove();
    });
  },

  setupForm: function() {
    var g = this.model.get('gender'),
        self = this,
        el;

    el = self.$('#gender_' + (g ? g : ''));
    el.prop('checked', true);

    self.$("#age_everyone").click(function() {
      self.$('[name="age"]').prop('checked', $(self).prop('checked'));
    });

    if ( self.model.get("age") ) {
      _(self.model.get("age")).each(function(age) {
        self.$("#age_" + age.toUpperCase()).prop('checked', true);
      });
    } else {
      self.$("#age_everyone").click();
    }

    self.$('#submit').click(function() {
      var formValues = self.$('#facilityForm').serializeObject();

      if ( !self.validateForm(formValues) )
        return false;

      fetchLocation(formValues.address + ", " + formValues.city).then(
        function(loc) {
          formValues.location = new Parse.GeoPoint({latitude: loc.lat, longitude: loc.lon});
          console.log("location ", formValues.location);
          self.saveForm(formValues);
        },

        function(err) {
          self.addErrorToInput($("input[name='address']"));
          $("#errorMessages").html("<ul><li>Could not find address</li></ul>");
        }
      );
    });

    // setup all the service elements
    self.setupServiceElements(self.el);
  },

  addErrorToInput: function(input) {
    var controlGroup = $(input).parents(".control-group");
    controlGroup.addClass("error");
    $(input).focus(function() { controlGroup.removeClass("error"); });
    $('html, body').animate({
        scrollTop: 0
    }, 500);
  },

  validateForm: function(formValues) {
    var errors = [];
    _($("input.required")).each(function(input) {
      if ( $(input).val() === "" ) {
        this.addErrorToInput(input);
        errors.push("Field missing: " + $(input).parents(".control-group").find("label").html());
      }
    }.bind(this));

    if ( !formValues.services ) {
      errors.push("Please add at least one service");
    }

    var ul = $("<ul>");

    errors.forEach(function(msg) {
      ul.append($("<li>" + msg + "</li>"));
    });

    $("#errorMessages").html(ul);
    return errors.length === 0;
  },

  serializeAges: function() {
    var ages;
    if ( this.$("#age_everyone").prop('checked') ) {
      return null;
    }

    ages = this.$("[name=age]input:checked").map(function(cb) {
      return $(cb).attr('value');
    });

    return _(ages).compact();
  },

  saveForm: function(formValues) {
    var servicePromises = [];

    // the days-of-the-week inputs are named dumbly, get rid of them
    days.forEach(function(d) { delete formValues[d.key]; });

    if ( formValues.gender === "" ) {
      formValues.gender = null;
    }

    formValues.age = this.serializeAges();

    var services = _.clone(formValues.services);

    _.each(services, function(service, i) {
      var hours = this.parseHours($('.hours')[i], { validate: true });
      if ( !hours.isEmpty() )  {
        service.openHours = hours.serialize();
      }
    }.bind(this));

    delete formValues.services;
    this.model.set(formValues);

    var save = _.bind(saveFacility, this);
    save(this.model, services, _.bind(modelSaveSuccessCallback, this), _.bind(modelSaveFailCallback, this));
  },

  render: function() {

    var templateData = this.model.presentJSON(),
        Hours = require('shared/models/hours');

    templateData.services.forEach(function(service) {
      var openHours = Hours.fromData(service.openHours).humanize();

      service.days = days.map(function(day, index) {
        return {key: day.key, name: day.name, hours: openHours[index].hours};
      });
    });

    $(this.el).html(this.template({facility: templateData}));
    this.$('.hasPopover').popover();

    this.setupForm();

    _.defer(
      function(view) {
        view.$('.autosize').autosize();
      },
      this
    );

    return this;
  }
});

module.exports = EditView;

},{"shared/collections/facilities":"o90k/8","shared/lib/fetch_location":"ZSw8ws","shared/models/hours":"sxL0B6","shared/models/service":"1C0T0C","templates/_edit_service":"eFFxjk","templates/_open_hours":"nRddQv","templates/edit":"UsIBUJ"}],"views/filter_view":[function(require,module,exports){
module.exports=require('/9hwvq');
},{}],"/9hwvq":[function(require,module,exports){
function navigate(options) {
  var route  = 'query',
      params = [],
      router = require('routers/router').instance;

  if (options.categories.length > 0) {
     params.push("categories=" + options.categories.join(","));
  }

  if (options.demographics.length > 0) {
    params.push("demographics=" + options.demographics.join(","));
  }

  if (options.gender) {
    params.push("gender=" + options.gender);
  }

  if (params.sort) {
    params.push("sort=" + options.sort);
  }

  if (params.length > 0) {
    route = route + "?" + params.join("&");
  }

  router.navigate(route, { trigger: true });
}

var FilterView = Backbone.View.extend({
  template: require('templates/filter'),
  events: {
    "click .search .search-button": "submitSearch",
    "click #backNav-button": "goBack",
    "click #searchNav-button": "submitSearch",
    'click ul.filter-categories .category': 'toggleCategory'
  },

  toggleCategory: function(event) {
    $(event.target).toggleClass('active');
  },

  render: function() {
    var distanceDisabled = this.options.currentLocation ? false : 'disabled';

    this.$el.html(this.template({
      navButtons: [
        {class: 'left', id: 'backNav-button', text: 'Back'},
        {class: 'right', id: 'searchNav-button', text: 'Search'}
      ],
      categories:       require('shared/lib/categories'),
      filter:           true,
      distanceDisabled: distanceDisabled
    }));
    return this;
  },

  goBack: function() {
    var router = require('routers/router').instance;
    router.back();
  },

  submitSearch: function() {
    var categories   = [],
        demographics = [],
        gender = null,
        sort = null;

    categories = this.$('.filter-categories .btn.active').toArray().map(function(el) {
      return $(el).data('value');
    });

    demographics = this.$(".filter-demographics .btn.active").toArray().map(function(el) {
      return $(el).data("value");
    });

    gender = this.$(".filter-gender .btn.active").data("value");

    if(gender === "A") {
      gender = null;
    }

    sort = this.$(".filter-sort .btn.active").data("value");

    navigate({
      categories: categories,
      demographics: demographics,
      gender: gender,
      sort: sort
    });
  }
});

module.exports = FilterView;

},{"routers/router":"3BtXL3","shared/lib/categories":"JvcSSz","templates/filter":"ri5Kd5"}],"views/index_view":[function(require,module,exports){
module.exports=require('dcajBu');
},{}],"dcajBu":[function(require,module,exports){
var fetchLocation = require('shared/lib/fetch_location');

function navigate(categories, searchTerm) {
  var router = require('routers/router').instance,
      route  = 'query?categories=' + categories.join(',');

  if ( searchTerm ) {
    route += '&search=' + encodeURIComponent(searchTerm);
    router.navigate(route, { trigger: true });
  } else {
    fetchLocation().always(function(loc) {
      if (loc.lon && loc.lat) { route += '&sort=near'; }
      router.navigate(route, { trigger: true });
    });
  }

}

var IndexView = Backbone.View.extend({
  template: require('templates/index'),

  events: {
    'submit #search-form': 'submit',
    'click ul.filter-categories .btn': 'submit'
  },

  render: function() {
    this.$el.html(this.template({
      filter: false,
      categories: require('shared/lib/categories')
    }));
    return this;
  },

  submit: function(event) {
    var searchTerm = this.$('#search-term').val(),
        categories = [ $(event.target).data('value') ];

    navigate(categories, searchTerm);
    return false;
  }
});

module.exports = IndexView;

},{"routers/router":"3BtXL3","shared/lib/categories":"JvcSSz","shared/lib/fetch_location":"ZSw8ws","templates/index":"zNt+Bp"}],42:[function(require,module,exports){
/*

Copyright (C) 2011 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

// lib/handlebars/browser-prefix.js
var Handlebars = {};
module.exports = Handlebars;

(function(Handlebars, undefined) {
;
// lib/handlebars/base.js

Handlebars.VERSION = "1.0.0";
Handlebars.COMPILER_REVISION = 4;

Handlebars.REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '>= 1.0.0'
};

Handlebars.helpers  = {};
Handlebars.partials = {};

var toString = Object.prototype.toString,
    functionType = '[object Function]',
    objectType = '[object Object]';

Handlebars.registerHelper = function(name, fn, inverse) {
  if (toString.call(name) === objectType) {
    if (inverse || fn) { throw new Handlebars.Exception('Arg not supported with multiple helpers'); }
    Handlebars.Utils.extend(this.helpers, name);
  } else {
    if (inverse) { fn.not = inverse; }
    this.helpers[name] = fn;
  }
};

Handlebars.registerPartial = function(name, str) {
  if (toString.call(name) === objectType) {
    Handlebars.Utils.extend(this.partials,  name);
  } else {
    this.partials[name] = str;
  }
};

Handlebars.registerHelper('helperMissing', function(arg) {
  if(arguments.length === 2) {
    return undefined;
  } else {
    throw new Error("Missing helper: '" + arg + "'");
  }
});

Handlebars.registerHelper('blockHelperMissing', function(context, options) {
  var inverse = options.inverse || function() {}, fn = options.fn;

  var type = toString.call(context);

  if(type === functionType) { context = context.call(this); }

  if(context === true) {
    return fn(this);
  } else if(context === false || context == null) {
    return inverse(this);
  } else if(type === "[object Array]") {
    if(context.length > 0) {
      return Handlebars.helpers.each(context, options);
    } else {
      return inverse(this);
    }
  } else {
    return fn(context);
  }
});

Handlebars.K = function() {};

Handlebars.createFrame = Object.create || function(object) {
  Handlebars.K.prototype = object;
  var obj = new Handlebars.K();
  Handlebars.K.prototype = null;
  return obj;
};

Handlebars.logger = {
  DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, level: 3,

  methodMap: {0: 'debug', 1: 'info', 2: 'warn', 3: 'error'},

  // can be overridden in the host environment
  log: function(level, obj) {
    if (Handlebars.logger.level <= level) {
      var method = Handlebars.logger.methodMap[level];
      if (typeof console !== 'undefined' && console[method]) {
        console[method].call(console, obj);
      }
    }
  }
};

Handlebars.log = function(level, obj) { Handlebars.logger.log(level, obj); };

Handlebars.registerHelper('each', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  var i = 0, ret = "", data;

  var type = toString.call(context);
  if(type === functionType) { context = context.call(this); }

  if (options.data) {
    data = Handlebars.createFrame(options.data);
  }

  if(context && typeof context === 'object') {
    if(context instanceof Array){
      for(var j = context.length; i<j; i++) {
        if (data) { data.index = i; }
        ret = ret + fn(context[i], { data: data });
      }
    } else {
      for(var key in context) {
        if(context.hasOwnProperty(key)) {
          if(data) { data.key = key; }
          ret = ret + fn(context[key], {data: data});
          i++;
        }
      }
    }
  }

  if(i === 0){
    ret = inverse(this);
  }

  return ret;
});

Handlebars.registerHelper('if', function(conditional, options) {
  var type = toString.call(conditional);
  if(type === functionType) { conditional = conditional.call(this); }

  if(!conditional || Handlebars.Utils.isEmpty(conditional)) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

Handlebars.registerHelper('unless', function(conditional, options) {
  return Handlebars.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn});
});

Handlebars.registerHelper('with', function(context, options) {
  var type = toString.call(context);
  if(type === functionType) { context = context.call(this); }

  if (!Handlebars.Utils.isEmpty(context)) return options.fn(context);
});

Handlebars.registerHelper('log', function(context, options) {
  var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
  Handlebars.log(level, context);
});
;
// lib/handlebars/utils.js

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

Handlebars.Exception = function(message) {
  var tmp = Error.prototype.constructor.apply(this, arguments);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }
};
Handlebars.Exception.prototype = new Error();

// Build out our basic SafeString type
Handlebars.SafeString = function(string) {
  this.string = string;
};
Handlebars.SafeString.prototype.toString = function() {
  return this.string.toString();
};

var escape = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;"
};

var badChars = /[&<>"'`]/g;
var possible = /[&<>"'`]/;

var escapeChar = function(chr) {
  return escape[chr] || "&amp;";
};

Handlebars.Utils = {
  extend: function(obj, value) {
    for(var key in value) {
      if(value.hasOwnProperty(key)) {
        obj[key] = value[key];
      }
    }
  },

  escapeExpression: function(string) {
    // don't escape SafeStrings, since they're already safe
    if (string instanceof Handlebars.SafeString) {
      return string.toString();
    } else if (string == null || string === false) {
      return "";
    }

    // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.
    string = string.toString();

    if(!possible.test(string)) { return string; }
    return string.replace(badChars, escapeChar);
  },

  isEmpty: function(value) {
    if (!value && value !== 0) {
      return true;
    } else if(toString.call(value) === "[object Array]" && value.length === 0) {
      return true;
    } else {
      return false;
    }
  }
};
;
// lib/handlebars/runtime.js

Handlebars.VM = {
  template: function(templateSpec) {
    // Just add water
    var container = {
      escapeExpression: Handlebars.Utils.escapeExpression,
      invokePartial: Handlebars.VM.invokePartial,
      programs: [],
      program: function(i, fn, data) {
        var programWrapper = this.programs[i];
        if(data) {
          programWrapper = Handlebars.VM.program(i, fn, data);
        } else if (!programWrapper) {
          programWrapper = this.programs[i] = Handlebars.VM.program(i, fn);
        }
        return programWrapper;
      },
      merge: function(param, common) {
        var ret = param || common;

        if (param && common) {
          ret = {};
          Handlebars.Utils.extend(ret, common);
          Handlebars.Utils.extend(ret, param);
        }
        return ret;
      },
      programWithDepth: Handlebars.VM.programWithDepth,
      noop: Handlebars.VM.noop,
      compilerInfo: null
    };

    return function(context, options) {
      options = options || {};
      var result = templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);

      var compilerInfo = container.compilerInfo || [],
          compilerRevision = compilerInfo[0] || 1,
          currentRevision = Handlebars.COMPILER_REVISION;

      if (compilerRevision !== currentRevision) {
        if (compilerRevision < currentRevision) {
          var runtimeVersions = Handlebars.REVISION_CHANGES[currentRevision],
              compilerVersions = Handlebars.REVISION_CHANGES[compilerRevision];
          throw "Template was precompiled with an older version of Handlebars than the current runtime. "+
                "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").";
        } else {
          // Use the embedded version info since the runtime doesn't know about this revision yet
          throw "Template was precompiled with a newer version of Handlebars than the current runtime. "+
                "Please update your runtime to a newer version ("+compilerInfo[1]+").";
        }
      }

      return result;
    };
  },

  programWithDepth: function(i, fn, data /*, $depth */) {
    var args = Array.prototype.slice.call(arguments, 3);

    var program = function(context, options) {
      options = options || {};

      return fn.apply(this, [context, options.data || data].concat(args));
    };
    program.program = i;
    program.depth = args.length;
    return program;
  },
  program: function(i, fn, data) {
    var program = function(context, options) {
      options = options || {};

      return fn(context, options.data || data);
    };
    program.program = i;
    program.depth = 0;
    return program;
  },
  noop: function() { return ""; },
  invokePartial: function(partial, name, context, helpers, partials, data) {
    var options = { helpers: helpers, partials: partials, data: data };

    if(partial === undefined) {
      throw new Handlebars.Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, options);
    } else if (!Handlebars.compile) {
      throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    } else {
      partials[name] = Handlebars.compile(partial, {data: data !== undefined});
      return partials[name](context, options);
    }
  }
};

Handlebars.template = Handlebars.VM.template;
;
// lib/handlebars/browser-suffix.js
})(Handlebars);
;

},{}],43:[function(require,module,exports){
//     Underscore.js 1.5.2
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.5.2';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? void 0 : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed > result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array, using the modern version of the 
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from an array.
  // If **n** is not specified, returns a single random element from the array.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (arguments.length < 2 || guard) {
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, value, context) {
      var result = {};
      var iterator = value == null ? _.identity : lookupIterator(value);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n == null) || guard ? array[0] : slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) {
      return array[array.length - 1];
    } else {
      return slice.call(array, Math.max(array.length - n, 0));
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, "length").concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error("bindAll must be passed function names");
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    return function() {
      context = this;
      args = arguments;
      timestamp = new Date();
      var later = function() {
        var last = (new Date()) - timestamp;
        if (last < wait) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) result = func.apply(context, args);
        }
      };
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

}).call(this);

},{}],"shared/collections/facilities":[function(require,module,exports){
module.exports=require('o90k/8');
},{}],"o90k/8":[function(require,module,exports){
var Facility = require('shared/models/facility');

var Facilities = Parse.Collection.extend({
  model: Facility
});

var instance = new Facilities();
module.exports = { instance: instance };

},{"shared/models/facility":"8iYNcH"}],"bwPs82":[function(require,module,exports){
var BaseController = function (options) {
  options = options || {};
  var currentView,
      el = options.el || 'body';

  function removeView (view) {
    view.remove();
  }

  function render (view) {
    if (currentView && !currentView.options.isSingleton) {
      currentView.remove();
    }

    currentView = view;
    view.delegateEvents(view.events);
    return $(el).html(view.render().el);
  }

  this.render = render;
};

module.exports = BaseController;

},{}],"shared/lib/base_controller":[function(require,module,exports){
module.exports=require('bwPs82');
},{}],"shared/lib/browse":[function(require,module,exports){
module.exports=require('/UqqYM');
},{}],"/UqqYM":[function(require,module,exports){
var Facility = require('shared/models/facility'),
    _ = require('underscore');

module.exports = function (params, callbacks) {

  // all params are optional, NULL or missing means don't filter
  // {
  //  sort: 'near'|'name'
  //  limit: int (default 10)
  //  filter:
  //    {isOpen: true,
  //     gender: 'M'|'F'
  //     age: ['C', 'Y', 'A', 'S'] // children, youth, adult, senior
  //     categories: ['medical', 'hygiene', 'food', 'shelter']
  //    }
  //  }
  //
  //

  var sort = params.sort || 'name';
  var limit = params.limit || 10;
  var filter = params.filter || {};
  var offset = params.offset || 0;
  var search = params.search;

  var q = new Parse.Query(Facility);

  if ( sort === 'near' ) {
    if ( !(params.lat && params.lon) ) {
      return callbacks.error("Please provide a lat and lon");
    }

    var geopoint = new Parse.GeoPoint(params.lat, params.lon);
    q.near('location', geopoint);
  } else {
    q.ascending('name');
  }

  if ( search ) {
    q.matches('name', search, "i");
  }

  q.limit(5000);
  q.include('services');
  q.skip(offset);

  var resp = [];

  q.find().then(function(results) {
    var filteredResults = [];

    results.forEach(function(f) {
      if ( filteredResults.length >= limit ) {
        return;
      }

      if ( f.matchesFilter(filter) ) {
        filteredResults.push(f);
      }
      offset++;
    });
    callbacks.success([offset].concat(filteredResults));
  }, function(err) {
    callbacks.error(err);
  });
};


},{"shared/models/facility":"8iYNcH","underscore":43}],"JvcSSz":[function(require,module,exports){
module.exports = [
  { icon: 'home',    key: 'housing',    title: 'Housing' },
  { icon: 'food',    key: 'food',       title: 'Food' },
  { icon: 'plus',    key: 'medical',    title: 'Medical' },
  { icon: 'droplet', key: 'hygiene',    title: 'Hygiene' },
  { icon: 'desktop', key: 'technology', title: 'Technology' }
];

},{}],"shared/lib/categories":[function(require,module,exports){
module.exports=require('JvcSSz');
},{}],"CgvdKG":[function(require,module,exports){
var maps = google.maps,
    LatLng = maps.LatLng;

function calculateDistanceFromService(location, currentLocation) {
  var pos1     = new LatLng(currentLocation.lat, currentLocation.lon),
      pos2     = new LatLng(location.latitude, location.longitude),
      distance = maps.geometry.spherical.computeDistanceBetween(pos1, pos2);
  distance = distance/1000*0.62137; // meters to miles
  distance = +distance.toFixed(2); // precision after decimal point
  return distance;
}

function calculateWalkingTimeFromDistance(distance) {
  // 2.80 mph - older individuals average walking speed (wikipedia)
  return Math.ceil(60*distance/2.5);
}

module.exports = {
  calculateDistanceFromService:     calculateDistanceFromService,
  calculateWalkingTimeFromDistance: calculateWalkingTimeFromDistance
};

},{}],"shared/lib/distance":[function(require,module,exports){
module.exports=require('CgvdKG');
},{}],"ZSw8ws":[function(require,module,exports){
var maps = google.maps,
    Geocoder = maps.Geocoder,
    geocoder;

var cachedPosition = null;

function fetchCurrentLocation(deferred) {
  if ( cachedPosition ) {
    return deferred.resolve(cachedPosition);
  }
  if ( navigator.geolocation ) {
    navigator.geolocation.getCurrentPosition(function(position) {
      cachedPosition = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      };

      deferred.resolve(cachedPosition);
    }, function(error) {
      deferred.reject(error);
    });
  } else {
    deferred.reject();
  }
}

function fetchLocationForAddress(address, deferred) {
  if(!geocoder) {
    geocoder = new Geocoder();
  }

  geocoder.geocode({
    address: address
  }, function(results, status) {
    console.log(status, results);
    if (status == maps.GeocoderStatus.OK) {
      var location = results[0].geometry.location,
          lat      = location.lat(),
          lon      = location.lng();
      deferred.resolve({lat: lat, lon: lon});
    } else {
      deferred.reject();
    }
  });
}

module.exports = function(address) {
  var deferred = $.Deferred();
  if(address) {
    fetchLocationForAddress(address, deferred);
  } else {
    fetchCurrentLocation(deferred);
  }

  return deferred.promise();
};

},{}],"shared/lib/fetch_location":[function(require,module,exports){
module.exports=require('ZSw8ws');
},{}],"shared/lib/query":[function(require,module,exports){
module.exports=require('lf76si');
},{}],"lf76si":[function(require,module,exports){
/*globals alert*/
var _             = require('underscore'),
    Facility      = require('shared/models/facility');

var queryFunction = function(runWhere) {
  return _.partial(Parse.Cloud.run, "browse");
};

var submit = function(params) {
  // to keep track of when it finishes
  var deferred = $.Deferred();

  if ( !params.lat && params.sort == "near" ) {
    params.sort = "name";
  }
  performQuery(params, deferred);

  return deferred.promise();
};

var performQuery = function(params, deferred) {
  var query = queryFunction('browser');

  query(params, {
    success: function(result) {
      deferred.resolve({data: result.slice(1), offset: result[0]});
    },

    error: function(err) {
      deferred.reject(err);
    }
  });
};

// TODO -- hoist this up a layer into "browse" -- or wherever we keep the direct parse communication lib.
var getByID = function(id) {
  var deferred = $.Deferred();

  var q = new Parse.Query(Facility);
  q.include("services");
  q.get(id, {
    success: function(result) {
      deferred.resolve(result);
    },
    error: function(err) {
      deferred.reject(err);
    }
  });

  return deferred.promise();
};

module.exports = { submit: submit, getByID: getByID };

},{"shared/models/facility":"8iYNcH","underscore":43}],"shared/lib/query_param_parser":[function(require,module,exports){
module.exports=require('tSWALn');
},{}],"tSWALn":[function(require,module,exports){
/* globals document */

function decode(s) {
  return decodeURIComponent((s || '').replace( /\+/g, " " ));
}

module.exports = function(queryString) {
  var result = {}, keyAndValue, key, value;

  queryString = queryString || ( document.location.search || '' ).slice( 1 );
  if ( queryString.indexOf( '=' ) < 0 ) { return result; }

  var keyValuePairs = queryString.split( '&' );

  for ( var i = 0; i < keyValuePairs.length; i++ ) {
    keyAndValue = keyValuePairs[ i ].split( '=' );
    key   = decode( keyAndValue[ 0 ] );
    value = decode( keyAndValue[ 1 ] );
    result[ key ] = value;
  }

  return result;
};

},{}],"shared/models/facility":[function(require,module,exports){
module.exports=require('8iYNcH');
},{}],"8iYNcH":[function(require,module,exports){
var _     = require('underscore'),
    Hours = require('shared/models/hours'),
    CATEGORIES = require('shared/lib/categories');

module.exports = Parse.Object.extend('Facility', {
  initialize: function() {
    this.set("services", []);
  },
  // no gender restriction or gender == self.gender
  matchesGender: function(targetGender) {
    var g = this.get('gender');

    if ( !g || !targetGender )  {
      return true;
    } else {
      return g.toUpperCase() == targetGender.toUpperCase();
    }
  },

  presentJSON: function() {
    var asJSON = this.toJSON();
    asJSON.services = this.get('services').map(function(service) {
      return service.toJSON();
    });
    asJSON.demographics = this.demographics();
    asJSON.distinctCategories = this.distinctCategories();
    return asJSON;
  },

  matchesAges: function(ages) {
    var a = this.get('age');
    if ( !ages || !a ) {
      return true;
    }

    return _.any(_.compact(ages), function(targetAge) {
      return _.include(a, targetAge);
    });
  },

  matchesFilter: function(filter) {
    var match = true;

    if ( !filter ) {
      return true;
    }

    match &= this.matchesGender(filter.gender);
    match &= this.matchesAges(filter.age);
    match &= this.hasServiceInCategories(filter.categories);
    return match;
  },

  status: function() {
    var open;

    if ( this._status ) return this._status;

    open = this.hasOpenService(new Date());

    if ( open === true ) {
      this._status = 'open';
    } else if ( open === false ) {
      this._status = 'closed';
    } else {
      this._status = 'unknown';
    }

    return this._status;
  },

  hasOpenService: function(time) {
    var services = this.get('services');
    try {
      return _.any(services, function(service) {
        return service.hours().within(time);
      });
    } catch(e) {
      console.log(e);
      return null;
    }
  },

  hasServiceInCategories: function(categories) {
    if ( !categories )  {
      return true;
    }

    var services = this.get('services');
    return _.any(_.compact(categories), function(targetCategory) {
      return _.any(services, function(facService) {
        return facService.get("category") === targetCategory;
      });
    });
  },

  age_as_string: function(input) {
    switch ( input.toUpperCase() ) {
      case "C":
        return "children";
      case "Y":
        return "teens";
      case "A":
        return "adults";
      case "S":
        return "seniors";
    }
  },

  demographics: function() {
    var g, a, output = "";
    if ( !this.get('age') && !this.get('gender') ) {
      output = "Anyone";
    } else {
      if ( (g = this.get('gender') ) ) {
        if ( this.get('age') ) {
          output = g.toUpperCase() == "F" ? "Female " : "Male ";
        } else {
          output = "Only " + (g.toUpperCase() == "F" ? "women" : "men");
        }
      } else {
        output = "All ";
      }

      if ( (a = this.get('age') ) ) {
        // C-Y-A-S
        var translated = _(a).map(this.age_as_string);
        output += _(translated).join(", ");
      }
    }
    return output;
  },

  distinctCategories: function() {
    var s = [], h = {};
    _.each(this.get("services"), function(service) {
      var cat = service.get("category");
      if ( !h[cat] ) {
        h[cat] = 1;
        s.push(_.find(CATEGORIES, function(e) { return e.key == cat; }));
      }
    });
    return s;
  }
});

},{"shared/lib/categories":"JvcSSz","shared/models/hours":"sxL0B6","underscore":43}],"sxL0B6":[function(require,module,exports){
var _ = require('underscore');

var days = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6
};

var daysInverse = _.invert(days);

var dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

function fail(str) {
  throw new Error("Invalid time string: " + str);
}

var parseTime = function parseTime(str) {
  var match = str.match(/^(\d\d?)(:\d\d)?\s*((?:A|P)M)$/i),
      hour, min, pm;

  if(!match || !match[1] || !match[3]) {
    fail(str);
  }

  hour = parseInt(match[1], 10);

  if(match[2]) {
    min = parseInt(match[2].replace(":",""), 10);
  } else {
    min = 0;
  }

  pm = !!match[3].match(/PM/i);

  if(pm && hour !== 12) {
    return [(hour + 12), min];
  }

  if(!pm && hour == 12) {
    return [0, min];
  }

  return [hour, min];

};

var timeToOffset = function(time) {
  return time.getHours()*100 + time.getMinutes();
};

var timeStringToOffset = function(timeString) {
  var parsed = parseTime(timeString),
      val = parsed[0]*100 + parsed[1];

  return val;
};


/* Input format:

 {
   "Mon": "9:00AM-5:00PM",
   "Tue": "9:00AM-11:00AM,1:00PM-5:00PM",
   "Wed": "9:00AM-5:00PM",
   "Thu": "9:00AM-5:00PM",
   "Fri": "9:00AM-5:00PM",
   "Sat": "9:00AM-11:00AM",
   "Sun": "9:00AM-11:00AM"
 }

*/

var Hours = function Hours(hours){
  var processed = {}, day;
  this.hours = hours || {};
  for(var k in hours) {
    if(!hours.hasOwnProperty(k)) { continue; }
    day = days[k.toUpperCase()];

    processed[day] = this.parseDay(hours[k]);
  }

  this.hours = processed;
};

Hours.fromData = function(data) {
  var hours = new Hours();
  hours.hours = data || {};
  return hours;
};

Hours.prototype.addDay = function(day, str) {
  var dayNum = days[day.toUpperCase()];
  this.hours[dayNum] = this.parseDay(str);
};

Hours.prototype.parseDay = function(str) {
  var intervals, interval, result = [], times = [];
  intervals = str.split(',');

  for(var idx = 0; idx < intervals.length; idx++) {

    interval = intervals[idx].trim().split(/\s?-\s?/);
    if(!interval[1]) { fail(str); }

    times = [ timeStringToOffset(interval[0]),
              timeStringToOffset(interval[1]) ];

    if(times[0] > 2400 || times[1] > 2400) { fail(str); }

    if(times[0] == times[1] && times[0] !== 0) { fail(str); }

    if(times[0] >= times[1] && times[1] !== 0) { fail(str); }

    result.push(times);
  }

  return result;
};

/*
  mergeIntervals - take a set of open intervals and union them

  1. Flatten [[S1, E1], [S2, E2], [S3, E3]] onto a timeline.

    S1, E1, etc are all HHMM sortable integers; 1700 for 5PM.
    S1--S2--E1--E2--S3--E3

  2. Walk the timeline, opening/closing intervals at the shallowest level of nesting

    S1 - depth 0 -> 1, open interval
    S2 - depth 1 -> 2
    E1 - depth 2 -> 1
    E2 - depth 1 -> 0, close interval
    S3 - depth 0 -> 1, open interval
    E3 - depth 1 -> 0, close interval

  return merged intervals: [[S1, E2], [S3, E3]]
*/
function mergeIntervals(intervals) {
  var stack = [],
      mergedIntervals = [];

  buildTimeline(intervals).forEach(function(boundary) {
    if ( boundary.side === 'start' ) {
      stack.push(boundary);
    } else {
      if ( stack.length === 1 ) {
        mergedIntervals.push([stack.pop().time, boundary.time]);
      } else {
        stack.pop();
      }
    }
  });

  return mergedIntervals;
}

function buildTimeline(intervals) {
  var labeledBoundaries, boundaries, timeline;

  // convert intervals to labeled start/end boundary objects
  labeledBoundaries = intervals.map(function(interval) {
    return [
      { side: 'start', time: parseInt(interval[0], 10) },
      { side: 'end',   time: parseInt(interval[1], 10) }
    ];
  });

  // flatten interval boundaries to get a sortable list
  boundaries = _.flatten(labeledBoundaries);

  // sort boundaries by timestamp, generating timeline
  timeline = boundaries.sort(function(a, b) {
    return a.time - b.time;
  });

  return timeline;
}

Hours.merge = function() {
  var data = {};
  Array.prototype.slice.call(arguments).forEach(function(item) {
    Object.keys(item.hours).forEach(function(day) {
      data[day] = (data[day] || []).concat(item.hours[day] || []);
    });
  });

  return Hours.fromData(data).merge();
};

Hours.prototype.merge = function() {
  var data = {};
  Object.keys(this.hours).forEach(function(day) {
    data[day] = mergeIntervals(this.hours[day]);
  }, this);

  return Hours.fromData(data);
};

function humanizeInterval(intervals) {
  return intervals.map(function(time) {
    //1200 -> 12:00PM
    //1230 -> 12:30PM
    //0 -> 12:00AM
    //1400 -> 2:00PM

    var pm, hour, min;

    pm = time >= 1200;
    hour = Math.floor(time / 100);
    min = time % 100;

    if(hour > 12) {
      hour = hour - 12;
    }

    if(hour === 0) {
      hour = 12;
    }

    if(min < 10) {
      min = "0" + min;
    }

    return [hour, ":", min, pm ? " PM" : " AM"].join("");
  }).join(" - ");
}

Hours.prototype.humanize = function() {
  var hours = this.hours;

  return dayNames.map(function(dayName, index) {
    var intervals = hours[index];

    return {
      day: dayName,
      hours: intervals ? intervals.map(humanizeInterval).join(', ') : null
    };
  });
};

Hours.prototype.within = function(time) {
  var intervals, instant, parts, day;

  if(_.isDate(time)) {
    intervals = this.hours[time.getDay()];
    instant   = timeToOffset(time);
  } else {
    parts     = time.split(","),

    day       = days[parts[0].toUpperCase()],
    intervals = this.hours[day],
    instant   = timeStringToOffset(parts[1]);
  }

  return !!_(intervals).find(function(interval) {
    return (interval[0] <= instant) &&
           (interval[1] >= instant);
  });
};

Hours.prototype.serialize = function () {
  return this.hours;
};

Hours.prototype.isEmpty = function () {
  var count = 0;
  for(var k in this.hours) {
    if(!this.hours.hasOwnProperty(k)) { continue; }
    count++;
  }

  return (count === 0);
};

Hours.prototype.humanizeCondensed = function combine() {

  var merged = this.merge(),
      obj = merged.hours;

  var condensed = Object.keys(obj).reduce(function(acc, i){
    if(!acc.length) {
      acc.push({days: [parseInt(i, 10)], interval: obj[i][0]});
    } else {
      var last = acc[acc.length - 1];
      if(last.interval.join() == obj[i].join()) {
        last.days.push(parseInt(i, 10));
      } else {
        acc.push({days: [parseInt(i, 10)], interval: obj[i][0]});
      }
    }
    return acc;
  }, []);

  return condensed.map(function(run) {
    if(run.days.length == 1) {
      return {
        label: dayNames[run.days[0]],
        interval: humanizeInterval(run.interval)
      };
    } else {
      var start = dayNames[Math.min.apply(Math, run.days)];
      var end = dayNames[Math.max.apply(Math, run.days)];
      return {
        label: [start, end].join(" - "),
        interval: humanizeInterval(run.interval)
      };
    }
  });
};

module.exports = Hours;

},{"underscore":43}],"shared/models/hours":[function(require,module,exports){
module.exports=require('sxL0B6');
},{}],"shared/models/service":[function(require,module,exports){
module.exports=require('1C0T0C');
},{}],"1C0T0C":[function(require,module,exports){
var Hours = require('./hours.js');

module.exports = Parse.Object.extend('Service', {

  hours: function() {
    if(this._hours) { return this._hours; }
    this._hours = Hours.fromData(this.get('openHours'));
    return this._hours;
  }
});

},{"./hours.js":"sxL0B6"}],"shared/views/list_view":[function(require,module,exports){
module.exports=require('vZbfJV');
},{}],"vZbfJV":[function(require,module,exports){
/* globals window */
var Query                            = require('shared/lib/query'),
    facilities                       = require('shared/collections/facilities').instance,
    searchParams                     = ["fr"],
    parseParams                      = require('shared/lib/query_param_parser'),
    calculateDistanceFromService     = require('shared/lib/distance').calculateDistanceFromService,
    calculateWalkingTimeFromDistance = require('shared/lib/distance').calculateWalkingTimeFromDistance;

function generateQueryParams(queryString, limit ) {
  var params       = parseParams(queryString),
      categories   = _.compact((params.categories || '').split(',')),
      demographics = _.compact((params.demographics || '').split(',')),
      gender       = params.gender || null,
      search       = decodeURIComponent(params.search || ''),
      sort         = params.sort,
      queryParams  = { search: search, limit: limit || 10 },
      filterParams = {};

  if (categories.length > 0) {
    filterParams.categories = categories;
  }

  if (demographics.length > 0) {
    filterParams.age = demographics;
  }

  if (params.gender && params.gender !== 'A') {
    filterParams.gender = params.gender;
  }

  if (params.sort) {
    queryParams.sort = params.sort;
  }

  queryParams.filter = filterParams;

  return queryParams;
}

function validCategory(category) {
  return category && (/[a-z]+/).test(category.toString());
}

function getData($elements, dataAttrName) {
  var result = [];
  $elements.each(function(n, el) {
    result.push($(el).data(dataAttrName));
  });
  return result;
}

var ListView = Backbone.View.extend({
  template: require('templates/list'),

  events: {
    "click #filter-button":  'goToFilter',
    "click #load-more-link": 'loadMore',
    "click #load-more":      'loadMore'
  },

  initialize: function() {
    this.listenTo(this.collection, 'reset', this.render);
  },

  reset: function() {
    this.offset = this.hasMoreResults = null;
  },

  showSpinner: function() {
    this.$('#loading-spinner').show();
  },

  hideSpinner: function() {
    this.$('#loading-spinner').hide();
  },

  submitQuery: function(params, options) {
    options = options || {};
    return Query.submit(params).done(function(results) {
      this.offset = results.offset;
      this.hasMoreResults = (results.data.length == params.limit);

      if (options.appendData) {
        this.collection.add(results.data);
      } else {
        facilities.reset(results.data);
      }

    }.bind(this));
  },

  loadMore: function() {
    $('#load-more').html($('#loading-spinner').html());

    var params = this.getFilterParams();

    this.submitQuery(params, { appendData: true }).done(function(results) {
      this.render();
    }.bind(this));

    return false;
  },

  goToFilter: function() {
    var router = require('routers/router').instance;
    router.navigate("filter", {trigger: true});
  },

  generateQueryParams: generateQueryParams,

  getFilterParams: function () {
    var queryString  = window.location.hash.substring(window.location.hash.indexOf('?')+1),
        queryParams  = generateQueryParams(queryString);

    queryParams.offset = this.offset;
    queryParams.limit  = 10;

    this.options.categories = queryParams.filter.categories || [];

    return queryParams;
  },

  resetFilters: function() {
    this.$(".query .selected").removeClass("selected");
    var self = this;

    if ( this.options.categories ) {
      this.options.categories.forEach(function(category) {
        self.$categoryOption(category).addClass("selected");
      });
    }

    this.$(".query-option-gender [data-value='A']").addClass('selected');
  },

  $categoryOption: function(category) {
    if(validCategory(category)) {
      return this.$(".query-option-category [data-value=" + category + "]").addClass("selected");
    } else {
      return $();
    }

  },

  showMore: function(collection, searchLimit) {
    console.log('showMore', collection.length, searchLimit);
    return collection.length >= searchLimit;
  },

  render: function() {
    var deepJson        = this.collection ? this.deepToJson(this.collection) : [],
        categories      = this.options.categories || [],
        currentLocation = this.options.currentLocation,
        loadingResults  = this.options.loadingResults || [],
        templateJson    = this.flattenServices(deepJson, currentLocation);

    // replace with template
    this.$el.html(this.template({
      facilities:     templateJson,
      categories:     ListView.CATEGORIES,
      loadingResults: loadingResults,
      searchParams:   this.filterSelectCategories(categories),
      navButtons: [
        {class: 'left', id: 'backNav-button', text: 'Back'},
        {class: 'right', id: 'filter-button', text: 'Filter'}
      ]
    }));
    this.$('.query').hide();
    this.$('.option-group-exclusive .query-option').click(function() {
      $(this).closest(".option-group-exclusive").find(".query-option").removeClass("selected");
      $(this).toggleClass("selected");
    });

    this.$('.option-group .query-option').click(function() {
      $(this).toggleClass("selected");
    });
    this.$('#backNav-button').click(function(){
      require('routers/router').instance.back();
    });

    if ( this.hasMoreResults ) {
      this.$('#load-more').html('<span id="load-more-container"><a href="#" id="load-more-link"><i class="icon-down-open chevron"></i>More</a></span>');
      this.$('#load-more').show();
    }

    this.resetFilters();
    return this;
  },

  deepToJson: function(collection) {
    var json = [],
        modelJson;

    json = collection.models.map(function(model) {
      modelJson = model.toJSON();
      modelJson.status = model.status();
      modelJson.services = [];

      model.attributes.services.forEach(function(service) {
        modelJson.services.push(service.toJSON());
      });

      return modelJson;
    });

    return json;
  },

  // transforms category names to a unique array of category objects
  filterSelectCategories: function(queryParams) {
    var match, selectedCategories = [];

    if ( queryParams ) {
      queryParams.forEach(function(queryName) {
        var match = _.find(ListView.CATEGORIES, function(e){ return e.key == queryName; });
        if (!_.contains(selectedCategories, match)) {
          selectedCategories.push(match);
        }
      });
    }

    return selectedCategories;
  },

  flattenServices: function(jsonArray, currentLocation) {
    var serviceCategories,
        allNotes,
        flattened = [],
        self = this;

    jsonArray.forEach(function(jsonModel) {
      if (currentLocation) {
        jsonModel.distance     = calculateDistanceFromService(jsonModel.location, currentLocation);
        jsonModel.walkingTime  = calculateWalkingTimeFromDistance(jsonModel.distance);
        jsonModel.showDistance = jsonModel.showWalkingTime = true;
      }
      serviceCategories = [];
      allNotes = [];

      jsonModel.services.forEach(function(jsonService) {
        serviceCategories.push(jsonService.category);
        allNotes.push(jsonService.notes);
      });

      jsonModel.serviceCategories = self.filterSelectCategories(serviceCategories);
      jsonModel.allNotes = allNotes.join(' ');
      flattened.push(jsonModel);
    });

    return flattened;
  }
});


ListView.CATEGORIES = require('shared/lib/categories');

module.exports = ListView;

},{"routers/router":"3BtXL3","shared/collections/facilities":"o90k/8","shared/lib/categories":"JvcSSz","shared/lib/distance":"CgvdKG","shared/lib/query":"lf76si","shared/lib/query_param_parser":"tSWALn","templates/list":"eS8YFF"}]},{},[1])
;