window.onload = function () {
    var bodyElement = $("body");
    var cookieElementText = "<div class='cookie-wrapper' id='cookie-block'>" +
                                "<span class='inner-text'>COOkie</span>" +
                            "</div>";
    var closeIconElement = $("<i class='close-icon'>" +
                                "<svg aria-hidden=\"true\" data-prefix=\"far\" data-icon=\"times\" role=\"img\" width=\"12px\" height=\"12px\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 384 512\" class=\"svg-inline--fa fa-times fa-w-12 fa-2x\"><path fill=\"currentColor\" d=\"M231.6 256l130.1-130.1c4.7-4.7 4.7-12.3 0-17l-22.6-22.6c-4.7-4.7-12.3-4.7-17 0L192 216.4 61.9 86.3c-4.7-4.7-12.3-4.7-17 0l-22.6 22.6c-4.7 4.7-4.7 12.3 0 17L152.4 256 22.3 386.1c-4.7 4.7-4.7 12.3 0 17l22.6 22.6c4.7 4.7 12.3 4.7 17 0L192 295.6l130.1 130.1c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17L231.6 256z\" class=\"\"></path></svg>" +
                            "</i>");
    closeIconElement.on("click", function() {
        console.log("click close");
        cookieElement.remove();
    });
    var cookieElement = $(cookieElementText);
    cookieElement.append(closeIconElement);
    bodyElement.append(cookieElement);
};