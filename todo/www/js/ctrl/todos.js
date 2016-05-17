'use strict';

/**
 * @ngdoc function
 * @name starter.controller:TodoCtrl
 * @description
 * # TodoCtrl
 * Controller of the starter
 */
angular.module('starter')
    .controller('TodoCtrl', ['Projects', '_', '$scope', '$timeout', '$ionicModal', '$ionicPopup', '$ionicSideMenuDelegate', function(Projects, _, $scope, $timeout, $ionicModal, $ionicPopup, $ionicSideMenuDelegate) {

        // Fn para crear proyecto
        var createProject = function(projectTitle) {
            var newProject = {
                title: projectTitle
            };
            Projects.save(newProject).then(function (ref) {
                var id = ref.key();
                console.log("added record with id " + id);
                //$scope.projects.$indexFor(id); // returns location in the array
            })
        }


        // Carga proyectos
        $scope.projects = Projects.all();

        // Fn que pide nombre de proyecto y luego llama fn para crear proyecto
        $scope.newProject = function() {
            var projectTitle = prompt('Nombre del Proyecto');
            if (projectTitle) {
                createProject(projectTitle);
            }
        };

        // Fn para seleccionar proyecto
        $scope.selectProject = function(project) {
            $scope.activeProject = project;
            //$ionicSideMenuDelegate.toggleLeft(false);
        };

        // Aquí se crea el modal que se ocupa para crear task
        $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
            $scope.taskModal = modal;
        }, {
            scope: $scope
        });

        // Fn para crear task
        $scope.createTask = function(task) {
            if (!$scope.activeProject || !task) {
                return;
            }

            var queGuardar = $scope.projects.$getRecord($scope.activeProject.$id);
            if(queGuardar.tasks){
                queGuardar.tasks.push({
                    title: task.title,
                    completada: false,
                    inicioDeProyecto: Firebase.ServerValue.TIMESTAMP
                });
            } else {
                var tasks = [
                    {
                        title: task.title,
                        completada: false,
                        inicioDeProyecto: Firebase.ServerValue.TIMESTAMP
                    }            
                ];
                queGuardar.tasks = tasks;                
            }
            $scope.projects.$save(queGuardar);
            $scope.taskModal.hide();

            task.title = "";
        };

        // Fn que muestra modal para crear task
        $scope.newTask = function() {
            $scope.taskModal.show();
        };

        // Fn que cierra modal para crear task
        $scope.closeNewTask = function() {
            $scope.taskModal.hide();
        }

        // Fn para abrir menú de Proyectos
        $scope.toggleProjects = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };

        // Fn para remover proyectos
        $scope.removeProject = function () {
            Projects.delete($scope.activeProject).then(function (ref) {
                if($scope.projects.length > 0) {
                    $scope.activeProject = $scope.projects[0];
                } else {
                    console.info('Ya no hay proyectos!');
                }
            });
        }

        // Una vez cargados los datos checa si ya existe algún proyecto
        $scope.projects.$loaded().then(function(projects) {
            if ($scope.projects.length == 0) {
                while (true) {
                    var projectTitle = prompt('Your first project title:');
                    if (projectTitle) {
                        createProject(projectTitle);
                        break;
                    }
                }
            } else {
                $scope.activeProject = $scope.projects[0];
            }
        });

        // Fn para establecer task completada
        $scope.terminada = function (task) {
            if(task.completada) {
                task.fechaFin = Firebase.ServerValue.TIMESTAMP;
            } else {
                task.fechaFin = null;
            }
            var queGuardar = $scope.projects.$getRecord($scope.activeProject.$id);
            $scope.projects.$save(queGuardar).then(function(ref) {
                //var referencia = ref.key();
                console.log('Cambio guardado en base');
            });
        }

        // Fn para borrar task
        $scope.borrarTask = function (task) {
            console.log(task);
            /*if(task) {
                task = null;
            }
            var queGuardar = $scope.projects.$getRecord($scope.activeProject.$id);
            $scope.projects.$save(queGuardar).then(function(ref) {
                console.log('Cambio guardado en base');
            });*/
        }

        // Fn que inicia el tiempo
        $scope.play = function (task) {
            if(!task.fechaInicio) {
                task.fechaInicio = Firebase.ServerValue.TIMESTAMP;
            } else {
                var alertPopup = $ionicPopup.alert({
                    title: 'El tiempo ya está corriendo',
                    subTitle: '¡Tú puedes!'
                });

               /* alertPopup.then(function(res) {
                    console.log('Thank you for not eating my delicious ice cream cone');
                });*/
                return;
            }
            var queGuardar = $scope.projects.$getRecord($scope.activeProject.$id);
            $scope.projects.$save(queGuardar).then(function(ref) {
                //var referencia = ref.key();
                console.log('Cambio guardado en base');
            });            
        }

        // Fn que guarda el tiempo que ha transcurrido
        $scope.pausa = function (task) {
            var n;
            if(task.fechaInicio) {
                var d = new Date();
                n = d.getTime();
            } else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Debes iniciar el tiempo primero',
                    subTitle: '¿Listo para empezar?'
                });                
                return;
            }
            var tiempo = (n - task.fechaInicio) /1000/60/60;
            if(task.tiempos){
                task.tiempos.push(tiempo);
            } else {
                var tiempos = [];
                tiempos.push(tiempo);
                task.tiempos = tiempos;
            }
            if(task.periodos) {
                var periodo = {
                        inicio: task.fechaInicio,
                        final: n
                };
                task.periodos.push(periodo);
            } else {
                var periodos = [
                    {
                        inicio: task.fechaInicio,
                        final: n
                    }            
                ];
                task.periodos = periodos; 
            }
            task.fechaInicio = null;
            var queGuardar = $scope.projects.$getRecord($scope.activeProject.$id);
            $scope.projects.$save(queGuardar).then(function(ref) {
                //var referencia = ref.key();
                console.log('Cambio guardado en base');
                $scope.obtenerTiempo(task);
            });            
        }

        // Fn para obtener tiempo total
        $scope.obtenerTiempo = function (task) {
            if(task.tiempos){
                $scope.tiempoTranscurrido = 0;
                for (var i = 0; i < task.tiempos.length; i++) {
                    $scope.tiempoTranscurrido += task.tiempos[i];
                }
                return $scope.tiempoTranscurrido;
            } else {
                return 0.00;
            }
        }

        $scope.showDetails == 0;
        $scope.indice = null;

        // Fn para mostrar detalles
        $scope.detalles = function (task, indice) {
            if($scope.showDetails == 1 && $scope.indice >= 0){
                if($scope.indice == indice) {
                    $scope.showDetails = 0;
                    $scope.indice = null;
                    return;
                } else {
                    $scope.showDetails = 1;
                    $scope.indice = indice;                    
                }
            } else {
                $scope.showDetails = 1;
                $scope.indice = indice;
            }

            $scope.porcentajes = [];

            if(task.periodos) {
                //var primero = _.first(task.periodos).inicio;
                //var ultimo = _.last(task.periodos).final;                
                for (var i = 0; i < task.periodos.length; i++) {
                    var tiempo = (task.periodos[i].final - task.periodos[i].inicio) /1000/60/60;                
                    var porcentaje = (tiempo * 100) / $scope.tiempoTranscurrido;
                    var objeto = {
                        inicio: task.periodos[i].inicio,
                        final: task.periodos[i].final,
                        porcentaje: porcentaje
                    };
                    $scope.porcentajes.push(objeto);
                }
            } else {
                var alertPopup = $ionicPopup.alert({
                    title: 'No hay detalles todavía',
                    subTitle: 'Deberías empezar a trabajar en esta tarea'
                });                
                return;
            }

            console.log(document.getElementsByClassName("porcentajesList"));
        }

    }]);
