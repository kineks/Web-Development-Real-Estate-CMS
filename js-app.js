// We wll use sUserView to keep track of the user's position
var sUserView = "defaultWindow";

// bTimerCheck is a boolean that either permits updating properties
var bTimerCheck = false;

// We increase iLastPropertyId by the amount of properties we have in the array
var iLastPropertyId = 0;

// We will use this to only get nottifications for the new properties
var iPreloadedProperties;

// We increase iLastUserId when we go through the Users array, using this
// to GET the maximum amount of elements. Unlike properties, we don't
// need a iPreloadedUsers because we do not send notiffications
// each time a new user signs ups
var iLastUserId = 0;

// Reminder of past clientside authentication
var iAccesRights = 0;

// Boolean that checks if the menu is open or not
var bMenuOpen = false;

// In order to enable title flashing we need to old the default title in a var
var oldTitle = document.title;

// We'll keep track of our validation errors through this.
var validator = 0;


/************************************************************************/
/************************************************************************/
/************************************************************************/
$("#previewMap").click(function() {
    var sLatitude = $("#txt-lat").val();
    var sLong = $("#txt-lon").val();
    sLatitude = parseFloat(sLatitude);
    sLong = parseFloat(sLong);
    initMap(sLatitude, sLong);
});


function initMap(lat, lng) {

    var iLat = lat;
    var iLng = lng;
    var myLatLng = {
        lat: iLat,
        lng: iLng
    };

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: myLatLng
    });

    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Hello World!'
    });
}

// I changed the google maps suggested function a little bit in order to
// be able to load multiple maps.
function initMap2(lat, lng, number) {

    var iLat = lat;
    var iLng = lng;
    var myLatLng = {
        lat: iLat,
        lng: iLng
    };

    // Testing lat and long inside the function.
    var myLatlng = new google.maps.LatLng(lat, lng);

    var map = new google.maps.Map(document.getElementById('map' + number), {
        zoom: 12,
        center: myLatlng
    });


    google.maps.event.addListener(map, 'idle', function(event) {
        map.setCenter(myLatlng); //force to set original center position
    });

    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Hello World!'
    });
}

/************************************************************************/
/************************************************************************/
/************************************************************************/


// Title flashing which shows only the name ( restricted by space in the tittle bar)
function fnFlashTitle(property) {

    // the interval will change the title every 1 second for as long
    // as you're not focusing the window
    var flashTimer = setInterval(function() {
        var title = document.title;
        var propertyMessage = "New Property : " + property;
        document.title = (title == propertyMessage ? oldTitle : propertyMessage);
    }, 1000);
    window.onfocus = function() {
        document.title = oldTitle;
        clearInterval(flashTimer);
    }
}

/************************************************************************/
/************************************************************************/
/************************************************************************/

Notification.requestPermission().then(function(result) {
});

// Template for the Notification, which we will only have to fill with
// parameters
function spawnNotification(theBody, theIcon, theTitle) {
    var options = {
        body: theBody,
        icon: "images/" + theIcon
    }
    var n = new Notification(theTitle, options);
}

/************************************************************************/
/************************************************************************/
/************************************************************************/

// We will track the amount of images we can upload through this var
// tags : image upload, images, images-upload
var iElementNumber = 0;
$(document).on('change', '[type="file"]', function() {
    var preview = new FileReader();
    // We use readAsDataURL as a base64 encoded string
    preview.readAsDataURL(this.files[0]);

    // We asign self = this because we will want to use the "this" of this
    // scope inside a funciton nested inside, so we will not be able to refference
    // it via "this"
    var self = this;
    preview.onload = function(event) {
        $(self).siblings(".img-preview").attr("src", event.target.result);
    }
    if ($(self).siblings(".img-preview").attr("src") == "") {
        fnCreateImageInput();
    } else {}
});

