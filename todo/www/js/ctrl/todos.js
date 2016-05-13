'use strict';

/**
 * @ngdoc function
 * @name starter.controller:TodoCtrl
 * @description
 * # TodoCtrl
 * Controller of the starter
 */
angular.module('starter')
    .controller('TodoCtrl', ['$scope', '$timeout', '$ionicModal', 'Projects', '$ionicSideMenuDelegate', function($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate) {

        // A utility function for creating a new project
        // with the given projectTitle
        var createProject = function(projectTitle) {
            var newProject = Projects.newProject(projectTitle);
            Projects.save(newProject);
        }


        // Load or initialize projects
        $scope.projects = Projects.all();
        console.log($scope.projects);

        // Called to create a new project
        $scope.newProject = function() {
            var projectTitle = prompt('Nombre del Proyecto');
            if (projectTitle) {
                createProject(projectTitle);
            }
        };

        // Called to select the given project
        $scope.selectProject = function(project) {
            $scope.activeProject = project;
            //$ionicSideMenuDelegate.toggleLeft(false);
        };

        // Create our modal
        $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
            $scope.taskModal = modal;
        }, {
            scope: $scope
        });

        $scope.createTask = function(task) {
            if (!$scope.activeProject || !task) {
                return;
            }

            var queGuardar = $scope.projects.$getRecord($scope.activeProject.$id);
            if(queGuardar.tasks){
                queGuardar.tasks.push({title: task.title});
            } else {
                var tasks = [
                    {
                        title: task.title
                    }            
                ];
                queGuardar.tasks = tasks;                
            }
            $scope.projects.$save(queGuardar);
            $scope.taskModal.hide();

            task.title = "";
        };

        $scope.newTask = function() {
            $scope.taskModal.show();
        };

        $scope.closeNewTask = function() {
            $scope.taskModal.hide();
        }

        $scope.toggleProjects = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.removeProject = function () {
            console.log($scope.activeProject);
            Projects.delete($scope.activeProject);
        }

        $scope.onDoubleTap = function () {
            console.info('Double tap');
        }

        $scope.projects.$loaded().then(function(projects) {
           console.log(projects.length); // data is loaded here
            if ($scope.projects.length == 0) {
                while (true) {
                    var projectTitle = prompt('Your first project title:');
                    if (projectTitle) {
                        createProject(projectTitle);
                        break;
                    }
                }
            }           
        });

    }]);
