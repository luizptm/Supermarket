var error = 'errorMessage';
var form_selector = 'form[data-ajax="true"]';
var div_output = 'div[id="OutputPanel"]';
var unexpectedErrorMessage = "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.";

$(document).ready(function () {
    //re-set all client validation given a jQuery selected form or child
    $.fn.resetValidation = function () {
        //fonte: http://johnculviner.com/post/2011/11/16/ClearReset-MVC-3-Form-and-Unobtrusive-jQuery-Client-Validation.aspx

        var form = $(form_selector);

        //reset jQuery Validate's internals
        form.validate().resetForm();

        //reset unobtrusive validation summary, if it exists
        form.find("[data-valmsg-summary=true]")
            .removeClass("validation-summary-errors")
            .addClass("validation-summary-valid")
            .find("ul").empty();

        //reset unobtrusive field level, if it exists
        form.find("[data-valmsg-replace]")
            .removeClass("field-validation-error")
            .addClass("field-validation-valid")
            .empty();

        return form;
    };
});

function OnBegin() {
    $("#" + error).html("");
    $(div_output).hide();
    $(this).resetValidation();
}
function OnFailure() {
    $("#" + error).html(unexpectedErrorMessage);
    $(div_output).hide();
}
function OnSuccess() {
    $("#" + error).html("");
    $(div_output).show();
}

$(document).ready(function () {
    var style = 'width:110px; text-align:rigth; color: #636363; font-weight:bold;';
    var message = "<div id='progress' style='" + style + "'>Processando...</div>";
    $(form_selector).after(message);
    $("#progress").hide();
});