// The max amount you can upload is 6 images
function fnCreateImageInput() {
    iElementNumber++;
    if (iElementNumber <= 5) {
        var sDiv = '<div class="image-column">\
        <img class="img-preview" src=""></img>\
        <input class="file" type="file" name="file-' + iElementNumber + '">\
        </div>';
        $(".image-holder").append(sDiv);
    }
}

//The two submitting functions for the forms
$("#saveProperty").click(function() {
    $("#frm-property").submit();
});

$("#tryLoggin").click(function() {
    $("#frm-login").submit();
});

$("#frm-property").on('submit', function(e) {
    e.preventDefault();
    var sPropertyId = $("#txt-create-property-id").val();
    var sPropertyAddress = $("#txt-create-property-address").val();
    // We check if the sPropertyId is empty or not.
    // if var sPropertyId = $("#txt-create-property-id").val(); equal to an empty string
    // it means we will go to the CREATE property ajax call otherwise to the EDIT
    if (sPropertyId !== "") {
        $.ajax({
            "url": "api-update-property.php",
            "method": "post",
            "data": new FormData(this),
            "contentType": false,
            "processData": false,
            "cache": false
        });
    } else {
        swal("Property created !", sPropertyAddress + " has been created!", "success");
        $.ajax({
            "url": "api-create-property.php",
            "method": "post",
            "data": new FormData(this),
            "contentType": false,
            "processData": false,
            "cache": false
        });
    }
    // select the create property div for the id
});


/************************************************************************/
/************************************************************************/
/************************************************************************/
$(document).on("click", ".link", function() {
    $(".wdw").hide();
    var sWindowToShow = $(this).attr("data-go-to");
    $("#" + sWindowToShow).css({
        "display": "flex"
    });
    // getting values from the sibling
    var sPropertyIdToEdit = $(this).siblings(".lbl-property-id").text();
    var sPropertyAddressToEdit = $(this).siblings(".lbl-property-address").text();
    var sPropertyPriceToEdit = $(this).siblings(".lbl-property-price").text();
    // select the create property div for the id
    $("#txt-create-property-id").val(sPropertyIdToEdit);
    $("#txt-create-property-address").val(sPropertyAddressToEdit);
    $("#txt-create-property-price").val(sPropertyPriceToEdit);
    var sUserIdToEdit = $(this).siblings(".lbl-user-id").text();
    var sUsernameToEdit = $(this).siblings(".lbl-user-username").text();
    var sPasswordToEdit = $(this).siblings(".lbl-user-password").text();
    $("#txt-create-user-id").val(sUserIdToEdit);
    $("#txt-create-user-username").val(sUsernameToEdit);
    $("#txt-create-user-password").val(sPasswordToEdit);
    userView = sWindowToShow;
    fnStartUserTimeout();
});

// Right click mouse function
// Taggs so you can find while searching :
// rightClick right-click
$(".wdw").contextmenu(function(event) {
    fnCheckLogin();
    fnShowMenu();
    event.preventDefault();
});


/************************************************************************/
/************************************************************************/
/************************************************************************/

//succesfull and unsucessfull function are put here and not inside the
// the main loggin function, if we simply call them in the loggin main function
// we will have a more readable syntax
function successfulLoggin() {
    swal({
            title: "You have logged in",
            type: "success",
            confirmButtonColor: "#64DD17",
            confirmButtonText: "Continue",
            closeOnConfirm: true
        },
        function() {
            fnCheckLogin();
        	fnClearAndGetProperties();
            // Because we do not want to hide the divs containing the wdw class
            // we only call this function on success. There is no need to hide the
            // wdw and display wdw-properties if the attempt is unsucessfull
            $(".wdw").hide();
            $("#wdw-properties").css({
                "display": "flex"
            });
            userView = "wdw-properties";
            fnStartUserTimeout();
              

        });
}

function unsucessfulLoggin() {
    swal({
        title: "Incorrect loggin",
        type: "error",
        confirmButtonColor: "#f44336",
        confirmButtonText: "Try again",
        closeOnConfirm: true,
        showCancelButton: false
    })
};

