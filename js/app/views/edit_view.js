var Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('underscore'),
    gmaps = require('google-maps');

var EditView = Backbone.View.extend({
  template: require('templates/edit'),
  setupServices: function() {
    _(this.model.get("services")).each(function(service, index) {
      var prefix = "#service\\[" + index + "\\]";

      $(prefix + "_category").children("[value='" + service.get('category') + "']").prop('selected', true);
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

    this.setupServices();
    this.$('#submit').click(function() {
      this.saveForm();
    }.bind(this));
  },

  saveForm: function() {
    var self = this;
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

    var services = formValues.services;

    _.each(formValues.services, function(service, i) {
      self.model.get("services")[i].set(service);
    });

    delete formValues.services;
    self.model.set(formValues);

    self.model.save().then(function(foo) {
      _.each(self.model.get("services"), function(service) {
        servicePromises.push(service.save());
      });

      Parse.Promise.when(servicePromises).then(
        function(args) {
          self.$("#facilitySaved").show().focus();
          self.$("#facilitySaved").delay(5000).fadeOut();

          console.log("saved.");
          console.log(args);
        },
        function(args) {
          self.$("#facilitySaveError").show().focus();
          console.log("failed.");
          console.log(args);
        }
      );
    },
      function(args) {
        self.$("#facilitySaveError").show().focus();
        console.log("failed.");
        console.log(args);
      }
    );
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
