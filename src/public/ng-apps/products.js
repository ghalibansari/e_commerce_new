const app = angular.module("productsApp", [
  "ngSanitize",
  "ngMessages",
  "ui.bootstrap",
  "ui.bootstrap.modal",
  "datatables",
  "datatables.buttons",
  "ui.select",
]);

//Use This When You Need To User ui-select
app.config(function () {
  angular.lowercase = angular.$$lowercase;
});

//Set Data table options
app.run([
  "DTDefaultOptions",
  function (DTDefaultOptions) {
    DTDefaultOptions.setOption("lengthMenu", [
      [1, 10, 20, 25, 50, -1],
      [1, 10, 20, 25, 50, "All"],
    ]);
  },
]);

app.controller("productsAppCtrlr", [
  "$scope",
  "$http",
  "$window",
  "$uibModal",
  "DTOptionsBuilder",
  "DTColumnBuilder",
  ($scope, $http, $window, $uibModal, DTOptionsBuilder, DTColumnBuilder) => {
    /**
     * Method To Open Modal
     * @param {String} mode
     * @param {Object} data
     * @param {Number} index
     */
    $scope.onOpenModalCick = (mode, data, index) => {
      let modalData = {};
      if (data !== undefined && mode !== "add") {
        modalData = angular.copy(data);
        modalData.index = index;
      }
      modalData.mode = mode;
      $scope.modalInstance = $uibModal.open({
        animation: true,
        templateUrl: "modal.html",
        controller: "productDetails",
        scope: $scope,
        backdrop: false,
        size: "lg",
        windowClass: "show",
        resolve: {
          record: function () {
            return modalData;
          },
        },
      });
    };
  },
]);


//Controller For Add Or Edit Area Details
app.controller("productDetails", ["$scope", "$http", "record", "$window", ($scope, $http, record, $window) => {
    $scope.product = {};

    (()=>{
        $scope.product = record;

    })();

    /**
     * Method To Close Modal
     */
    $scope.close = () => {
        $scope.modalInstance.close();
    }
}]);