// Ajax call when we want to log in. The POST method will send the data
// we have entered in the form ( username + password ) to the api-login.php
// page. On .done ( when the post method has been finished ), we can check
// the actual response we're getting from PHP with function(data).
// The data inside this functions are actually the -echo-s from php
// which change depending if we inserted a correct username or not.
$("#frm-login").on('submit', function(e) {
    e.preventDefault();
    $.ajax({
        "url": "api-login.php",
        "method": "post",
        "data": new FormData(this),
        "contentType": false,
        "processData": false,
        "cache": false
    }).done(function(data) {
        // We decode the (data) in order to transform it into a JSON object.
        var statusType = JSON.parse(data);
        if (statusType.status == "ok") {
            successfulLoggin();
        } else {
            unsucessfulLoggin();
        }

    });
});

$("#btn-save-user").click(function() {
    var oParent = $(this).parent();
    validator = 0;
    var aoChildren = oParent.children('input');
    for (var i = 0; i < aoChildren.length; i++) {
        var oInput = $(aoChildren[i]);
        oInput.removeClass('invalid');
        var sText = oInput.val();
        var iMin = oInput.attr('data-min');
        var iMax = oInput.attr('data-max');
        if (sText.length < iMin || sText.length > iMax) {
            oInput.addClass('invalid');
        } else {}
    }
    validateLoggin();
});



function validateLoggin() {

    var sId = $("#txt-create-user-id").val();
    var sUsername = $("#txt-create-user-username").val();
    var sPassword = $("#txt-create-user-password").val();
    if (sId) {
        var sUrl = "api-update-user.php?id=" + sId + "&username=" + sUsername + "&password=" + sPassword;
        iLastUserId = 0;
        swal({
                title: sUsername + " has been updated",
                text: "Password = " + sPassword,
                type: "success",
                showCancelButton: true,
                confirmButtonColor: "#64DD17",
                confirmButtonText: "Go back to the user list",
                cancelButtonText: "Continue editting",
                closeOnConfirm: true
            },
            function() {
                $(".wdw").hide();
                $("#wdw-users").css({
                    "display": "flex"
                });
                userView = "wdw-users";
                fnStartUserTimeout();
            });
        $("#userBody").empty();
    } else {
        var sUrl = "api-create-user.php?username=" + sUsername + "&password=" + sPassword;
        $.getJSON(sUrl, function(jData) {

            if (jData.status == "ok") {
                swal({
                        title: sUsername + " has been created",
                        text: "Password = " + sPassword,
                        type: "success",
                        showCancelButton: false,
                        confirmButtonColor: "#64DD17",
                        confirmButtonText: "Go to the user list",
                        closeOnConfirm: true
                    },
                    function() {
                        $(".wdw").hide();
                        $("#wdw-login").css({
                            "display": "flex"
                        });
                        userView = "wdw-users";
                        fnStartUserTimeout();
                    });
            } else if (jData.status == "error") {
                swal({
                    title: "Error Singing up.",
                    text: "Username already exists.",
                    type: "error",
                    showCancelButton: false,
                    confirmButtonColor: "#f44336",
                    confirmButtonText: "Retry",
                    closeOnConfirm: true
                });
            } else if (jData.status == "email") {
                swal({
                    title: " Error Signing up.",
                    text: "Invalid Email.",
                    type: "error",
                    showCancelButton: false,
                    confirmButtonColor: "#f44336",
                    confirmButtonText: "Retry",
                    closeOnConfirm: true
                });
            }


        });
    }
}




/************************************************************************/
/************************************************************************/
/************************************************************************/

$('[data-go-to="wdw-properties"]').click(function() {
    /*  fnGetProperties();*/
    // I have removed this function because I impleted the userView which reads if the user
    // looks at the wdw-properties, so we no longer need to check the click
});


