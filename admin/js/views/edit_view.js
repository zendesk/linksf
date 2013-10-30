var Service             = require('shared/models/service'),
    Hours               = require('shared/models/hours'),
    fetchLocation       = require('shared/lib/fetch_location'),
    editServiceTemplate = require('templates/_edit_service'),
    openHoursTemplate   = require('shared/templates/_open_hours'),
    facilities          = require('shared/collections/facilities').instance();

function modelSaveFailCallback(args) {
  this.$("#facilitySaveError").show().focus();
  console.log("failed.");
  console.log(args);
}

function modelSaveSuccessCallback(args) {
  this.$("#facilitySaved").show().focus();
  this.$("#facilitySaved").delay(5000).fadeOut();
  this.$("#errorMessages").hide();
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
    'click #add_category':        'addCategory',
    'click #remove_category':     'removeCategory',
    'click .closed':              'previewHours',
    'blur .hours input':          'previewHours',
    'blur input[name="address"]': 'previewAddress',
    'blur input[name="city"]':    'previewAddress',
    'click #delete_facility':     'deleteFacility',
    'click #age_everyone':        'processEveryoneCB'
  },

  previewAddress: function(event) {
    var address = this.$('input[name="address"]').val(),
        city    = this.$('input[name="city"]').val(),
        preview = this.$('.address-preview');
    if (address === '' || city === '') { return; }
    preview.removeClass('error');

    var ul = $("<ul>");
    fetchLocation(address + ", " + city).then(
      function(loc) {
        preview.html('Recognized address: ' + loc.formattedAddress);
        preview.closest('.control-group').show();
      },

      function(err) {
        preview.addClass('error');
        preview.html("Couldn't recognized address!");
        preview.closest('.control-group').show();
      }
    );
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

    preview = mergedHours.humanizeCondensed();
    html    = openHoursTemplate({ condensedHours: preview });
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

  deleteFacility: function() {
    if ( window.confirm("Confirm deletion of " + this.model.get("name")) ) {
      this.model.destroy()
        .then(function() {
          var router = require('routers/router').instance();
          router.navigate("/", {trigger: true});
        }, function(errors) {
          window.alert("errors");
        }
      );
    }
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

  processEveryoneCB: function() {
    var selector = this.$('[name=age]');

    if ( this.$("#age_everyone").prop("checked") ) { 
      selector.prop({checked: true, disabled: true});
    } else {
      selector.prop({checked: false, disabled: false});
    }
  },

  setupForm: function() {
    var g = this.model.get('gender'),
        self = this,
        el, 
        ageRestrictions;

    el = self.$('#gender_' + (g ? g : ''));
    el.prop('checked', true);

    self.$("#age_everyone").click(self.processEveryoneCB.bind(self));

    if ( (ageRestrictions = self.model.get("age")) && ageRestrictions.length > 0 ) {
      _(ageRestrictions).each(function(age) {
        self.$("#age_" + age.toUpperCase()).prop('checked', true);
      });
    } else {
      self.$("#age_everyone").prop("checked", true);
      self.processEveryoneCB();
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

    var website = $('input[name=website]').val();
    if ( website.length > 0 && website.indexOf('.') === -1 ) {
      this.addErrorToInput($('input[name=website]'));
      errors.push("Please enter a valid URL for 'website'");
    }

    var ul = $("<ul>");

    errors.forEach(function(msg) {
      ul.append($("<li>" + msg + "</li>"));
    });

    $("#errorMessages").show().html(ul);
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
    
    ages = _(ages).compact();
    return ages.length === 0 ? null : ages;
  },

  saveForm: function(formValues) {
    // the days-of-the-week inputs are named dumbly, get rid of them
    days.forEach(function(d) { delete formValues[d.key]; });

    if ( formValues.gender === "" ) {
      formValues.gender = null;
    }
    if ( formValues.website.length > 0 && formValues.website.indexOf("http") < 0 ) {
      formValues.website = "http://" + formValues.website;
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
      service.days = days.map(function(day, index) {
        return {key: day.key, name: day.name, hours: service.openHours[index].hours};
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
