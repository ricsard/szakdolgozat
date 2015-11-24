/**
 * Created by Ricsard on 2015. 11. 02..
 */
var app = angular.module('szakdolgozat');
    app.factory( "Inspection", function() {

        /**
         * Constructor
         * @param inspectionId
         * @param userId
         * @param name
         * @param diagnosis
         * @param treatment
         * @param comment
         * @param sounds
         * @param attachments
         * @param doctors
         * @constructor
         */
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

        /**
         * Prototypical functions
         * @type {{transformToSend: Function}}
         */
        Inspection.prototype = {
            //Delete the inspectionId before we send for add
            transformToSend: function() {
                var tmp = angular.copy(this);
                delete tmp.inspectionId;
                return tmp;
            }
        };

        return( Inspection );

    });
