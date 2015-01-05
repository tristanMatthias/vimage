describe("PhoneListCtrl", function() {
    beforeEach(module("phoneApp"));

    it("should create 'phones' model with 3 phones", inject(function($controller) {
        var scope = {};
        var ctrl  = $controller("PhoneListCtrl", {$scope: scope});

        expect(scope.phones.length).toBe(3);
        expect(scope.name).toBe("World");
    }));
})