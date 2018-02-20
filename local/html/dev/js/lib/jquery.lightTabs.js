(function ($) {
    jQuery.fn.lightTabs = function (options) {
        var createTabs = function () {
            tabs = this;
            i = 0;
            showPage = function (i) {
                var hash = window.location.hash;
                hash = hash.replace('#', '');

                $(tabs).children(".tabs-content").children("div").hide();
                //$(tabs).children(".tabs-content").children("div").eq(i).show();
                $(tabs).children(".tabs-menu").children("li").removeClass("active");
                //$(tabs).children(".tabs-menu").children("li").eq(i).addClass("active");

                if ($(tabs).children(".tabs-menu").find('a').is('[href=#' + hash + ']') && i == -1) {
                    $(tabs).children(".tabs-menu").find('a[href=#' + hash + ']').parent('li').addClass("active");
                    $(tabs).children(".tabs-content").find('div#' + hash).show();
                }
                else {
                    $(tabs).children(".tabs-content").children("div").eq(i).show();
                    $(tabs).children(".tabs-menu").children("li").eq(i).addClass("active");
                }
            }

            showPage(-1);

            $(tabs).children("ul").children("li").each(function (index, element) {
                $(element).attr("data-page", i);
                i++;
            });
            $(tabs).children("ul").children("li").click(function () {
                showPage(parseInt($(this).attr("data-page")));
            });
        };
        return this.each(createTabs);
    };
})(jQuery);
$(function () {
    $(".tabs-light").lightTabs();
});
