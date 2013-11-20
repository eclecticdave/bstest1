var el;

angular.module('bstest', ['ngGrid']);

// Function run on startup
$(function() { 
    $('#cp1').colorpicker().on('changeColor', function(ev) {
       $('#mainarea')[0].style.backgroundColor = ev.color.toHex();
  });
});

function GridCtrl($scope) {
  $scope.rows = [
  {col1:'Row 1 Data 1', col2:'Row 1 Data 2', col3:'etc'},
  {col1:'Row 2 Data 1', col2:'Row 2 Data 2', col3:'etc'},
  {col1:'Row 3 Data 1', col2:'Row 3 Data 2', col3:'etc'}
  ];

  $scope.gridOpts = {data: 'rows'};

  $scope.addRow = function() {
    $scope.rows.push({col1:$scope.newCol1, col2:$scope.newCol2, col3:$scope.newCol3});
    $scope.newCol1 = $scope.newCol2 = $scope.newCol3 = '';
  };
};
