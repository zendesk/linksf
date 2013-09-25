var Backbone            = require('backbone'),
    $                   = require('jquery'),
    _                   = require('underscore'),
    Service             = require('cloud/models/service'),
    Hours               = require('cloud/models/hours'),
    fetchLocation       = require('cloud/lib/fetch_location'),
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

    var templateData = this.model.presentJSON(),
        Hours = require('models/hours');
    templateData.services.forEach(function(service) {
      var openHours = Hours.fromData(service.openHours).humanize();

      service.days = days.map(function(day) {
        return {key: day.key, name: day.name, hours: openHours[day.key]};
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
