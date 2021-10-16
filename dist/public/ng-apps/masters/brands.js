const app = angular.module("brandsApp", [
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

app.controller("brandsAppCtrlr", [
  "$scope",
  "$http",
  "$window",
  "$uibModal",
  "DTOptionsBuilder",
  "DTColumnBuilder",
  ($scope, $http, $window, $uibModal, DTOptionsBuilder, DTColumnBuilder) => {
    $scope.isLoading = false;
    /**
     * Method To Get List Of Brands
     */
    $scope.getAllBrands = async () => {
      $scope.isLoading = true;
      $http
        .get("/brands")
        .then((res) => {
          $scope.isLoading = false;
          $scope.brands = res.data.payload;
        })
        .catch((err) => {
          Swal.fire({
            title: "Error",
            text: err.data.message,
            type: "error",
            confirmButtonColor: "#556ee6",
            allowOutsideClick: false,
          }).then(function (data) {
            $scope.isPosting = false;
            $window.location.reload();
          });
        });
    };

    // Method To Init Controller
    $scope.init = () => {
      $scope.getAllBrands();
    };

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
        controller: "brandDetails",
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

    //Method To Delete Brand
    $scope.delete = function (index, id) {
      Swal.fire({
        title: `Delete Brand: ${$scope.brands[index].name}?`,
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: 1,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: "Yes, delete it!",
      }).then(function (t) {
        if (t.value) {
          $scope.isLoading = true;
          $http
            .delete(`/brands/${id}`)
            .then(function (res) {
              $scope.brands.splice(index, 1);
              $scope.isLoading = false;
              Swal.fire({
                title: "Success",
                text: "Brand Deleted Successfully",
                type: "success",
                confirmButtonColor: "#556ee6",
                allowOutsideClick: false,
              });
            })
            .catch(function (err) {
              $scope.isLoading = false;
              let errorMessage =
                err.data.status == 2
                  ? err.data.data.join(",").replace(",", "<BR>")
                  : err.data.message;
              $scope.isPosting = false;
              Swal.fire({
                title: "Error",
                text: errorMessage,
                type: "error",
                confirmButtonColor: "#556ee6",
                allowOutsideClick: false,
              }).then(function (t) {
                if (err.data.status == 3) $window.location = "/signout";
              });
            });
        }
      });
    };
  },
]);

//Controller For Add Or Edit Area Details
app.controller("brandDetails", [
  "$scope",
  "$http",
  "record",
  "$window",
  ($scope, $http, record, $window) => {
    $scope.brand = {};

    (() => {
      $scope.brand = record;
    })();

    /**
     * Method To Close Modal
     */
    $scope.close = () => {
      $scope.modalInstance.close();
    };

    /**
     * Method To Create Brand
     */
    $scope.create = () => {
      $scope.isPosting = true;
      $http
        .post("/brands", $scope.brand)
        .then((res) => {
          Swal.fire({
            title: "Success",
            text: "Brand Created Successfully",
            type: "success",
            confirmButtonColor: "#556ee6",
            allowOutsideClick: false,
          }).then(function (data) {
            $scope.isPosting = false;
            $scope.brands.push(res.data.payload);
            $scope.close();
          });
        })
        .catch((err) => {
          let errorMessage =
            err.data.status == 2
              ? err.data.data.join(",").replace(",", "<BR>")
              : err.data.message;
          $scope.isPosting = false;
          Swal.fire({
            title: "Error",
            text: errorMessage,
            type: "error",
            confirmButtonColor: "#556ee6",
            allowOutsideClick: false,
          }).then(function (t) {
            if (err.data.status == 3) $window.location = "/signout";
          });
        });
    };

    //Method To Edit Brand
    $scope.update = () => {
      $scope.isPosting = true;
      $http
        .put(`/brands/${$scope.brand.id}`, $scope.brand)
        .then((res) => {
          Swal.fire({
            title: "Success",
            text: "Brand Updated Successfully",
            type: "success",
            confirmButtonColor: "#556ee6",
            allowOutsideClick: false,
          }).then(function (data) {
            $scope.isPosting = false;
            $scope.brands[$scope.brand.index] = res.data.payload;
            $scope.close();
          });
        })
        .catch((err) => {
          let errorMessage =
            err.data.status == 2
              ? err.data.data.join(",").replace(",", "<BR>")
              : err.data.message;
          $scope.isPosting = false;
          Swal.fire({
            title: "Error",
            text: errorMessage,
            type: "error",
            confirmButtonColor: "#556ee6",
            allowOutsideClick: false,
          }).then(function (t) {
            if (err.data.status == 3) $window.location = "/signout";
          });
        });
    };
  },
]);
