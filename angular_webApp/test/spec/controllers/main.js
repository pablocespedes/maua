'use strict';

describe('Controller: SimpleDashController', function () {

  // load the controller's module
  beforeEach(module('grockitApp'));

  var SimpleDashController,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SimpleDashController = $controller('SimpleDashController', {
      $scope: scope
    });
  }));

  it('should attach a loading var  to the scope', function () {
    expect(scope.loading).toBe(true);
  });
});