$(document).on("click", ".btn-delete-property", function() {
    var sIdToDelete = $(this).siblings(".lbl-property-id").text();
    var oTheParent = $(this).parent();
    var sUrl = "api-delete-property.php?id=" + sIdToDelete;
    swal({
            title: "Are you sure you want to delete this property?",
            type: "warning",
            confirmButtonColor: "#64DD17",
            confirmButtonText: "Continue",
            closeOnConfirm: true,
            showCancelButton: true
        },
        function() {
            $.getJSON(sUrl, function(jData) {
                if (jData.status == "ok") {
                    oTheParent.remove();
                }
            });

        });



});


$(document).on("click", ".btn-delete-user", function() {


    var sIdToDelete = $(this).siblings(".lbl-user-id").text();
    var oTheParent = $(this).parent();
    var sUrl = "api-delete-user.php?id=" + sIdToDelete;

    swal({
            title: "Are you sure you want to delete this user?",
            type: "warning",
            confirmButtonColor: "#64DD17",
            confirmButtonText: "Continue",
            closeOnConfirm: true,
            showCancelButton: true
        },
        function() {
            $.getJSON(sUrl, function(jData) {
                if (jData.status == "ok") {
                    oTheParent.remove();
                }
            });


        });



});

/************************************/

$(document).on("click", ".btn-promote-admin", function() {



    var sIdToDelete = $(this).siblings(".lbl-user-id").text();
    var oTheParent = $(this).parent();
    var localThis = $(this);
    var sUrl = "api-promote-user.php?id=" + sIdToDelete;

    $.getJSON(sUrl, function(jData) {
        if (jData.status == "ok") {

            localThis.css({
                "opacity": "0"
            });
            oTheParent.addClass("admin-user");
        }
    });
});


/************************************************************************/
/************************************************************************/
/************************************************************************/

function fnCheckRights() {
    $.ajax({
        "url": "api-check-rights.php",
        "method": "get",
        "contentType": false,
        "processData": false,
        "cache": false
    }).done(function(data) {
        var messageBackData = JSON.parse(data);
        iAccesRights = messageBackData[0].rights;

    });
}

function fnFirstWindow() {
     $.ajax({
        "url": "api-check-rights.php",
        "method": "get",
        "contentType": false,
        "processData": false,
        "cache": false
    }).done(function(data) {
        var messageBackData = JSON.parse(data);
        iAccesRights = messageBackData[0].rights;
        if (iAccesRights >= 2) {
        $("#wdw-login").hide();
        $("#wdw-properties").css({
            "display": "flex"
        });
    }
    else{}


    });
    
}




function fnCheckLogin() {


    $.ajax({
        "url": "api-check-rights.php",
        "method": "get",
        "contentType": false,
        "processData": false,
        "cache": false
    }).done(function(data) {
        console.log(data);
        var messageBackData = JSON.parse(data);
        iAccesRights = messageBackData[0].rights;
    });

    $.ajax({
        "url": "api-session-check.php",
        "method": "get",
        "contentType": false,
        "processData": false,
        "cache": false
    }).done(function(data) {
        $("#upperMenu").empty();
        $("#lowerMenu").empty();
        // We decode the (data) in order to transform it into a JSON object.
        // Enable the console log bellow to see the data we get ( the divs and their possition );
        var messageBackData = JSON.parse(data);
        var jsonArray = messageBackData[1];

        for (var i = 0; i < messageBackData.length; i++) {
            var obj = messageBackData[i];
            var possition = messageBackData[i].position;
            if (obj.position == "top") {
                $("#upperMenu").append(messageBackData[i].divsToAppend);

            } else if (obj.position == "bottom") {
                $("#lowerMenu").prepend(messageBackData[i].divsToAppend);
            }
        };
    });
}

