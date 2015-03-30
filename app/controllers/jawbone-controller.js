var passport = require('passport');

var jawboneScope = ['basic_read', 'extended_read', 'location_read', 'friends_read', 'mood_read', 'mood_write', 'move_read', 'move_write', 'sleep_read', 'sleep_write', 'meal_read', 'meal_write', 'weight_read', 'weight_write', 'generic_event_read', 'generic_event_write'];

var JawboneController = function() {
    this.authorize = passport.authenticate('jawbone', {
        scope: jawboneScope
    });
    this.callback = passport.authenticate('jawbone', {
        failureRedirect: '/design'
    });
    this.redirectToDesigner = function(req, res) {
        res.redirect('/design');
    };
};

module.exports = JawboneController;
