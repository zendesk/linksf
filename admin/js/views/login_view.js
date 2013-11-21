var LoginView = Backbone.View.extend({
  initialize: function(router, return_path) {
    this.router = router;
    this.return_path = return_path;
  },
  template: require('templates/login'),
  render: function(return_path) {
    var self = this;
    $('#linksf').html(this.template());
    $('#loginForm').submit(function() {
      Parse.User.logIn($("#email").val(), $("#password").val(), {
        success: function(user) {
          self.router.navigate(self.return_path, {trigger: true, replace: true});
        },
        error: function(user, error) {
          $('#loginError').show();
        }
      });
      return false;
    });
  }
});

module.exports = LoginView;