function fnAdminCheck() {

}
/************************************************************************/
/************************************************************************/
/************************************************************************/
function fnGetUsers() {
    var sUrl = "api-get-users.php?maxId=" + iLastUserId;
    $.getJSON(sUrl, function(jData) {




        function fnUserLabelAdminCheck() {
            if (iAccesRights == 2) {

                return '    <div class="lbl-user-password">{{password}}</div>\
                    <div class="userDetails"><div data-go-to="wdw-sign-up" class="fa fa-edit link fa-icon-center"></div>\
                    <div class="fa fa-trash btn-delete-user fa-icon-center"></div></div>';
            }

            if (iAccesRights == 3) {

                return '    <div class="lbl-user-password">{{password}}</div>\
                    <div class="userDetails"><div data-go-to="wdw-sign-up" class="fa fa-edit link fa-icon-center"></div>\
                    <div class="fa fa-trash btn-delete-user fa-icon-center"></div>';
            } else {
                return "";
            }
        }

        function fnCheckPromote(index) {

            if (jData[index].iAccesRights == 1) {
                return '<div class="fa fa-plus-circle fa-fw btn-promote-admin"></div>';
            } else {
                return '<div class="fa-fw style="display:none" "></div></div>';
            }


        }

        function fnCheckAdmin(index) {

            if (jData[index].iAccesRights > 1) {
                return "admin-user";
            } else {
                return "";
            }
        }


        var sUser = '   <div class="lbl-property materialButton userButton {{span1}}">\
            <div class="lbl-user-id">{{id}}</div>\
            <div class="lbl-user-username">{{username}}</div>\
            ' + fnUserLabelAdminCheck() + '\
            {{promote}}</div>';

        for (var i = 0; i < jData.length; i++) {
            var sUserTemplate = sUser;
            sUserTemplate = sUserTemplate.replace("{{id}}", jData[i].sUniqueId);
            sUserTemplate = sUserTemplate.replace("{{username}}", jData[i].sUsername);
            sUserTemplate = sUserTemplate.replace("{{span1}}", fnCheckAdmin(i));
            sUserTemplate = sUserTemplate.replace("{{password}}", jData[i].sPassword);
            sUserTemplate = sUserTemplate.replace("{{promote}}", fnCheckPromote(i));

            $("#userBody").append(sUserTemplate);
            iLastUserId++;
        }


    });
}


/************************************************************************/
/************************************************************************/
/************************************************************************/
function propertiesMapLoader() {
    var sUrl = "api-get-all-properties.php?maxId=" + iLastPropertyId;
    $.getJSON(sUrl, function(jData) {
        for (var i = 0; i < jData.length; i++) {

            // Testing the value of I from the newly created api-get-all-properties;
            //console.log("I checker - " + i );
            var propLat = parseFloat(jData[i].lat);
            var propLon = parseFloat(jData[i].lon);
            initMap2(propLat, propLon, i + 2);
        }

    });
}


