
menu = ($window,utilities)->
  new class Menu

    constructor: ($window)->
      @grockitTV = 'http://grockit.tv/'
      @baseUrl = utilities.originalGrockit()

    createLeftMenu : (options, hideStudyPlan, hideVideoOption, canAccess) ->
      return [
        {
          id: 'dashboard'
          url: '#/' + options.groupId + '/dashboard'
          canAccess: canAccess
          title: 'Dashboard'
          isReady: options.isReady
          target: '_self'
          icon: 'md-dashboard'
          shouldShow: true
        }
        {
          id: 'study_plan'
          url: @baseUrl + '/' + options.groupId + '/study_plan'
          canAccess: canAccess
          title: 'Study Plan'
          isReady: options.isReady
          target: '_self'
          icon: 'md-bookmark-outline'
          shouldShow: !hideStudyPlan
        }
        {
          id: 'social'
          url: @baseUrl + '/' + options.groupId + '/social'
          canAccess: canAccess
          title: 'Group Practice'
          isReady: options.isReady
          target: '_self'
          icon: 'md-account-child'
          shouldShow: options.groupId != 'gre'
        }
        {
          id: 'video_courses'
          url: '#/' + options.groupId + '/video-library'
          canAccess: canAccess
          title: 'Video Library'
          isReady: options.isReady
          target: '_self'
          icon: 'md-video-collection'
          shouldShow: !hideVideoOption and options.groupId == 'gre'
        }
        {
          id: 'video_courses'
          url: @baseUrl + '/' + options.groupId + '/video_courses'
          canAccess: canAccess
          title: 'Video Library'
          isReady: options.isReady
          target: '_blank'
          icon: 'md-video-collection'
          shouldShow: !hideVideoOption and options.groupId != 'gre'
        }
        {
          id: 'custom_practice'
          url: @baseUrl + '/' + options.groupId + '/custom_games/new'
          canAccess: canAccess
          title: 'Custom Practice'
          isReady: options.isReady
          target: '_blank'
          icon: 'md-my-library-books'
          shouldShow: options.groupId != 'gre'
        }
        {
          id: 'gre_fullLenghtTest'
          url: @grockitTV + 'grepracticetest'
          canAccess: canAccess
          title: 'Take a Full Length Test'
          isReady: options.isReady
          target: '_blank'
          icon: 'fa-lightbulb-o'
          shouldShow: options.groupId == 'gre'
        }
        {
          id: 'gmat_fullLenghtTest'
          url: @baseUrl + '/' + options.groupId + '/join_cat_game'
          canAccess: canAccess
          title: 'Take a Full Length Test'
          isReady: options.isReady
          target: '_blank'
          icon: 'fa-lightbulb-o'
          shouldShow: options.groupId == 'gmat'
        }
        {
          id: 'skill_data'
          url: @baseUrl + '/' + options.groupId + '/skill_data'
          canAccess: canAccess
          title: 'Skill Data'
          isReady: options.isReady
          target: '_blank'
          icon: 'fa-dashboard'
          shouldShow: true
        }
        {
          id: 'history'
          url: '#/' + options.groupId + '/history'
          canAccess: canAccess
          title: 'History'
          isReady: options.isReady
          target: '_self'
          icon: ' md-insert-chart'
          shouldShow: options.groupId == 'gre'
        }
        {
          id: 'history'
          url: @baseUrl + '/' + options.groupId + '/reviews'
          canAccess: canAccess
          title: 'History'
          isReady: options.isReady
          target: '_blank'
          icon: ' md-insert-chart'
          shouldShow: options.groupId != 'gre'
        }
      ]



menu.$inject = ['$window','utilities']
module.exports = menu