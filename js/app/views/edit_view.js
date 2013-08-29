var Backbone            = require('backbone'),
    $                   = require('jquery'),
    _                   = require('underscore'),
    Service             = require('cloud/models/service'),
    Hours               = require('cloud/models/hours'),
    gmaps               = require('google-maps'),
    editServiceTemplate = require('templates/_edit_service');

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
  {key: "MON", name: "Monday"},
  {key: "TUE", name: "Tuesday"},
  {key: "WED", name: "Wednesday"},
  {key: "THU", name: "Thursday"},
  {key: "FRI", name: "Friday"},
  {key: "SAT", name: "Saturday"},
  {key: "SUN", name: "Sunday"}
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
      if (services) {
        model.set("services", services.map(function(s) {
          var sObj = new Service();
          sObj.id = s.id;
          return sObj;
        }));

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
    'click #remove_category': 'removeCategory'
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

  parseHourElement: function(hours, el) {
    var closedCheckbox = $(el).next("input.closed");

    if ( closedCheckbox.prop("checked") || el.value === "" || el.value === "CLOSED" ) {
      return;
    }

    try { 
      hours.addDay(el.name, el.value);
    } catch(err) { 
      $(el).closest("tr").after($("<tr class='dayError'></tr>").html('<td colspan="3">' + err.message + '</td>'));
    }
  },

  parseHours: function(container) {
    var serviceHours = new Hours();

    _($(container).find('input.day')).each(function(el) { 
      this.parseHourElement(serviceHours, el);
    }.bind(this));

    return serviceHours;
  },

  setupServiceElements: function(container) { 
    $(container).find("input.day").first().attr("placeholder", "example: 9am-3pm, 6pm-8pm");
    $(container).find("input.day").blur(function(ev) { 
      this.parseHourElement(new Hours(), ev.target);
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
    var g = this.model.get('gender');
    var el;

    el = this.$('#gender_' + (g ? g : ''));
    el.prop('checked', true);

    this.$("#age_everyone").click(function() {
      this.$('[name="age"]').prop('checked', $(this).prop('checked'));
    }.bind(this));

    if ( this.model.get("age") ) {
      _(this.model.get("age")).each(function(age) {
        this.$("#age_" + age.toUpperCase()).prop('checked', true);
      }.bind(this));
    } else {
      this.$("#age_everyone").click();
    }

    this.$('#submit').click(function() {
      this.saveForm();
    }.bind(this));
  

    // setup all the service elements
    this.setupServiceElements(this.el);
  },

  saveForm: function() {
    // var self = this;
    var servicePromises = [];
    var formValues = this.$('#facilityForm').serializeObject();

    days.forEach(function(d) { delete formValues[d.key]; });

    if ( formValues.gender === "" ) {
      formValues.gender = null;
    }

    if ( this.$("#age_everyone").prop('checked') ) {
      formValues.age = null;
    } else {
      var ages = this.$("[name=age]input:checked").map(function(cb) {
        return $(cb).attr('value');
      });

      ages = _(ages).compact();
      formValues.age = ages;
    }

    var services = _.clone(formValues.services);

    _.each(services, function(service, i) {
      var hours = this.parseHours($('.hours')[i]);
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
    var templateData = this.model.presentJSON();
    templateData.services.forEach(function(service) {
      service.days = days;
    });

    $(this.el).html(this.template({facility: templateData}));
    this.setupForm();
    return this;
  }
});

module.exports = EditView;