function fnClearAndGetProperties(){

    $("#propertiesBody").empty();
    iLastPropertyId = 0;
    var sUrl = "api-get-properties.php?maxId=" + iLastPropertyId;
    $.getJSON(sUrl, function(jData) {
         

        // Set a global variable equal to the initial amount of properties
        // We do this in order to only get notiffications from the ones that have a key bigger than iPreloadedProperties
        if (iPreloadedProperties == null) {
            iPreloadedProperties = jData.length;

        }

        var sProperty = '   <div class="lbl-property materialButton">\
        ' + fnPropertyLabelAdminCheck() + '\
        <div class="lbl-property-id">{{id}}</div>\
        <div class="lbl-property-address">{{address}}</div>\
        <div class="lbl-property-price">{{price}}</div>\
        <div class="lbl-property-images">{{image}}</div>\
        <div class="lbl-property-map-container"><div id="map{{i}}"></div></div>\
                </div>';

        function fnPropertyLabelAdminCheck() {
            if (iAccesRights > 1) {
                return '    <div data-go-to="wdw-create-property" class="fa fa-edit fa-fw link fa-icon-center"></div>\
                <div class="fa fa-trash fa-fw btn-delete-property fa-icon-center"></div>';
            } else {
                return "";
            }
        }


        function fetchImages(count) {
            var imagesToDisplay = "";
            if (count.saImages.length == 0) {
                return "";
            } else {
                for (var i = 0; i < count.saImages.length; i++) {

                    imagesToDisplay += '<img class="propertyImages" src=images/' + count.saImages[i] + '>';

                    if (i + 1 == count.saImages.length) {
                        return (imagesToDisplay);
                    }
                }
            }


        }
        // Testing response from api
        // console.log(jData);
        for (var i = 0; i < jData.length; i++) {
            var mapCounter = i + 2;
            var sPropertyTemplate = sProperty;
            sPropertyTemplate = sPropertyTemplate.replace("{{id}}", jData[i].sUniqueId);
            sPropertyTemplate = sPropertyTemplate.replace("{{address}}", jData[i].sAddress);
            sPropertyTemplate = sPropertyTemplate.replace("{{price}}", jData[i].iPrice);
            sPropertyTemplate = sPropertyTemplate.replace("{{i}}", mapCounter);
            sPropertyTemplate = sPropertyTemplate.replace("{{image}}", fetchImages(jData[i]));
            $("#propertiesBody").append(sPropertyTemplate);

            var mapValue = "#map" + mapCounter;

            // Testing the map value. Enable it to see which map is affected.
            // console.log(mapValue);
            $(mapValue).css("height", "100%");

            // Testing the I value. Enable to see the size of I.
            //console.log("i = " + i );
            var propLat = parseFloat(jData[i].lat);
            var propLon = parseFloat(jData[i].lon);

            // Testing the Latitude and Longitude after parsing.
            //console.log(propLat, propLon);
            initMap2(propLat, propLon, mapCounter);
            iLastPropertyId++;
            if (iLastPropertyId > iPreloadedProperties) {
                // We check if the position in the array is bigger than the initial amount of properties
                spawnNotification("Asking price is " + jData[i].iPrice, jData[i].sPreviewImage, "A new propertry has been added on " + jData[i].sAddress);
                document.getElementById('notification').play();
                // IF we have a new property, the title will flash with it's name
                fnFlashTitle(jData[i].sAddress);
            }




        }


    });

}

function fnGetProperties() {

    var sUrl = "api-get-properties.php?maxId=" + iLastPropertyId;
    $.getJSON(sUrl, function(jData) {

        // Set a global variable equal to the initial amount of properties
        // We do this in order to only get notiffications from the ones that have a key bigger than iPreloadedProperties
        if (iPreloadedProperties == null) {
            iPreloadedProperties = jData.length;

        }

        var sProperty = '   <div class="lbl-property materialButton">\
        ' + fnPropertyLabelAdminCheck() + '\
        <div class="lbl-property-id">{{id}}</div>\
        <div class="lbl-property-address">{{address}}</div>\
        <div class="lbl-property-price">{{price}}</div>\
        <div class="lbl-property-images">{{image}}</div>\
        <div class="lbl-property-map-container"><div id="map{{i}}"></div></div>\
                </div>';

        function fnPropertyLabelAdminCheck() {
            if (iAccesRights > 1) {
                return '    <div data-go-to="wdw-create-property" class="fa fa-edit fa-fw link fa-icon-center"></div>\
                <div class="fa fa-trash fa-fw btn-delete-property fa-icon-center"></div>';
            } else {
                return "";
            }
        }


        function fetchImages(count) {
            var imagesToDisplay = "";
            if (count.saImages.length == 0) {
                return "";
            } else {
                for (var i = 0; i < count.saImages.length; i++) {

                    imagesToDisplay += '<img class="propertyImages" src=images/' + count.saImages[i] + '>';

                    if (i + 1 == count.saImages.length) {
                        return (imagesToDisplay);
                    }
                }
            }


        }
        // Testing response from api
        // console.log(jData);
        for (var i = 0; i < jData.length; i++) {
            var mapCounter = i + 2;
            var sPropertyTemplate = sProperty;
            sPropertyTemplate = sPropertyTemplate.replace("{{id}}", jData[i].sUniqueId);
            sPropertyTemplate = sPropertyTemplate.replace("{{address}}", jData[i].sAddress);
            sPropertyTemplate = sPropertyTemplate.replace("{{price}}", jData[i].iPrice);
            sPropertyTemplate = sPropertyTemplate.replace("{{i}}", mapCounter);
            sPropertyTemplate = sPropertyTemplate.replace("{{image}}", fetchImages(jData[i]));
            $("#propertiesBody").append(sPropertyTemplate);

            var mapValue = "#map" + mapCounter;

            // Testing the map value. Enable it to see which map is affected.
            // console.log(mapValue);
            $(mapValue).css("height", "100%");

            // Testing the I value. Enable to see the size of I.
            //console.log("i = " + i );
            var propLat = parseFloat(jData[i].lat);
            var propLon = parseFloat(jData[i].lon);

            // Testing the Latitude and Longitude after parsing.
            //console.log(propLat, propLon);
            initMap2(propLat, propLon, mapCounter);
            iLastPropertyId++;
            if (iLastPropertyId > iPreloadedProperties) {
                // We check if the position in the array is bigger than the initial amount of properties
                spawnNotification("Asking price is " + jData[i].iPrice, jData[i].sPreviewImage, "A new propertry has been added on " + jData[i].sAddress);
                document.getElementById('notification').play();
                // IF we have a new property, the title will flash with it's name
                fnFlashTitle(jData[i].sAddress);
            }




        }


    });

}



