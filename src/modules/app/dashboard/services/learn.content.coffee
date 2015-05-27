
learnContent = ($resource,urlsCons)->
  new class LearnContent
    constructor:->
      @url = urlsCons.timingData+'learn-track-data.json'
    getLearnData:->
      $resource(@url).query array: true

learnContent.$inject = ['$resource','urlsCons']
module.exports = learnContent