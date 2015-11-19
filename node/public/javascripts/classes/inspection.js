/**
 * Created by Ricsard on 2015. 11. 02..
 */
var app = angular.module('szakdolgozat');
    app.factory( "Inspection", function() {
        // Define the constructor function.
        function Inspection( inspectionId, userId, name, diagnosis, treatment, comment, sounds, attachments, doctors ) {
            if(inspectionId != undefined) {
                this.inspectionId = inspectionId;
                this.userId = userId;
                this.name = name;
                this.diagnosis = diagnosis;
                this.treatment = treatment;
                this.comment = comment;
                this.sounds = sounds;
                this.attachments = attachments;
                this.doctors = doctors;
                this.date = new Date();
            } else {
                this.inspectionId = '';
                this.userId = '';
                this.name = '';
                this.diagnosis = '';
                this.treatment = '';
                this.comment = '';
                this.sounds = [];
                this.attachments = [];
                this.doctors = [];
                this.date = new Date();
            }
        }

        /*
         Define the "instance" methods using the prototype
         and standard prototypal inheritance.
         */
        Inspection.prototype = {
            transformToSend: function() {
                var tmp = angular.copy(this);
                delete tmp.inspectionId;
                return tmp;
            }
        };

        /*
         Define the "class" / "static" methods. These are
         utility methods on the class itself; they do not
         have access to the "this" reference.
         */
        Inspection.noop = function() {};

        /*
         Return constructor - this is what defines the actual
         injectable in the DI framework.
         */
        return( Inspection );

    });