/************************************************************************/
/************************************************************************/
/************************************************************************/

function changeMenuToX(x) {
    x.classList.toggle("change");

}

$("#menu-bars").click(function() {

    if (bMenuOpen == false) {
        fnCheckLogin();
        fnShowMenu();
        bMenuOpen = true;
    }


});




function logOut() {
    $.ajax({
        "url": "api-destroy-session.php",
    });

}

function fnShowMenu() {
    //   Move the menu and create the bouncing animation
    $("#menu").animate({
        "left": "0px"
    }, 400);
    $("#menu").animate({
        "left": "-10px"
    }, 200);

    // show the content cover
    $("#content-cover").css({
        "display": "flex"
    });
    $('.fadeMenuBar').fadeOut();



}

function fnMenuOpenToggle() {
    bMenuOpen = false;
}
$("#content-cover").click(function() {
    fnHideMenu();
});

$(document).on('click', '.link', function() {
    fnHideMenu();
});

function fnHideMenu() {
    //   animate the menu
    $("#menu").animate({
        "left": "-250px"
    }, 400);
    // show the content cover
    $("#content-cover").hide();
    $('#menu-bars').fadeIn(400);
    window.setTimeout(fnMenuOpenToggle(), 400);
    document.getElementById("menu-bars").classList.toggle("change")
}




/************************************************************************/
/************************************************************************/
/************************************************************************/


// Create timer that updates properties
// Only runs if the user is looking at the list
// Stops when user clicks on something else

$(document).ready(function() {
    fnCheckRights();
    
  
    fnFirstWindow();
    fnCreatePropertyTimer();
});


function fnCreatePropertyTimer() {
    fnGetProperties();
    window.timerProperties = setInterval(fnGetProperties, 1500);
}

function fnCreateUserTimer() {
    fnGetUsers();
    window.timerUsers = setInterval(fnGetUsers, 1500);
}


function fnStartUserTimeout() {


    if (userView == "wdw-properties") {
        propertiesMapLoader();
        if (bTimerCheck == false) {

            bTimerCheck = true;
            clearInterval(window.timerUsers);
        } else {
            bTimerCheck = false;
        }
    } else if (userView == "wdw-users") {
        fnCreateUserTimer();

    } else {

        clearInterval(window.timerUsers);
        bTimerCheck = false;

    }



}
