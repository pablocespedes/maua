
menu = ($window,utilities)->
  new class Menu

    constructor: ($window)->
      @grockitTV = 'http://grockit.tv/'
      @baseUrl = utilities.originalGrockit()

    createLeftMenu : (options, hideStudyPlan, hideVideoOption, canAccess) ->
      [
        {
          id: 'dashboard'
          url: '#/' + options.groupId + '/dashboard'
          canAccess: canAccess
          title: 'Dashboard'
          isReady: options.isReady
          iconclass: 'fa-dashboard'
          shouldShow: true
        }
        {
          id: 'study_plan'
          url: @baseUrl + '/' + options.groupId + '/study_plan'
          canAccess: canAccess
          title: 'Study Plan'
          isReady: options.isReady
          iconclass: 'fa-tasks'
          shouldShow: !hideStudyPlan
        }
        {
          id: 'social'
          url: @baseUrl + '/' + options.groupId + '/social'
          canAccess: canAccess
          title: 'Group Practice'
          isReady: options.isReady
          iconclass: 'fa-users'
          shouldShow: options.groupId != 'gre'
        }
        {
          id: 'video_courses'
          url: '#/' + options.groupId + '/video-library'
          canAccess: canAccess
          title: 'Video Library'
          isReady: options.isReady
          iconclass: 'fa-video-camera'
          shouldShow: !hideVideoOption
        }
        {
          id: 'custom_practice'
          url: @baseUrl + '/' + options.groupId + '/custom_games/new'
          canAccess: canAccess
          title: 'Custom Practice'
          isReady: options.isReady
          iconclass: 'fa-book'
          shouldShow: options.groupId != 'gre'
        }
        {
          id: 'gre_fullLenghtTest'
          url: @grockitTV + 'grepracticetest'
          canAccess: canAccess
          title: 'Take a Full Length Test'
          isReady: options.isReady
          iconclass: 'fa-lightbulb-o'
          shouldShow: options.groupId == 'gre'
        }
        {
          id: 'gmat_fullLenghtTest'
          url: @baseUrl + '/' + options.groupId + '/join_cat_game'
          canAccess: canAccess
          title: 'Take a Full Length Test'
          isReady: options.isReady
          iconclass: 'fa-lightbulb-o'
          shouldShow: options.groupId == 'gmat'
        }
        {
          id: 'skill_data'
          url: @baseUrl + '/' + options.groupId + '/skill_data'
          canAccess: canAccess
          title: 'Skill Data'
          isReady: options.isReady
          iconclass: 'fa-dashboard'
          shouldShow: true
        }
        {
          id: 'history'
          url: '#/' + options.groupId + '/history'
          canAccess: canAccess
          title: 'History'
          isReady: options.isReady
          iconclass: 'fa-bar-chart-o'
          shouldShow: options.groupId == 'gre'
        }
        {
          id: 'history'
          url: @baseUrl + '/' + options.groupId + '/reviews'
          canAccess: canAccess
          title: 'History'
          isReady: options.isReady
          iconclass: 'fa-bar-chart-o'
          shouldShow: options.groupId != 'gre'
        }
      ]



menu.$inject = ['$window','utilities']
module.exports = menu