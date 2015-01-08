var Service       = require('cloud/models/service'),
    Hours         = require('cloud/models/hours'),
    fetchLocation = require('../../../shared/js/lib/fetch_location');

function modelSaveFailCallback() {
  this.$("#facilitySaveError").show().focus();
}

function modelSaveSuccessCallback() {
  this.$("#facilitySaved").show().focus();
  this.$("#facilitySaved").delay(5000).fadeOut();
  this.$("#errorMessages").hide();
}

function saveFacility(model, services, successCallback, failCallback) {
  model.save().then(function() {
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
      var facilities = require('../../../shared/js/collections/facilities').instance();
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
  template: require('../templates/edit.hbs'),

  events: {
    'click #addService':          'addService',
    'click #removeService':       'removeService',
    'click .closed':              'generateHoursPreview',
    'blur .hours input':          'generateHoursPreview',
    'blur input[name="address"]': 'previewAddress',
    'blur input[name="city"]':    'previewAddress',
    'click #delete_facility':     'deleteFacility',
    'click #age_everyone':        'applyAgeRestrictions'
  },

  previewAddress: function() {
    var address = this.$('input[name="address"]').val(),
        city    = this.$('input[name="city"]').val(),
        preview = this.$('.address-preview');
    if (address === '' || city === '') { return; }
    preview.removeClass('error');

    fetchLocation(address + ", " + city).then(
      function(loc) {
        preview.html('Recognized address: ' + loc.formattedAddress);
        preview.closest('.control-group').show();
      },

      function() {
        preview.addClass('error');
        preview.html("Couldn't recognize address!");
        preview.closest('.control-group').show();
      }
    );
  },

  generateHoursPreview: function(event) {
    var $hours = $(event.target).closest('.hours');
    var hours  = this.parseHours($hours);
    var mergedHours = Hours.merge.apply(Hours,
      [ { hours: hours.serialize() } ]
    );
    var preview = mergedHours.humanizeCondensed({shortDayNames: true});
    var template = require('../../../shared/js/templates/_open_hours.hbs');
    var html = template({ condensedHours: preview });

    $hours.find('#preview_hours').html(html);
  },

  addService: function() {
    var $service = this.createService(this.$('#categories').val());

    this.setupServiceElements($service);

    this.$('#services').append($service);
    this.$('#services div:last-child .hasPopover').popover();
    this.$('#services div:last-child .autosize').autosize();

    return false;
  },

  createService: function(category) {
    var context = {
      category: category,
      days: Hours.DAY_NAMES
    };
    var template = require('../templates/_edit_service.hbs');
    return $(template(context));
  },

  removeService: function(event) {
    var parent = this.$(event.target).closest('.service-edit-row');
    parent.remove();
    return false;
  },

  deleteFacility: function() {
    if ( window.confirm("Confirm deletion of " + this.model.get("name")) ) {
      this.model.destroy()
        .then(function() {
          var router = require('../routers/router').instance();
          router.navigate("/", {trigger: true});
        }, function() {
          window.alert("Sorry, something went wrong while trying to delete this facility.");
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

  addPhoneNumberBlurHandler: function(selector) {
    selector.blur(function(event) {
      var target = $(event.target),
          matches;
      if ( (matches = target.val().match(/.*(\d{3}).*(\d{3}).*(\d{4})/)) ) {
        target.val("(" + matches[1] + ") " + matches[2] + "-" + matches[3]);
      }
    });
  },

  setupDemographics: function() {
    var gender = this.model.get('gender') || '';
    this.$('#gender_' + gender).prop('checked', true);

    var ageRestrictions = this.model.get('age') || [];

    if ( ageRestrictions.length > 0 ) {
      ageRestrictions.forEach(function(age) {
        this.$("#age_" + age.toUpperCase()).prop('checked', true);
      }.bind(this));
    } else {
      this.$("#age_everyone").prop('checked', true);
      this.applyAgeRestrictions();
    }
  },

  applyAgeRestrictions: function() {
    var selector = this.$('[name=age]');

    if ( this.$("#age_everyone").prop("checked") ) {
      selector.prop({checked: true, disabled: true});
    } else {
      selector.prop({checked: false, disabled: false});
    }
  },

  setupPhoneField: function() {
    this.$("#add-phone-number").click(function() {
      var oldDiv = $('.phone-number').last();
      var newDiv = oldDiv.clone();
      $(newDiv).find('input').val('');

      this.addPhoneNumberBlurHandler($(newDiv).find('.phone-number-input'));

      oldDiv.after(newDiv);
      return false;
    }.bind(this));

    this.addPhoneNumberBlurHandler(this.$('.phone-number-input'));
  },

  setupFormSubmit: function() {
    this.$('#submit').click(function() {
      var formValues = this.$('#facilityForm').serializeObject();

      if ( !this.validateForm(formValues) ) return false;

      fetchLocation(formValues.address + ", " + formValues.city).then(
        function(loc) {
          formValues.location = new Parse.GeoPoint({latitude: loc.lat, longitude: loc.lon});
          console.log("location ", formValues.location);
          this.saveForm(formValues);
        }.bind(this),

        function(err) {
          this.addErrorToInput($("input[name='address']"));
          $("#errorMessages").html("<ul><li>Could not find address</li></ul>");
        }.bind(this)
      );
    }.bind(this));
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

    ages = this.$("[name=age]input:checked").map(function(i, cb) {
      return $(cb).attr('value');
    });

    ages = _(ages).compact();
    return ages.length === 0 ? null : ages;
  },

  saveForm: function(formValues) {
    // the days-of-the-week inputs are named dumbly, get rid of them
    Hours.SHORT_DAY_NAMES.forEach(function(d) { delete formValues[d]; });

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
      service.openHours = hours.serialize();
    }.bind(this));

    delete formValues.services;
    this.model.set(formValues);

    var save = _.bind(saveFacility, this);
    save(this.model, services, _.bind(modelSaveSuccessCallback, this), _.bind(modelSaveFailCallback, this));
  },

  render: function() {
    var templateData = this.model.presentJSON();

    templateData.services.forEach(function(service) {
      service.days = Hours.DAY_NAMES.map(function(day, index) {
        return {short: day.short, long: day.long, hours: service.openHours[index].hours};
      });
    });

    $(this.el).html(this.template({facility: templateData}));

    this.setupDemographics();
    this.setupPhoneField();
    this.setupFormSubmit();
    this.setupServiceElements(this.el);

    this.$('.hasPopover').popover();
    this.$('.autosize').autosize();

    return this;
  }
});

module.exports = EditView;
