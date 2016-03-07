angular.module('eventbrite', [])

.controller('ctrl', ['$rootScope', '$scope', '$element', '$compile', function ($rootScope, $scope, $element, $compile) {
    $scope.tiles = [];
    $scope.dimensions = [];
    gameNum = 0;

    $scope.newGameClick = function() {
      $scope.tiles[gameNum] = new Array;
      $scope.dimensions[gameNum] = document.querySelector('.gameDimension').value;
      for (var i=0; i<($scope.dimensions[gameNum]*$scope.dimensions[gameNum]); i++) {
        $scope.tiles[gameNum].push("");
      }   
      var el = $compile( '<tictactoe gamenum="'+gameNum+'" index="$index" tiles="tiles['+gameNum+']" dimension="dimensions['+gameNum+']"></tictactoe>' )( $scope );
      $element.parent().append( el );
      gameNum++;
    }

}])


.directive('tictactoe', function () {
    return {
        restrict: 'E',
        scope: {
            tiles: '=',
            dimension: '=',
            index: '@',
            gamenum: '='
        },
        link: function(scope, element, attrs) {
          var turn = 'X';
          var turnNum = 0;
          var buildWinnerArr = function() {
            var retVal = new Array();
            //build array of winning combinations
            var rowArray = new Array();
            var colArray = new Array();
            var criss = new Array();
            var cross = new Array();
            var criss_inc = 0;
            var cross_inc = 0;
            for (var j=0; j<(scope.dimension*scope.dimension); j++) {
                row = parseInt(j / scope.dimension);
                col = (j % scope.dimension);
                if (rowArray[row] === undefined) {
                  rowArray[row] = new Array();
                }
                if (colArray[col] === undefined) {
                  colArray[col] = new Array();
                }
                colArray[col].push(j);
                rowArray[row].push(j);
            }
            for (var j=0; j<scope.dimension; j++) {
              criss.push(0 + criss_inc);
              cross.push((scope.dimension -1) + cross_inc);
              criss_inc += parseInt(scope.dimension)+1;
              cross_inc += parseInt(scope.dimension)-1;
              retVal.push(rowArray[j]);
              retVal.push(colArray[j]);
            }
            retVal.push(criss);
            retVal.push(cross);
            console.log(retVal);
            return retVal;
          }

          var winnerComboArr = buildWinnerArr();
          var mWinningCombo = null;  //no winning combo has been found yet
          
          var checkWinnerCombo = function() {
            for (var i=0; i<winnerComboArr.length; i++) {
              var allMatched = true;
              var lastValue = null;
              for (var j=0; j<(winnerComboArr[i].length); j++) {
                if (lastValue !== null) {
                  if ((scope.tiles[winnerComboArr[i][j]] !== scope.tiles[lastValue])||(scope.tiles[lastValue] == "")) {
                    allMatched = false;
                    break;
                  }
                }
                lastValue = winnerComboArr[i][j];
              }
              if (allMatched) {
                processWinner(winnerComboArr[i]);
                break;
              }
            }
          }

          var processWinner = function(inWinningCombo) {
            mWinningCombo = inWinningCombo;
            for (var j=0; j<mWinningCombo.length; j++) {
              document.querySelector('tictactoe[gamenum="'+scope.gamenum+'"] input[title="'+mWinningCombo[j]+'"]').classList.add('winner');
            }
          }

          var resetBoard = function() {
            mWinningCombo = null;
            for (var j=0; j<(scope.dimension*scope.dimension); j++) {
              scope.tiles[j] = "";
              scope.$apply();
              document.querySelector('tictactoe[gamenum="'+scope.gamenum+'"] input[title="'+j+'"]').classList.remove('winner');
              turn = "X";
            }
          }

          element.on('click', function(inEvent) {
      //      console.log("clicked", inEvent, scope, attrs);
            if (inEvent.target.value === "Reset") {
              resetBoard();
            } else if ((inEvent.target.value === "")&&(mWinningCombo === null)) {

              scope.tiles[inEvent.target.title] = turn;
              scope.$apply();

              if (turn === 'X') {
                turn = 'O';
              } else {
                turn = 'X';
              }

              checkWinnerCombo();
            }
          })

        },
        templateUrl: 'tictactoe.tpl.html'
    }
});