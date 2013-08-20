var Backbone            = require('backbone'),
    $                   = require('jquery'),
    _                   = require('underscore'),
    Service             = require('cloud/models/service'),
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

function saveFacility(model, services, successCallback, failCallback) {
  model.save().then(function(foo) {
    _.each(model.get("services"), function(service) {
      service.destroy();
    });

    var serviceObjects = _.map(services, function(serviceData) {
      var service = new Service();
      service.set("facility", model);

      delete serviceData.id;
      service.set(serviceData);

      return service;
    });

    Service.saveAll(serviceObjects, function(services, error) {
      if (services) {
        model.set("services", _.map(services, function(s) {
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
    var context = { category: this.$('#categories').val() };
    this.$('#services').prepend(editServiceTemplate(context));
    return false;
  },

  removeCategory: function(event) {
    var parent = this.$(event.target).closest('.service-edit-row');
    parent.remove();
    return false;
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
  },

  saveForm: function() {
    // var self = this;
    var servicePromises = [];
    var formValues = this.$('#facilityForm').serializeObject();
    if ( formValues.gender === "" ) {
      formValues.gender = null;
    }

    if ( this.$("#age_everyone").prop('checked') ) {
      formValues.age = null;
    } else {
      var ages = _.map(this.$("[name=age]input:checked"), function(cb) {
        return $(cb).attr('value');
      });

      ages = _(ages).compact();
      formValues.age = ages;
    }

    var oldServices = _.clone(formValues.services);

    // _.each(formValues.services, function(service, i) {
    //   self.model.get("services")[i].set(service);
    // });

    delete formValues.services;
    this.model.set(formValues);

    var save = _.bind(saveFacility, this);
    save(this.model, oldServices, _.bind(modelSaveSuccessCallback, this), _.bind(modelSaveFailCallback, this));

  },



  render: function() {
    var hours = [];

    for(var idx = 0; idx <= 23; idx++) {
      if (idx < 10) { idx = '0' + idx; }
      hours.push(idx + ':00');
      hours.push(idx + ':30');
    }

    var templateData = this.model.presentJSON();
    templateData.services.forEach(function(service) {
      service.allHours = hours;
    });
    $(this.el).html(this.template({facility: templateData}));
    this.setupForm();
    return this;
  }
});

module.exports = EditView;
