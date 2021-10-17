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
  "$compile",
  (
    $scope,
    $http,
    $window,
    $uibModal,
    DTOptionsBuilder,
    DTColumnBuilder,
    $compile
  ) => {
    $scope.isLoading = false;
    $scope.uri = "/api/v1/brand";
    $scope.pageSize = 10;

    $scope.pc = {};
    $scope.pc.dtInstance = {};
    $scope.instances = [];
    $scope.pc.dtColumns = [
      DTColumnBuilder.newColumn("name").withTitle("Name"),
      DTColumnBuilder.newColumn("description").withTitle("Description"),
      DTColumnBuilder.newColumn("status")
        .withTitle("Status")
        .renderWith(statusHtml),
      DTColumnBuilder.newColumn(null)
        .withTitle("Actions")
        .notSortable()
        .renderWith(actionsHtml),
    ];
    $scope.pc.dtOptions = DTOptionsBuilder.newOptions()
      .withOption("ajax", function (data, callback, settings) {
        $scope.pageSize = data.length;
        let pageNum = data.start / $scope.pageSize + 1;
        // make an ajax request using data.start and data.length
        $http
          .get(
            `${$scope.uri}?pageSize=${$scope.pageSize}&pageNumber=${pageNum}`
          )
          .then(function (res) {
            // $.fn.DataTable.ext.pager.numbers_length = res.data.page.totalPage % 2 == 0 ? res.data.page.totalPage + 1 : res.data.page.totalPage;
            // map your server's response to the DataTables format and pass it to                // DataTables' callback
            callback({
              recordsTotal: res.data.page.totalCount,
              data: res.data.data,
            });
          });
      })
      .withDataProp("data")
      .withDOM("lBfrtip")
      .withOption("processing", true) //for show progress bar
      .withOption("serverSide", true) // for server side processing
      .withPaginationType("simple_numbers") // for get full pagination options // first / last / prev / next and page numbers
      .withDisplayLength($scope.pageSize) // Page size
      .withOption("lengthMenu", [10, 20, 30, 40, 50])
      .withOption("aaSorting", [0, "asc"]) // for default sorting column // here 0 means first column
      .withOption("createdRow", function (row) {
        $compile(angular.element(row).contents())($scope);
      })
      .withButtons([
        {
          extend: "copy",
          text: '<i class="fa fa-files-o"></i> Copy',
          titleAttr: "Copy",
        },
        {
          extend: "print",
          text: '<i class="fa fa-print" aria-hidden="true"></i> Print',
          titleAttr: "Print",
        },
        {
          extend: "excel",
          text: '<i class="fa fa-file-text-o"></i> Excel',
          titleAttr: "Excel",
        },
        {
          extend: "csvHtml5",
        },
      ]);

    function actionsHtml(data, type, full, meta) {
      let obj = JSON.stringify(full);
      return `<button class="btn btn-warning" ng-click='onOpenModalCick("edit", ${obj}, ${meta.row})' > <i class="fa fa-edit text-white"></i> </button> 
          <button class="btn btn-danger" ng-click='delete("${full.name}", "${full.brand_id}")' > <i class="fa fa-trash text-white"></i> </button> `;
    }

    function statusHtml(data, type, full, meta) {
      let activeClass = data ? "badge-success" : "badge-danger";
      return `<span class="badge ${activeClass}"> <i class="fa ${
        data ? "fa-check" : "fa-times"
      }"> </span>`;
    }

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

    //Method To Reload Datatable's Data
    $scope.reloadData = function () {
      $scope.pc.dtInstance.rerender();
    };

    //Method To Delete Brand
    $scope.delete = function (name, id) {
      Swal.fire({
        title: `Delete Brand: ${name}?`,
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
            .delete(`${$scope.uri}/${id}`)
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
        .post($scope.uri, $scope.brand)
        .then((res) => {
          Swal.fire({
            title: "Success",
            text: "Brand Created Successfully",
            type: "success",
            confirmButtonColor: "#556ee6",
            allowOutsideClick: false,
          }).then(function (data) {
            $scope.isPosting = false;
            // $scope.brands.push(res.data.payload);
            $scope.reloadData();
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
        .put(`${$scope.uri}/${$scope.brand.brand_id}`, $scope.brand)
        .then((res) => {
          Swal.fire({
            title: "Success",
            text: "Brand Updated Successfully",
            type: "success",
            confirmButtonColor: "#556ee6",
            allowOutsideClick: false,
          }).then(function (data) {
            $scope.isPosting = false;
            $scope.reloadData();
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

    //Method to Close Modal
    $scope.close = () => $scope.modalInstance.close();
  },
]);
