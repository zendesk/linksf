/* globals window */
var Analytics             = require('../lib/analytics'),
    Query                 = require('../lib/query'),
    facilities            = require('../collections/facilities').instance(),
    searchParams          = ["fr"],
    parseParams           = require('../lib/query_param_parser'),
    calculateAllDistances = require('../lib/distance').calculateAllDistances;

function generateQueryParams(inputString, limit ) {
  var queryString  = inputString || window.location.hash.substring(window.location.hash.indexOf('?') + 1),
      params       = parseParams(queryString),
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

  if (params.hours === 'open') {
    filterParams.open = true;
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

function calculateDistanceCallback (walkingData, list){
  var self = this;
  list.forEach(function(facility, i){
    if (!walkingData[i]) { return; }
    var text,
        distanceSpan = self.$("#distance_" + facility.id),
        aboveLimit = walkingData[i].duration.value > 3600,
        distanceDesc = walkingData[i].distance.text + "les",
        durationDesc = Math.floor(walkingData[i].duration.value/60) + " minutes walking";

    text = aboveLimit ? distanceDesc : durationDesc;

    facility.distanceData = text;
    $(distanceSpan).text( text );
  });
}

var ListView = Backbone.View.extend({
  template: require('../templates/list.hbs'),

  events: {
    "click #load-more-link": 'loadMore',
    "click #load-more":      'loadMore',
    "click .more-options":   'goToFilter'
  },

  constructor: function (options) {
    Backbone.View.apply(this, arguments);
    this.options = options;
  },

  initialize: function() {
    this.listenTo(this.collection, 'reset', function() {
      this.render();
      this.afterRender();
    });
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
    params.tzOffset = (new Date()).getTimezoneOffset();

    if ( this.options.currentLocation ) {
      $.extend(params, this.options.currentLocation);
    }

    return Query.findByFilter(params).done(function(results) {
      this.offset = results.offset;
      this.hasMoreResults = (results.data.length === params.limit);

      if (this.options.currentLocation) {
        calculateAllDistances( results.data, this.options.currentLocation, calculateDistanceCallback.bind(this) );
      }
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
      this.afterRender();
    }.bind(this));

    return false;
  },

  goToFilter: function() {
    Analytics.trackListAction('options', { location: this.options.currentLocation, target: 'options' });
    var queryString = window.location.hash.substring(window.location.hash.indexOf('?')+1),
        router      = require('../../../app/js/routers/router').instance();
    Backbone.history.navigate("filter?" + queryString, {trigger: true});
    return false;
  },

  generateQueryParams: generateQueryParams,

  getFilterParams: function () {
    var queryParams  = generateQueryParams();

    queryParams.offset = this.offset;
    queryParams.limit  = 10;

    this.options.categories = queryParams.filter.categories || [];

    return queryParams;
  },

  // TODO: there's really no reason to have to cast back and forth like this.
  // we should define a common format for the url and for the parse cloud func.
  _navigateFromQueryParams: function(p, replace) {
    var navigate = require('../lib/navigate');
    navigate({
      categories:   p.filter.categories,
      demographics: p.filter.demographics,
      gender:       p.filter.gender,
      sort:         p.sort,
      hours:        p.filter.open ? "open" : null,
      replace:      replace
    });
  },

  filterToggle: function(event) {
    var currentParams = generateQueryParams(),
        select        = $(event.target).prev('select'),
        key           = select.attr('id') + '-' + select.val();

    if ( select.attr('id') === 'sort-toggle' ) {
      currentParams.sort = select.val();
    } else if ( select.attr('id') === 'open-toggle' ) {
      currentParams.filter.open = select.val() === 'yes';
    }

    Analytics.trackListAction('toggle', { location: this.options.currentLocation, target: key });
    this._navigateFromQueryParams(currentParams, true);
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
    return collection.length >= searchLimit;
  },

  navButtons: [
    {"class": 'left', id: 'backNav-button', text: '<i class="icon-left-open back"></i> BACK'}
  ],

  render: function() {
    var deepJson        = this.collection ? this.deepToJson(this.collection) : [],
        categories      = this.options.categories || [],
        currentLocation = this.options.currentLocation,
        loadingResults  = this.options.loadingResults || [],
        templateJson    = this.flattenServices(deepJson, currentLocation),
        currentParams   = generateQueryParams(),
        listCategories  = categories.length ? categories.join(', ') : 'all',
        listDescription = listCategories + ' facilities';

    if (currentParams.sort) { listDescription += ' sorted by ' + currentParams.sort; }
    if (currentParams.filter.open) { listDescription += ' currently open'; }

    // replace with template
    this.$el.html(this.template({
      facilities:       templateJson,
      categories:       ListView.CATEGORIES,
      listDescription:  listDescription,
      loadingResults:   loadingResults,
      searchParams:     this.filterSelectCategories(categories)
    }));

    this.$('.query').hide();

    this.$('.option-group-exclusive .query-option').click(function() {
      $(this).closest(".option-group-exclusive").find(".query-option").removeClass("selected");
      $(this).toggleClass("selected");
    });

    this.$('.option-group .query-option').click(function() {
      $(this).toggleClass("selected");
    });

    if ( this.hasMoreResults ) {
      this.$('#load-more').html('<span id="load-more-container"><a href="#" id="load-more-link"><button class="load-more-button">SHOW MORE</button></a></span>');
      this.$('#load-more').show();
    }

    this.resetFilters();
    return this;
  },

  afterRender: function() {
    var currentParams = generateQueryParams(),
        sort          = currentParams.sort;

    if (this.options.disabledLocation) {
      this.$('#sort-toggle').prop('disabled', true);
      sort = 'name';
    }

    var switches = [{selector: '#sort-toggle', val: sort},
                    {selector: '#open-toggle', val: currentParams.filter.open ? 'yes' : 'no'}];

    switches.forEach(function(sw) {
      if ( this.$(sw.selector).length > 0 ) {
        this.$(sw.selector)
          .val(sw.val)
          .switchify()
          .data('switch').bind('switch:slide-complete', this.filterToggle.bind(this));
      }
    }.bind(this));
  },

  deepToJson: function(collection) {
    var json = [],
        modelJson;

    json = collection.models.map(function(model) {
      modelJson = $.extend(true, { distanceData: model.distanceData }, model.toJSON());
      modelJson.status = model.status();
      modelJson.services = [];

      model.attributes.services.forEach(function(service) {
        // var jsonService = $.extend(true, { distanceData: service.distanceData }, service.toJSON());
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
        var match = _.find(ListView.CATEGORIES, function(e){ return e.key === queryName; });
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


ListView.CATEGORIES = require('cloud/lib/categories');

module.exports = ListView;
