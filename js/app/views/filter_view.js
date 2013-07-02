var Backbone = require('backbone'),
    $ = require('jquery'),
    FilterView = Backbone.View.extend({
      el: $("#linksf"),
      template: require('templates/filter'),
      render: function() {
        this.$el.html(this.template());
        return this;
      }
    });
module.exports = FilterView;
