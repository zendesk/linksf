/*globals beforeEach, describe, expect, it, spyOn */
describe("BaseController", function() {
  var baseController,
      Backbone       = require('backbone'),
      BaseController = require('../../js/app/lib/base_controller');

  beforeEach(function() {
    baseController = new BaseController();
  });

  describe("render", function() {
    var view;
    beforeEach(function() {
      var events = { 'click .button': function() {} };
      view = new Backbone.View({ events: events });
      spyOn(view, 'delegateEvents');
      spyOn(view, 'render').andCallThrough();
      baseController.render(view);
    });

    it("should rebind view events", function() {
      expect(view.delegateEvents).toHaveBeenCalledWith(view.events);
    });

    it("should render view", function() {
      expect(view.render).toHaveBeenCalled();
    });

    describe("when rendering another view", function() {
      var anotherView;
      beforeEach(function() {
        anotherView = new Backbone.View();
        spyOn(view, 'remove');
        spyOn(anotherView, 'render');
        baseController.render(anotherView);
      });

      it("should remove the currently rendered view", function() {
        expect(view.remove).toHaveBeenCalled();
      });

      it("should render view", function() {
        expect(anotherView.render).toHaveBeenCalled();
      });
    });

    describe("currently rendered view is a singleton", function() {
      var singleton;
      beforeEach(function() {
        singleton = new Backbone.View({ isSingleton: true });
        spyOn(singleton, 'remove');
        spyOn(singleton, 'render');
        baseController.render(singleton);
      });

      describe("rendering the same view", function() {
        beforeEach(function() {
          baseController.render(singleton);
        });

        it("should not remove current view", function() {
          spyOn(singleton.remove).not.toHaveBeenCalled();
        });

        it("should rerender view", function() {
          expect(singleton.render.calls.length).toBe(2);
        });
      });
    });
  });
});
