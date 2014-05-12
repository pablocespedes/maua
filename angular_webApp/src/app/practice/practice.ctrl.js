/**
 * Created by Jose on 5/8/14.
 */
 app.controller('PracticeController', function ($scope,getApiUrlRequest,tempRequest) {
    // var init = function() {
         // A definitive place to put everything that needs to run when the controller starts. Avoid
         //  writing any code outside of this function that executes immediately.
     $scope.i=0;
     $scope.cols = [{ id: 1}];
         $scope.items = [{ id: 1, answer: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat',option:'A' },
                         { id: 2, answer: 'tem, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil',option:'B' },
                        ];



      $scope.loadQuestion = function(){
          angular.element('.choice.active').removeClass('active');
          tempRequest.get($scope.i).then(function(response){
              if($scope.i>=2){
                  $scope.items.splice(2, 1);
                  $scope.i=0;
              }
              var content= response[$scope.i].objects.Question,rowKey= Object.keys(content)[0];
              $scope.QuestionDescription= content[rowKey].stimulus;

              if($scope.i==1)
              {  $scope.items.push({ id: 3, answer: 'tem, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil',option:'C' });
              }
              $scope.i++;



          });



      };


// init();

 });


