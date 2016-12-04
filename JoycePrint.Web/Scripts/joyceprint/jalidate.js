﻿/**************************************************************************************************
 * Validation Extension for jQuery that uses materialize
 *
 *************************************************************************************************/
(function (jalidate, $, undefined) {

    // *******************************************************************************************
    // Private Properties
    // *******************************************************************************************

    // This will be used to abort operations
    var jbort = false;

    // The icon for the input field that's being validated
    var icon;

    // The input field that's being validated
    var input;

    // The message to display when validation fails
    var message;

    // The validation message label
    var label;

    // *******************************************************************************************
    // Public Properties
    // *******************************************************************************************

    // The valid event name
    jalidate.validEvent = "valid";

    // The invalid event name
    jalidate.invalidEvent = "invalid";

    // The version
    jalidate.version = "1.0";

    // Css class name of the icon in a required state
    jalidate.requiredCSS = "orange-text";

    // Css class name of the icon in a valid state
    jalidate.iconValidCSS = "success-text";

    // Css class name of the icon in a invalid state
    jalidate.iconInvalidCSS = "danger-text";

    // Css class name of the valid state
    jalidate.validCSS = "valid";

    // Css class name of the invalid state
    jalidate.invalidCSS = "invalid";

    // Css class name of the touched state
    jalidate.touchedCss = "touched";

    // Css class name of the label for displaying the validation message
    jalidate.validationMessageCss = "val-msg";

    // *******************************************************************************************
    // Public Methods
    // *******************************************************************************************

    // Set the display using the valid styles
    jalidate.setValidDisplay = function (field, additionalFields, validationEvents, ignoreTouched) {
        try {

            jalidate.icon = additionalFields[0];
            jalidate.input = field;

            if (!runEvent(validationEvents, jalidate.validEvent)) return;

            if (!ignoreTouched && !hasClass(jalidate.touchedCss, jalidate.input)) return;

            switchValidationMessage();

            removeClass(jalidate.requiredCSS, jalidate.icon);
            removeClass(jalidate.iconInvalidCSS, jalidate.icon);
            addClass(jalidate.iconValidCSS, jalidate.icon);

            removeClass(jalidate.invalidCSS, jalidate.input);
            removeClass(jalidate.requiredCSS, jalidate.input);
            addClass(jalidate.validCSS, jalidate.input);
        } catch (e) {
            console.log(e);
        }
    }

    // Set the display using the invalid styles
    jalidate.setInvalidDisplay = function (field, additionalFields, validationEvents, ignoreTouched) {
        try {
            jalidate.icon = additionalFields[0];
            jalidate.input = field;

            if (!runEvent(validationEvents, jalidate.invalidEvent)) return;
            if (!ignoreTouched && !hasClass(jalidate.touchedCss, jalidate.input)) return;

            switchValidationMessage();

            removeClass(jalidate.requiredCSS, jalidate.icon);
            removeClass(jalidate.iconValidCSS, jalidate.icon);
            addClass(jalidate.iconInvalidCSS, jalidate.icon);

            removeClass(jalidate.validCSS, jalidate.input);
            removeClass(jalidate.requiredCSS, jalidate.input);
            addClass(jalidate.invalidCSS, jalidate.input);
        } catch (e) {
            console.log(e);
        }
    }

    // Set the display using the required styles
    jalidate.setRequiredDisplay = function (field, additionalFields, validationEvents) {
        try {

            jalidate.icon = additionalFields[0];
            jalidate.input = field;

            if (!runEvent(validationEvents, jalidate.validEvent)) return;
            if (!hasClass(jalidate.touchedCss, jalidate.input)) return;

            switchValidationMessage(true);

            removeClass(jalidate.iconValidCSS, jalidate.icon);
            removeClass(jalidate.iconInvalidCSS, jalidate.icon);
            addClass(jalidate.requiredCSS, jalidate.icon);

            removeClass(jalidate.invalidCSS, jalidate.input);
            removeClass(jalidate.validCSS, jalidate.input);
            // We don't change the color of the input label / text to orange as it would reduce readability
        } catch (e) {
            console.log(e);
        }
    }

    // Bind an event listener to perform validation
    jalidate.bindValidator = function (field, additionalFields, listener, validationEvents, preEventFunction) {

        field.addEventListener(listener, function (event) {
            
            var runDefault = true;
            
            if (typeof preEventFunction !== typeof undefined && preEventFunction !== "") {
                // Running this pre event can break us out of the validation and allow us to call the functions directly
                // This is only in use for the materialize select
                runDefault = preEventFunction(field, additionalFields); // or we can use -> preEventFunction.call(); 
            }

            if (runDefault) {
                if (event.target.checkValidity()) {
                    jalidate.setValidDisplay(event.target, additionalFields, validationEvents);
                }
                else {
                    jalidate.setInvalidDisplay(event.target, additionalFields, validationEvents);
                }
            }
        });
    }

    // TODO: This is not complete!!!
    // Basic legacy validation checking
    jalidate.legacyValidation = function (field) {

        var
            valid = true,
            val = field.value,
            type = field.getAttribute("type"),
            chkbox = (type === "checkbox" || type === "radio"),
            required = field.getAttribute("required"),
            minlength = field.getAttribute("minlength"),
            maxlength = field.getAttribute("maxlength"),
            pattern = field.getAttribute("pattern");

        // disabled fields should not be validated
        if (field.disabled) return valid;

        // value required?
        valid = valid && (!required ||
            (chkbox && field.checked) ||
            (!chkbox && val !== "")
        );

        // minlength or maxlength set?
        valid = valid && (chkbox || (
            (!minlength || val.length >= minlength) &&
            (!maxlength || val.length <= maxlength)
        ));

        // test pattern
        if (valid && pattern) {
            pattern = new RegExp(pattern);
            valid = pattern.test(val);
        }

        return valid;
    }

    // *******************************************************************************************
    // Private Methods
    // *******************************************************************************************

    // Check if the class is present and if not, add it
    function addClass(ccsClass, element) {
        if (!$(element).hasClass(ccsClass))
            $(element).addClass(ccsClass);
    }

    // Check if the class is present and if it is, remove it
    function removeClass(ccsClass, element) {
        if ($(element).hasClass(ccsClass))
            $(element).removeClass(ccsClass);
    }

    // Check if the class is present
    function hasClass(ccsClass, element) {
        if ($(element).hasClass(ccsClass) === true)
            return true;
        else
            return false;
    }

    // Get the validation message to display based on the type of validation that failed
    // Here we access the HTML 5 validation object to see what part of the validation failed so we can display a more specific message
    function getValidationMessage() {

        if (jalidate.input.checkValidity()) {
            jalidate.message = null;
        } else if (jalidate.input.validity.valueMissing === true) {
            jalidate.message = $(jalidate.input).attr("data-val-req-msg");
        } else if (jalidate.input.validity.patternMismatch === true) {
            jalidate.message = $(jalidate.input).attr("data-val-pat-msg");
        } else {
            jalidate.message = $(jalidate.input).attr("data-val-msg");
        }

        // This is a catch all that will return the default message
    }

    // Determines if the validation event shoul be run
    function runEvent(validationEvents, event) {
        return validationEvents.includes(event);
    }

    // Switch the validation message to the current message on the field
    function switchValidationMessage(toEmpty) {

        if (toEmpty) {
            jalidate.message = "";
        } else {
            getValidationMessage();
        }
        
        jalidate.label = $(jalidate.input).nextUntil(jalidate.validationMessageCss);

        // We get more than one label returned in the array so we have to look for the label with the validation css class
        for (var index = 0; index < jalidate.label.length; index++) {
            if (hasClass(jalidate.validationMessageCss, jalidate.label[index])) {
                jalidate.label[index].textContent = jalidate.message;                
                break;
            }
        }
    }

    //// Check if the field is valid
    //function validate(field, additionalFields) {

    //    // Have to get the group fields for select inputs differently due to using the materialize select control
    //    if (field.nodeName === "INPUT" || field.nodeName === "TEXTAREA") {
    //        icon = $(field).prev();
    //        label = $(field).next();
    //    } else if (field.nodeName === "SELECT") {
    //        icon = $(field).closest("div").prev();
    //        label = $(field).closest("div").next();
    //    }

    //    if (field.checkValidity()) {                        
    //        jalidate.setValidDisplay($(field)[0], [icon[0], label[0]], ["valid", "invalid"]);
    //    } else {            
    //        jalidate.setInvalidDisplay($(field)[0], [icon[0], label[0]], ["valid", "invalid"]);
    //    }
    //}

}(window.jalidate = window.jalidate || {}, jQuery));