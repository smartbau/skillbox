/*
 * jQuery Form Styler v1.7.4
 * https://github.com/Dimox/jQueryFormStyler
 *
 * Copyright 2012-2015 Dimox (http://dimox.name/)
 * Released under the MIT license.
 *
 * Date: 2015.09.12
 *
 */

;(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function ($) {

    'use strict';

    var pluginName = 'styler',
        defaults = {
            wrapper: 'form',
            idSuffix: '-styler',
            filePlaceholder: 'Файл не выбран',
            fileBrowse: 'Обзор...',
            fileNumber: 'Выбрано файлов: %s',
            selectPlaceholder: 'Выберите...',
            selectSearch: false,
            selectSearchLimit: 10,
            selectSearchNotFound: 'Совпадений не найдено',
            selectSearchPlaceholder: 'Поиск...',
            selectVisibleOptions: 0,
            singleSelectzIndex: '100',
            selectSmartPositioning: true,
            onSelectOpened: function () {
            },
            onSelectClosed: function () {
            },
            onFormStyled: function () {
            }
        };

    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this.init();
    }

    Plugin.prototype = {

        // инициализация
        init: function () {

            var el = $(this.element);
            var opt = this.options;

            var iOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/i) && !navigator.userAgent.match(/(Windows\sPhone)/i)) ? true : false;
            var Android = (navigator.userAgent.match(/Android/i) && !navigator.userAgent.match(/(Windows\sPhone)/i)) ? true : false;

            function Attributes() {
                var id = '',
                    title = '',
                    classes = '',
                    dataList = '';
                if (el.attr('id') !== undefined && el.attr('id') !== '') id = ' id="' + el.attr('id') + opt.idSuffix + '"';
                if (el.attr('title') !== undefined && el.attr('title') !== '') title = ' title="' + el.attr('title') + '"';
                if (el.attr('class') !== undefined && el.attr('class') !== '') classes = ' ' + el.attr('class');
                var data = el.data();
                for (var i in data) {
                    if (data[i] !== '' && i !== '_styler') dataList += ' data-' + i + '="' + data[i] + '"';
                }
                id += dataList;
                this.id = id;
                this.title = title;
                this.classes = classes;
            }

            // checkbox
            if (el.is(':checkbox')) {

                var checkboxOutput = function () {

                    var att = new Attributes();
                    var checkbox = $('<div' + att.id + ' class="jq-checkbox' + att.classes + '"' + att.title + '><div class="jq-checkbox__div"></div></div>');

                    // прячем оригинальный чекбокс
                    el.css({
                        position: 'absolute',
                        zIndex: '-1',
                        opacity: 0,
                        margin: 0,
                        padding: 0
                    }).after(checkbox).prependTo(checkbox);

                    checkbox.attr('unselectable', 'on').css({
                        '-webkit-user-select': 'none',
                        '-moz-user-select': 'none',
                        '-ms-user-select': 'none',
                        '-o-user-select': 'none',
                        'user-select': 'none',
                        display: 'inline-block',
                        position: 'relative',
                        overflow: 'hidden'
                    });

                    if (el.is(':checked')) checkbox.addClass('checked');
                    if (el.is(':disabled')) checkbox.addClass('disabled');

                    // клик на псевдочекбокс
                    checkbox.click(function (e) {
                        e.preventDefault();
                        if (!checkbox.is('.disabled')) {
                            {
                                if (el.is(':checked')) {
                                    el.prop('checked', false);
                                    checkbox.parents('label').removeClass('checked');
                                    checkbox.removeClass('checked');
                                } else {
                                    el.prop('checked', true);
                                    checkbox.parents('label').addClass('checked');
                                    checkbox.addClass('checked');
                                }
                            }
                            el.focus().change();


                        }
                    });
                    // клик на label
                    el.closest('label').add('label[for="' + el.attr('id') + '"]').on('click.styler', function (e) {
                        if (!$(e.target).is('a') && !$(e.target).closest(checkbox).length) {
                            checkbox.triggerHandler('click');
                            e.preventDefault();
                        }
                    });
                    // переключение по Space или Enter
                    el.on('change.styler', function () {
                        if (el.is(':checked')) checkbox.addClass('checked');
                        else checkbox.removeClass('checked');
                    })
                    // чтобы переключался чекбокс, который находится в теге label
                        .on('keydown.styler', function (e) {
                            if (e.which == 32) checkbox.click();
                        })
                        .on('focus.styler', function () {
                            if (!checkbox.is('.disabled')) checkbox.addClass('focused');
                        })
                        .on('blur.styler', function () {
                            checkbox.removeClass('focused');
                        });

                }; // end checkboxOutput()

                checkboxOutput();

                // обновление при динамическом изменении
                el.on('refresh', function () {
                    el.closest('label').add('label[for="' + el.attr('id') + '"]').off('.styler');
                    el.off('.styler').parent().before(el).remove();
                    checkboxOutput();
                });

                // end checkbox

                // radio
            } else if (el.is(':radio')) {

                var radioOutput = function () {

                    var att = new Attributes();
                    var radio = $('<div' + att.id + ' class="jq-radio' + att.classes + '"' + att.title + '><div class="jq-radio__div"></div></div>');

                    // прячем оригинальную радиокнопку
                    el.css({
                        position: 'absolute',
                        zIndex: '-1',
                        opacity: 0,
                        margin: 0,
                        padding: 0
                    }).after(radio).prependTo(radio);

                    radio.attr('unselectable', 'on').css({
                        '-webkit-user-select': 'none',
                        '-moz-user-select': 'none',
                        '-ms-user-select': 'none',
                        '-o-user-select': 'none',
                        'user-select': 'none',
                        display: 'inline-block',
                        position: 'relative'
                    });

                    if (radio.is('.circle')) {
                        radio.parents('label').addClass('circle');
                    }

                    if (el.is(':checked')) {
                        radio.addClass('checked');
                        radio.parents('label').addClass('checked');
                    }
                    if (el.is(':disabled')) {
                        radio.addClass('disabled');
                        radio.parents('label').removeClass('checked');
                    }

                    // клик на псевдорадиокнопке
                    radio.click(function (e) {
                        e.preventDefault();
                        if (!radio.is('.disabled')) {
                            radio.closest(opt.wrapper).find('input[name="' + el.attr('name') + '"]').prop('checked', false).parent().removeClass('checked');
                            el.prop('checked', true).parent().addClass('checked');
                            el.focus().change();

                            //if (radio.is('.circle')){
                            radio.parents('label').prop('checked', true).addClass('checked');
                            //}
                        }
                    });
                    // клик на label
                    el.closest('label').add('label[for="' + el.attr('id') + '"]').on('click.styler', function (e) {
                        if (!$(e.target).is('a') && !$(e.target).closest(radio).length) {
                            radio.triggerHandler('click');
                            e.preventDefault();
                        }
                    });
                    // переключение стрелками
                    el.on('change.styler', function () {
                        el.parent().addClass('checked');
                    })
                        .on('focus.styler', function () {
                            if (!radio.is('.disabled')) radio.addClass('focused');
                        })
                        .on('blur.styler', function () {
                            radio.removeClass('focused');
                        });

                }; // end radioOutput()

                radioOutput();

                // обновление при динамическом изменении
                el.on('refresh', function () {
                    el.closest('label').add('label[for="' + el.attr('id') + '"]').off('.styler');
                    el.off('.styler').parent().before(el).remove();
                    radioOutput();
                });

                // end radio

                // file
            } else if (el.is(':file')) {

                // прячем оригинальное поле
                el.css({
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    margin: 0,
                    padding: 0
                });

                var fileOutput = function () {

                    var att = new Attributes();
                    var placeholder = el.data('placeholder');
                    if (placeholder === undefined) placeholder = opt.filePlaceholder;
                    var browse = el.data('browse');
                    if (browse === undefined || browse === '') browse = opt.fileBrowse;
                    var file = $('<div' + att.id + ' class="jq-file' + att.classes + '"' + att.title + ' style="display: inline-block; position: relative; overflow: hidden"></div>');
                    var name = $('<div class="jq-file__name">' + placeholder + '</div>').appendTo(file);
                    $('<div class="jq-file__browse">' + browse + '</div>').appendTo(file);
                    el.after(file).appendTo(file);

                    if (el.is(':disabled')) file.addClass('disabled');

                    el.on('change.styler', function () {
                        var value = el.val();
                        if (el.is('[multiple]')) {
                            value = '';
                            var files = el[0].files.length;
                            if (files > 0) {
                                var number = el.data('number');
                                if (number === undefined) number = opt.fileNumber;
                                number = number.replace('%s', files);
                                value = number;
                            }
                        }
                        name.text(value.replace(/.+[\\\/]/, ''));
                        if (value === '') {
                            name.text(placeholder);
                            file.removeClass('changed');
                        } else {
                            file.addClass('changed');
                        }
                    })
                        .on('focus.styler', function () {
                            file.addClass('focused');
                        })
                        .on('blur.styler', function () {
                            file.removeClass('focused');
                        })
                        .on('click.styler', function () {
                            file.removeClass('focused');
                        });

                }; // end fileOutput()

                fileOutput();

                // обновление при динамическом изменении
                el.on('refresh', function () {
                    el.off('.styler').parent().before(el).remove();
                    fileOutput();
                });

                // end file

            } else if (el.is('input[type="number"]')) {

                var numberOutput = function () {

                    var number = $('<div class="jq-number"><div class="jq-number__spin minus"></div><div class="jq-number__spin plus"></div></div>');
                    el.after(number).prependTo(number).wrap('<div class="jq-number__field"></div>');

                    if (el.is(':disabled')) number.addClass('disabled');

                    var min,
                        max,
                        step,
                        timeout = null,
                        interval = null;
                    if (el.attr('min') !== undefined) min = el.attr('min');
                    if (el.attr('max') !== undefined) max = el.attr('max');
                    if (el.attr('step') !== undefined && $.isNumeric(el.attr('step')))
                        step = Number(el.attr('step'));
                    else
                        step = Number(1);

                    var changeValue = function (spin) {
                        var value = el.val(),
                            newValue;
                        if (!$.isNumeric(value)) {
                            value = 0;
                            el.val('0');
                        }
                        if (spin.is('.minus')) {
                            newValue = parseInt(value, 10) - step;
                            if (step > 0) newValue = Math.ceil(newValue / step) * step;
                        } else if (spin.is('.plus')) {
                            newValue = parseInt(value, 10) + step;
                            if (step > 0) newValue = Math.floor(newValue / step) * step;
                        }
                        if ($.isNumeric(min) && $.isNumeric(max)) {
                            if (newValue >= min && newValue <= max) el.val(newValue);
                        } else if ($.isNumeric(min) && !$.isNumeric(max)) {
                            if (newValue >= min) el.val(newValue);
                        } else if (!$.isNumeric(min) && $.isNumeric(max)) {
                            if (newValue <= max) el.val(newValue);
                        } else {
                            el.val(newValue);
                        }
                    };

                    if (!number.is('.disabled')) {
                        number.on('mousedown', 'div.jq-number__spin', function () {
                            var spin = $(this);
                            changeValue(spin);
                            timeout = setTimeout(function () {
                                interval = setInterval(function () {
                                    changeValue(spin);
                                }, 40);
                            }, 350);
                        }).on('mouseup mouseout', 'div.jq-number__spin', function () {
                            clearTimeout(timeout);
                            clearInterval(interval);
                        });
                        el.on('focus.styler', function () {
                            number.addClass('focused');
                        })
                            .on('blur.styler', function () {
                                number.removeClass('focused');
                            });
                    }

                }; // end numberOutput()

                numberOutput();

                // обновление при динамическом изменении
                el.on('refresh', function () {
                    el.off('.styler').closest('.jq-number').before(el).remove();
                    numberOutput();
                });

                // end number

                // select
            } else if (el.is('select')) {

                var selectboxOutput = function () {

                    // запрещаем прокрутку страницы при прокрутке селекта
                    function preventScrolling(selector) {
                        selector.off('mousewheel DOMMouseScroll').on('mousewheel DOMMouseScroll', function (e) {
                            var scrollTo = null;
                            if (e.type == 'mousewheel') {
                                scrollTo = (e.originalEvent.wheelDelta * -1);
                            }
                            else if (e.type == 'DOMMouseScroll') {
                                scrollTo = 40 * e.originalEvent.detail;
                            }
                            if (scrollTo) {
                                e.stopPropagation();
                                e.preventDefault();
                                $(this).scrollTop(scrollTo + $(this).scrollTop());
                            }
                        });
                    }

                    var option = $('option', el);
                    var list = '';

                    // формируем список селекта
                    function makeList() {
                        for (var i = 0; i < option.length; i++) {
                            var op = option.eq(i);
                            var li = '',
                                liClass = '',
                                liClasses = '',
                                id = '',
                                title = '',
                                dataList = '',
                                optionClass = '',
                                optgroupClass = '',
                                dataJqfsClass = '';
                            var disabled = 'disabled';
                            var selDis = 'selected sel disabled';
                            if (op.prop('selected')) liClass = 'selected sel';
                            if (op.is(':disabled')) liClass = disabled;
                            if (op.is(':selected:disabled')) liClass = selDis;
                            if (op.attr('id') !== undefined && op.attr('id') !== '') id = ' id="' + op.attr('id') + opt.idSuffix + '"';
                            if (op.attr('title') !== undefined && option.attr('title') !== '') title = ' title="' + op.attr('title') + '"';
                            if (op.attr('class') !== undefined) {
                                optionClass = ' ' + op.attr('class');
                                dataJqfsClass = ' data-jqfs-class="' + op.attr('class') + '"';
                            }

                            var data = op.data();
                            for (var k in data) {
                                if (data[k] !== '') dataList += ' data-' + k + '="' + data[k] + '"';
                            }

                            if ((liClass + optionClass) !== '') liClasses = ' class="' + liClass + optionClass + '"';
                            li = '<li' + dataJqfsClass + dataList + liClasses + title + id + '>' + op.html() + '</li>';

                            // если есть optgroup
                            if (op.parent().is('optgroup')) {
                                if (op.parent().attr('class') !== undefined) optgroupClass = ' ' + op.parent().attr('class');
                                li = '<li' + dataJqfsClass + dataList + ' class="' + liClass + optionClass + ' option' + optgroupClass + '"' + title + id + '>' + op.html() + '</li>';
                                if (op.is(':first-child')) {
                                    li = '<li class="optgroup' + optgroupClass + '">' + op.parent().attr('label') + '</li>' + li;
                                }
                            }

                            list += li;
                        }
                    } // end makeList()

                    // одиночный селект
                    function doSelect() {
                        var att = new Attributes();

                        var searchHTML = '';
                        var selectPlaceholder = el.data('placeholder');
                        var selectSearch = el.data('search');
                        var selectSearchLimit = el.data('search-limit');
                        var selectSearchNotFound = el.data('search-not-found');
                        var selectSearchPlaceholder = el.data('search-placeholder');
                        var singleSelectzIndex = el.data('z-index');
                        var selectSmartPositioning = el.data('smart-positioning');

                        if (selectPlaceholder === undefined) selectPlaceholder = opt.selectPlaceholder;
                        if (selectSearch === undefined || selectSearch === '') selectSearch = opt.selectSearch;
                        if (selectSearchLimit === undefined || selectSearchLimit === '') selectSearchLimit = opt.selectSearchLimit;
                        if (selectSearchNotFound === undefined || selectSearchNotFound === '') selectSearchNotFound = opt.selectSearchNotFound;
                        if (selectSearchPlaceholder === undefined) selectSearchPlaceholder = opt.selectSearchPlaceholder;
                        if (singleSelectzIndex === undefined || singleSelectzIndex === '') singleSelectzIndex = opt.singleSelectzIndex;
                        if (selectSmartPositioning === undefined || selectSmartPositioning === '') selectSmartPositioning = opt.selectSmartPositioning;

                        var selectbox =
                            $('<div' + att.id + ' class="jq-selectbox jqselect' + att.classes + '" style="display: inline-block; position: relative; z-index:' + singleSelectzIndex + '">' +
                                '<div class="jq-selectbox__select"' + att.title + ' style="position: relative">' +
                                '<div class="jq-selectbox__select-text"></div>' +
                                '<div class="jq-selectbox__trigger"><div class="jq-selectbox__trigger-arrow"></div></div>' +
                                '</div>' +
                                '</div>');

                        el.css({margin: 0, padding: 0}).after(selectbox).prependTo(selectbox);

                        var divSelect = $('div.jq-selectbox__select', selectbox);
                        var divText = $('div.jq-selectbox__select-text', selectbox);
                        var optionSelected = option.filter(':selected');

                        makeList();

                        if (selectSearch) searchHTML =
                            '<div class="jq-selectbox__search"><input type="search" autocomplete="off" placeholder="' + selectSearchPlaceholder + '"></div>' +
                            '<div class="jq-selectbox__not-found">' + selectSearchNotFound + '</div>';
                        var dropdown =
                            $('<div class="jq-selectbox__dropdown" style="position: absolute">' +
                                searchHTML +
                                '<ul style="position: relative; list-style: none; overflow: auto; overflow-x: hidden">' + list + '</ul>' +
                                '</div>');
                        selectbox.append(dropdown);
                        var ul = $('ul', dropdown);
                        var li = $('li', dropdown);
                        var search = $('input', dropdown);
                        var notFound = $('div.jq-selectbox__not-found', dropdown).hide();
                        if (li.length < selectSearchLimit) search.parent().hide();

                        // показываем опцию по умолчанию
                        // если 1-я опция пустая и выбрана по умолчанию, то показываем плейсхолдер
                        if (el.val() === '') {
                            divText.text(selectPlaceholder).addClass('placeholder');
                        } else {
                            divText.text(optionSelected.text());
                        }

                        // определяем самый широкий пункт селекта
                        var liWidthInner = 0,
                            liWidth = 0;
                        li.each(function () {
                            var l = $(this);
                            l.css({'display': 'inline-block'});
                            if (l.innerWidth() > liWidthInner) {
                                liWidthInner = l.innerWidth();
                                liWidth = l.width();
                            }
                            l.css({'display': ''});
                        });

                        // подстраиваем ширину свернутого селекта в зависимости
                        // от ширины плейсхолдера или самого широкого пункта
                        if (divText.is('.placeholder') && (divText.width() > liWidthInner)) {
                            divText.width(divText.width());
                        } else {
                            var selClone = selectbox.clone().appendTo('body').width('auto');
                            var selCloneWidth = selClone.outerWidth();
                            selClone.remove();
                            if (selCloneWidth == selectbox.outerWidth()) {
                                divText.width(liWidth);
                            }
                        }

                        // подстраиваем ширину выпадающего списка в зависимости от самого широкого пункта
                        if (liWidthInner > selectbox.width()) dropdown.width(liWidthInner);

                        // прячем 1-ю пустую опцию, если она есть и если атрибут data-placeholder не пустой
                        // если все же нужно, чтобы первая пустая опция отображалась, то указываем у селекта: data-placeholder=""
                        if (option.first().text() === '' && el.data('placeholder') !== '') {
                            li.first().hide();
                        }

                        // прячем оригинальный селект
                        el.css({
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: '100%',
                            height: '100%',
                            opacity: 0
                        });

                        var selectHeight = selectbox.outerHeight();
                        var searchHeight = search.outerHeight();
                        var isMaxHeight = ul.css('max-height');
                        var liSelected = li.filter('.selected');
                        if (liSelected.length < 1) li.first().addClass('selected sel');
                        if (li.data('li-height') === undefined) li.data('li-height', li.outerHeight());
                        var position = dropdown.css('top');
                        if (dropdown.css('left') == 'auto') dropdown.css({left: 0});
                        if (dropdown.css('top') == 'auto') dropdown.css({top: selectHeight});
                        dropdown.hide();

                        // если выбран не дефолтный пункт
                        if (liSelected.length) {
                            // добавляем класс, показывающий изменение селекта
                            if (option.first().text() != optionSelected.text()) {
                                selectbox.addClass('changed');
                            }
                            // передаем селекту класс выбранного пункта
                            selectbox.data('jqfs-class', liSelected.data('jqfs-class'));
                            selectbox.addClass(liSelected.data('jqfs-class'));
                        }

                        // если селект неактивный
                        if (el.is(':disabled')) {
                            selectbox.addClass('disabled');
                            return false;
                        }

                        // при клике на псевдоселекте
                        divSelect.click(function () {

                            // колбек при закрытии селекта
                            if ($('div.jq-selectbox').filter('.opened').length) {
                                opt.onSelectClosed.call($('div.jq-selectbox').filter('.opened'));
                            }

                            el.focus();

                            // если iOS, то не показываем выпадающий список,
                            // т.к. отображается нативный и неизвестно, как его спрятать
                            if (iOS) return;

                            // умное позиционирование
                            var win = $(window);
                            var liHeight = li.data('li-height');
                            var topOffset = selectbox.offset().top;
                            var bottomOffset = win.height() - selectHeight - (topOffset - win.scrollTop());
                            var visible = el.data('visible-options');
                            if (visible === undefined || visible === '') visible = opt.selectVisibleOptions;
                            var minHeight = liHeight * 5;
                            var newHeight = liHeight * visible;
                            if (visible > 0 && visible < 6) minHeight = newHeight;
                            if (visible === 0) newHeight = 'auto';

                            var dropDown = function () {
                                dropdown.height('auto').css({bottom: 'auto', top: position});
                                var maxHeightBottom = function () {
                                    ul.css('max-height', Math.floor((bottomOffset - 20 - searchHeight) / liHeight) * liHeight);
                                };
                                maxHeightBottom();
                                ul.css('max-height', newHeight);
                                if (isMaxHeight != 'none') {
                                    ul.css('max-height', isMaxHeight);
                                }
                                if (bottomOffset < (dropdown.outerHeight() + 20)) {
                                    maxHeightBottom();
                                }
                            };

                            var dropUp = function () {
                                dropdown.height('auto').css({top: 'auto', bottom: position});
                                var maxHeightTop = function () {
                                    ul.css('max-height', Math.floor((topOffset - win.scrollTop() - 20 - searchHeight) / liHeight) * liHeight);
                                };
                                maxHeightTop();
                                ul.css('max-height', newHeight);
                                if (isMaxHeight != 'none') {
                                    ul.css('max-height', isMaxHeight);
                                }
                                if ((topOffset - win.scrollTop() - 20) < (dropdown.outerHeight() + 20)) {
                                    maxHeightTop();
                                }
                            };

                            if (selectSmartPositioning === true || selectSmartPositioning === 1) {
                                // раскрытие вниз
                                if (bottomOffset > (minHeight + searchHeight + 20)) {
                                    dropDown();
                                    selectbox.removeClass('dropup').addClass('dropdown');
                                    // раскрытие вверх
                                } else {
                                    dropUp();
                                    selectbox.removeClass('dropdown').addClass('dropup');
                                }
                            } else if (selectSmartPositioning === false || selectSmartPositioning === 0) {
                                // раскрытие вниз
                                if (bottomOffset > (minHeight + searchHeight + 20)) {
                                    dropDown();
                                    selectbox.removeClass('dropup').addClass('dropdown');
                                }
                            }

                            // если выпадающий список выходит за правый край окна браузера,
                            // то меняем позиционирование с левого на правое
                            if (selectbox.offset().left + dropdown.outerWidth() > win.width()) {
                                dropdown.css({left: 'auto', right: 0});
                            }
                            // конец умного позиционирования

                            $('div.jqselect').css({zIndex: (singleSelectzIndex - 1)}).removeClass('opened');
                            selectbox.css({zIndex: singleSelectzIndex});
                            if (dropdown.is(':hidden')) {
                                $('div.jq-selectbox__dropdown:visible').hide();
                                dropdown.show();
                                selectbox.addClass('opened focused');
                                // колбек при открытии селекта
                                opt.onSelectOpened.call(selectbox);
                            } else {
                                dropdown.hide();
                                selectbox.removeClass('opened dropup dropdown');
                                // колбек при закрытии селекта
                                if ($('div.jq-selectbox').filter('.opened').length) {
                                    opt.onSelectClosed.call(selectbox);
                                }
                            }

                            // поисковое поле
                            if (search.length) {
                                search.val('').keyup();
                                notFound.hide();
                                search.keyup(function () {
                                    var query = $(this).val();
                                    li.each(function () {
                                        if (!$(this).html().match(new RegExp('.*?' + query + '.*?', 'i'))) {
                                            $(this).hide();
                                        } else {
                                            $(this).show();
                                        }
                                    });
                                    // прячем 1-ю пустую опцию
                                    if (option.first().text() === '' && el.data('placeholder') !== '') {
                                        li.first().hide();
                                    }
                                    if (li.filter(':visible').length < 1) {
                                        notFound.show();
                                    } else {
                                        notFound.hide();
                                    }
                                });
                            }

                            // прокручиваем до выбранного пункта при открытии списка
                            if (li.filter('.selected').length) {
                                if (el.val() === '') {
                                    ul.scrollTop(0);
                                } else {
                                    // если нечетное количество видимых пунктов,
                                    // то высоту пункта делим пополам для последующего расчета
                                    if ((ul.innerHeight() / liHeight) % 2 !== 0) liHeight = liHeight / 2;
                                    ul.scrollTop(ul.scrollTop() + li.filter('.selected').position().top - ul.innerHeight() / 2 + liHeight);
                                }
                            }

                            preventScrolling(ul);

                        }); // end divSelect.click()

                        // при наведении курсора на пункт списка
                        li.hover(function () {
                            $(this).siblings().removeClass('selected');
                        });
                        var selectedText = li.filter('.selected').text();

                        // при клике на пункт списка
                        li.filter(':not(.disabled):not(.optgroup)').click(function () {
                            el.focus();
                            var t = $(this);
                            var liText = t.text();
                            if (!t.is('.selected')) {
                                var index = t.index();
                                index -= t.prevAll('.optgroup').length;
                                t.addClass('selected sel').siblings().removeClass('selected sel');
                                option.prop('selected', false).eq(index).prop('selected', true);
                                selectedText = liText;
                                divText.text(liText);

                                // передаем селекту класс выбранного пункта
                                if (selectbox.data('jqfs-class')) selectbox.removeClass(selectbox.data('jqfs-class'));
                                selectbox.data('jqfs-class', t.data('jqfs-class'));
                                selectbox.addClass(t.data('jqfs-class'));

                                el.change();
                            }
                            dropdown.hide();
                            selectbox.removeClass('opened dropup dropdown');
                            // колбек при закрытии селекта
                            opt.onSelectClosed.call(selectbox);

                        });
                        dropdown.mouseout(function () {
                            $('li.sel', dropdown).addClass('selected');
                        });

                        // изменение селекта
                        el.on('change.styler', function () {
                            divText.text(option.filter(':selected').text()).removeClass('placeholder');
                            li.removeClass('selected sel').not('.optgroup').eq(el[0].selectedIndex).addClass('selected sel');
                            // добавляем класс, показывающий изменение селекта
                            if (option.first().text() != li.filter('.selected').text()) {
                                selectbox.addClass('changed');
                            } else {
                                selectbox.removeClass('changed');
                            }
                        })
                            .on('focus.styler', function () {
                                selectbox.addClass('focused');
                                $('div.jqselect').not('.focused').removeClass('opened dropup dropdown').find('div.jq-selectbox__dropdown').hide();
                            })
                            .on('blur.styler', function () {
                                selectbox.removeClass('focused');
                            })
                            // изменение селекта с клавиатуры
                            .on('keydown.styler keyup.styler', function (e) {
                                var liHeight = li.data('li-height');
                                if (el.val() === '') {
                                    divText.text(selectPlaceholder).addClass('placeholder');
                                } else {
                                    divText.text(option.filter(':selected').text());
                                }
                                li.removeClass('selected sel').not('.optgroup').eq(el[0].selectedIndex).addClass('selected sel');
                                // вверх, влево, Page Up, Home
                                if (e.which == 38 || e.which == 37 || e.which == 33 || e.which == 36) {
                                    if (el.val() === '') {
                                        ul.scrollTop(0);
                                    } else {
                                        ul.scrollTop(ul.scrollTop() + li.filter('.selected').position().top);
                                    }
                                }
                                // вниз, вправо, Page Down, End
                                if (e.which == 40 || e.which == 39 || e.which == 34 || e.which == 35) {
                                    ul.scrollTop(ul.scrollTop() + li.filter('.selected').position().top - ul.innerHeight() + liHeight);
                                }
                                // закрываем выпадающий список при нажатии Enter
                                if (e.which == 13) {
                                    e.preventDefault();
                                    dropdown.hide();
                                    selectbox.removeClass('opened dropup dropdown');
                                    // колбек при закрытии селекта
                                    opt.onSelectClosed.call(selectbox);
                                }
                            }).on('keydown.styler', function (e) {
                            // открываем выпадающий список при нажатии Space
                            if (e.which == 32) {
                                e.preventDefault();
                                divSelect.click();
                            }
                        });

                        // прячем выпадающий список при клике за пределами селекта
                        if (!onDocumentClick.registered) {
                            $(document).on('click', onDocumentClick);
                            onDocumentClick.registered = true;
                        }

                    } // end doSelect()

                    // мультиселект
                    function doMultipleSelect() {
                        var att = new Attributes();
                        var selectbox = $('<div' + att.id + ' class="jq-select-multiple jqselect' + att.classes + '"' + att.title + ' style="display: inline-block; position: relative"></div>');

                        el.css({margin: 0, padding: 0}).after(selectbox);

                        makeList();
                        selectbox.append('<ul>' + list + '</ul>');
                        var ul = $('ul', selectbox).css({
                            'position': 'relative',
                            'overflow-x': 'hidden',
                            '-webkit-overflow-scrolling': 'touch'
                        });
                        var li = $('li', selectbox).attr('unselectable', 'on');
                        var size = el.attr('size');
                        var ulHeight = ul.outerHeight();
                        var liHeight = li.outerHeight();
                        if (size !== undefined && size > 0) {
                            ul.css({'height': liHeight * size});
                        } else {
                            ul.css({'height': liHeight * 4});
                        }
                        if (ulHeight > selectbox.height()) {
                            ul.css('overflowY', 'scroll');
                            preventScrolling(ul);
                            // прокручиваем до выбранного пункта
                            if (li.filter('.selected').length) {
                                ul.scrollTop(ul.scrollTop() + li.filter('.selected').position().top);
                            }
                        }

                        // прячем оригинальный селект
                        el.prependTo(selectbox).css({
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: '100%',
                            height: '100%',
                            opacity: 0
                        });

                        // если селект неактивный
                        if (el.is(':disabled')) {
                            selectbox.addClass('disabled');
                            option.each(function () {
                                if ($(this).is(':selected')) li.eq($(this).index()).addClass('selected');
                            });

                            // если селект активный
                        } else {

                            // при клике на пункт списка
                            li.filter(':not(.disabled):not(.optgroup)').click(function (e) {
                                el.focus();
                                var clkd = $(this);
                                if (!e.ctrlKey && !e.metaKey) clkd.addClass('selected');
                                if (!e.shiftKey) clkd.addClass('first');
                                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) clkd.siblings().removeClass('selected first');

                                // выделение пунктов при зажатом Ctrl
                                if (e.ctrlKey || e.metaKey) {
                                    if (clkd.is('.selected')) clkd.removeClass('selected first');
                                    else clkd.addClass('selected first');
                                    clkd.siblings().removeClass('first');
                                }

                                // выделение пунктов при зажатом Shift
                                if (e.shiftKey) {
                                    var prev = false,
                                        next = false;
                                    clkd.siblings().removeClass('selected').siblings('.first').addClass('selected');
                                    clkd.prevAll().each(function () {
                                        if ($(this).is('.first')) prev = true;
                                    });
                                    clkd.nextAll().each(function () {
                                        if ($(this).is('.first')) next = true;
                                    });
                                    if (prev) {
                                        clkd.prevAll().each(function () {
                                            if ($(this).is('.selected')) return false;
                                            else $(this).not('.disabled, .optgroup').addClass('selected');
                                        });
                                    }
                                    if (next) {
                                        clkd.nextAll().each(function () {
                                            if ($(this).is('.selected')) return false;
                                            else $(this).not('.disabled, .optgroup').addClass('selected');
                                        });
                                    }
                                    if (li.filter('.selected').length == 1) clkd.addClass('first');
                                }

                                // отмечаем выбранные мышью
                                option.prop('selected', false);
                                li.filter('.selected').each(function () {
                                    var t = $(this);
                                    var index = t.index();
                                    if (t.is('.option')) index -= t.prevAll('.optgroup').length;
                                    option.eq(index).prop('selected', true);
                                });
                                el.change();

                            });

                            // отмечаем выбранные с клавиатуры
                            option.each(function (i) {
                                $(this).data('optionIndex', i);
                            });
                            el.on('change.styler', function () {
                                li.removeClass('selected');
                                var arrIndexes = [];
                                option.filter(':selected').each(function () {
                                    arrIndexes.push($(this).data('optionIndex'));
                                });
                                li.not('.optgroup').filter(function (i) {
                                    return $.inArray(i, arrIndexes) > -1;
                                }).addClass('selected');
                            })
                                .on('focus.styler', function () {
                                    selectbox.addClass('focused');
                                })
                                .on('blur.styler', function () {
                                    selectbox.removeClass('focused');
                                });

                            // прокручиваем с клавиатуры
                            if (ulHeight > selectbox.height()) {
                                el.on('keydown.styler', function (e) {
                                    // вверх, влево, PageUp
                                    if (e.which == 38 || e.which == 37 || e.which == 33) {
                                        ul.scrollTop(ul.scrollTop() + li.filter('.selected').position().top - liHeight);
                                    }
                                    // вниз, вправо, PageDown
                                    if (e.which == 40 || e.which == 39 || e.which == 34) {
                                        ul.scrollTop(ul.scrollTop() + li.filter('.selected:last').position().top - ul.innerHeight() + liHeight * 2);
                                    }
                                });
                            }

                        }
                    } // end doMultipleSelect()

                    if (el.is('[multiple]')) {

                        // если Android или iOS, то мультиселект не стилизуем
                        // причина для Android - в стилизованном селекте нет возможности выбрать несколько пунктов
                        // причина для iOS - в стилизованном селекте неправильно отображаются выбранные пункты
                        if (Android || iOS) return;

                        doMultipleSelect();
                    } else {
                        doSelect();
                    }

                }; // end selectboxOutput()

                selectboxOutput();

                // обновление при динамическом изменении
                el.on('refresh', function () {
                    el.off('.styler').parent().before(el).remove();
                    selectboxOutput();
                });

                // end select

                // reset
            } else if (el.is(':reset')) {
                el.on('click', function () {
                    setTimeout(function () {
                        el.closest(opt.wrapper).find('input, select').trigger('refresh');
                    }, 1);
                });
            } // end reset

        }, // init: function()

        // деструктор
        destroy: function () {

            var el = $(this.element);

            if (el.is(':checkbox') || el.is(':radio')) {
                el.removeData('_' + pluginName).off('.styler refresh').removeAttr('style').parent().before(el).remove();
                el.closest('label').add('label[for="' + el.attr('id') + '"]').off('.styler');
            } else if (el.is('input[type="number"]')) {
                el.removeData('_' + pluginName).off('.styler refresh').closest('.jq-number').before(el).remove();
            } else if (el.is(':file') || el.is('select')) {
                el.removeData('_' + pluginName).off('.styler refresh').removeAttr('style').parent().before(el).remove();
            }

        } // destroy: function()

    }; // Plugin.prototype

    $.fn[pluginName] = function (options) {
        var args = arguments;
        if (options === undefined || typeof options === 'object') {
            this.each(function () {
                if (!$.data(this, '_' + pluginName)) {
                    $.data(this, '_' + pluginName, new Plugin(this, options));
                }
            })
            // колбек после выполнения плагина
                .promise()
                .done(function () {
                    var opt = $(this[0]).data('_' + pluginName);
                    if (opt) opt.options.onFormStyled.call();
                });
            return this;
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            var returns;
            this.each(function () {
                var instance = $.data(this, '_' + pluginName);
                if (instance instanceof Plugin && typeof instance[options] === 'function') {
                    returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                }
            });
            return returns !== undefined ? returns : this;
        }
    };

    // прячем выпадающий список при клике за пределами селекта
    function onDocumentClick(e) {
        // e.target.nodeName != 'OPTION' - добавлено для обхода бага в Opera на движке Presto
        // (при изменении селекта с клавиатуры срабатывает событие onclick)
        if (!$(e.target).parents().hasClass('jq-selectbox') && e.target.nodeName != 'OPTION') {
            if ($('div.jq-selectbox.opened').length) {
                var selectbox = $('div.jq-selectbox.opened'),
                    search = $('div.jq-selectbox__search input', selectbox),
                    dropdown = $('div.jq-selectbox__dropdown', selectbox),
                    opt = selectbox.find('select').data('_' + pluginName).options;

                // колбек при закрытии селекта
                opt.onSelectClosed.call(selectbox);

                if (search.length) search.val('').keyup();
                dropdown.hide().find('li.sel').addClass('selected');
                selectbox.removeClass('focused opened dropup dropdown');
            }
        }
    }

    onDocumentClick.registered = false;

}));

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

(function ($, undefined) {
    'use strict';
    var defaults = {
        item: 3,
        autoWidth: false,
        slideMove: 1,
        slideMargin: 10,
        addClass: '',
        mode: 'slide',
        useCSS: true,
        cssEasing: 'ease', //'cubic-bezier(0.25, 0, 0.25, 1)',
        easing: 'linear', //'for jquery animation',//
        speed: 400, //ms'
        auto: false,
        pauseOnHover: false,
        loop: false,
        slideEndAnimation: true,
        pause: 2000,
        keyPress: false,
        controls: true,
        prevHtml: '',
        nextHtml: '',
        rtl: false,
        adaptiveHeight: false,
        vertical: false,
        verticalHeight: 500,
        vThumbWidth: 100,
        thumbItem: 10,
        pager: true,
        gallery: false,
        galleryMargin: 5,
        thumbMargin: 5,
        currentPagerPosition: 'middle',
        enableTouch: true,
        enableDrag: true,
        freeMove: true,
        swipeThreshold: 40,
        responsive: [],
        /* jshint ignore:start */
        onBeforeStart: function ($el) {
        },
        onSliderLoad: function ($el) {
        },
        onBeforeSlide: function ($el, scene) {
        },
        onAfterSlide: function ($el, scene) {
        },
        onBeforeNextSlide: function ($el, scene) {
        },
        onBeforePrevSlide: function ($el, scene) {
        }
        /* jshint ignore:end */
    };
    $.fn.lightSlider = function (options) {
        if (this.length === 0) {
            return this;
        }

        if (this.length > 1) {
            this.each(function () {
                $(this).lightSlider(options);
            });
            return this;
        }

        var plugin = {},
            settings = $.extend(true, {}, defaults, options),
            settingsTemp = {},
            $el = this;
        plugin.$el = this;

        if (settings.mode === 'fade') {
            settings.vertical = false;
        }
        var $children = $el.children(),
            windowW = $(window).width(),
            breakpoint = null,
            resposiveObj = null,
            length = 0,
            w = 0,
            on = false,
            elSize = 0,
            $slide = '',
            scene = 0,
            property = (settings.vertical === true) ? 'height' : 'width',
            gutter = (settings.vertical === true) ? 'margin-bottom' : 'margin-right',
            slideValue = 0,
            pagerWidth = 0,
            slideWidth = 0,
            thumbWidth = 0,
            interval = null,
            isTouch = ('ontouchstart' in document.documentElement);
        var refresh = {};

        refresh.chbreakpoint = function () {
            windowW = $(window).width();
            if (settings.responsive.length) {
                var item;
                if (settings.autoWidth === false) {
                    item = settings.item;
                }
                if (windowW < settings.responsive[0].breakpoint) {
                    for (var i = 0; i < settings.responsive.length; i++) {
                        if (windowW < settings.responsive[i].breakpoint) {
                            breakpoint = settings.responsive[i].breakpoint;
                            resposiveObj = settings.responsive[i];
                        }
                    }
                }
                if (typeof resposiveObj !== 'undefined' && resposiveObj !== null) {
                    for (var j in resposiveObj.settings) {
                        if (resposiveObj.settings.hasOwnProperty(j)) {
                            if (typeof settingsTemp[j] === 'undefined' || settingsTemp[j] === null) {
                                settingsTemp[j] = settings[j];
                            }
                            settings[j] = resposiveObj.settings[j];
                        }
                    }
                }
                if (!$.isEmptyObject(settingsTemp) && windowW > settings.responsive[0].breakpoint) {
                    for (var k in settingsTemp) {
                        if (settingsTemp.hasOwnProperty(k)) {
                            settings[k] = settingsTemp[k];
                        }
                    }
                }
                if (settings.autoWidth === false) {
                    if (slideValue > 0 && slideWidth > 0) {
                        if (item !== settings.item) {
                            scene = Math.round(slideValue / ((slideWidth + settings.slideMargin) * settings.slideMove));
                        }
                    }
                }
            }
        };

        refresh.calSW = function () {
            if (settings.autoWidth === false) {
                slideWidth = (elSize - ((settings.item * (settings.slideMargin)) - settings.slideMargin)) / settings.item;
            }
        };

        refresh.calWidth = function (cln) {
            var ln = cln === true ? $slide.find('.lslide').length : $children.length;
            if (settings.autoWidth === false) {
                w = ln * (slideWidth + settings.slideMargin);
            } else {
                w = 0;
                for (var i = 0; i < ln; i++) {
                    w += (parseInt($children.eq(i).width()) + settings.slideMargin);
                }
            }
            return w;
        };
        plugin = {
            doCss: function () {
                var support = function () {
                    var transition = ['transition', 'MozTransition', 'WebkitTransition', 'OTransition', 'msTransition', 'KhtmlTransition'];
                    var root = document.documentElement;
                    for (var i = 0; i < transition.length; i++) {
                        if (transition[i] in root.style) {
                            return true;
                        }
                    }
                };
                if (settings.useCSS && support()) {
                    return true;
                }
                return false;
            },
            keyPress: function () {
                if (settings.keyPress) {
                    $(document).on('keyup.lightslider', function (e) {
                        if (!$(':focus').is('input, textarea')) {
                            if (e.preventDefault) {
                                e.preventDefault();
                            } else {
                                e.returnValue = false;
                            }
                            if (e.keyCode === 37) {
                                $el.goToPrevSlide();
                            } else if (e.keyCode === 39) {
                                $el.goToNextSlide();
                            }
                        }
                    });
                }
            },
            controls: function () {
                if (settings.controls) {
                    $el.after('<div class="lSAction"><a class="lSPrev">' + settings.prevHtml + '</a><a class="lSNext">' + settings.nextHtml + '</a></div>');
                    if (!settings.autoWidth) {
                        if (length <= settings.item) {
                            $slide.find('.lSAction').hide();
                        }
                    } else {
                        if (refresh.calWidth(false) < elSize) {
                            $slide.find('.lSAction').hide();
                        }
                    }
                    $slide.find('.lSAction a').on('click', function (e) {
                        if (e.preventDefault) {
                            e.preventDefault();
                        } else {
                            e.returnValue = false;
                        }
                        if ($(this).attr('class') === 'lSPrev') {
                            $el.goToPrevSlide();
                        } else {
                            $el.goToNextSlide();
                        }
                        return false;
                    });
                }
            },
            initialStyle: function () {
                var $this = this;
                if (settings.mode === 'fade') {
                    settings.autoWidth = false;
                    settings.slideEndAnimation = false;
                }
                if (settings.auto) {
                    settings.slideEndAnimation = false;
                }
                if (settings.autoWidth) {
                    settings.slideMove = 1;
                    settings.item = 1;
                }
                if (settings.loop) {
                    settings.slideMove = 1;
                    settings.freeMove = false;
                }
                settings.onBeforeStart.call(this, $el);
                refresh.chbreakpoint();
                $el.addClass('lightSlider').wrap('<div class="lSSlideOuter ' + settings.addClass + '"><div class="lSSlideWrapper"></div></div>');
                $slide = $el.parent('.lSSlideWrapper');
                if (settings.rtl === true) {
                    $slide.parent().addClass('lSrtl');
                }
                if (settings.vertical) {
                    $slide.parent().addClass('vertical');
                    elSize = settings.verticalHeight;
                    $slide.css('height', elSize + 'px');
                } else {
                    elSize = $el.outerWidth();
                }
                $children.addClass('lslide');
                if (settings.loop === true && settings.mode === 'slide') {
                    refresh.calSW();
                    refresh.clone = function () {
                        if (refresh.calWidth(true) > elSize) {
                            /**/
                            var tWr = 0,
                                tI = 0;
                            for (var k = 0; k < $children.length; k++) {
                                tWr += (parseInt($el.find('.lslide').eq(k).width()) + settings.slideMargin);
                                tI++;
                                if (tWr >= (elSize + settings.slideMargin)) {
                                    break;
                                }
                            }
                            var tItem = settings.autoWidth === true ? tI : settings.item;

                            /**/
                            if (tItem < $el.find('.clone.left').length) {
                                for (var i = 0; i < $el.find('.clone.left').length - tItem; i++) {
                                    $children.eq(i).remove();
                                }
                            }
                            if (tItem < $el.find('.clone.right').length) {
                                for (var j = $children.length - 1; j > ($children.length - 1 - $el.find('.clone.right').length); j--) {
                                    scene--;
                                    $children.eq(j).remove();
                                }
                            }
                            /**/
                            for (var n = $el.find('.clone.right').length; n < tItem; n++) {
                                $el.find('.lslide').eq(n).clone().removeClass('lslide').addClass('clone right').appendTo($el);
                                scene++;
                            }
                            for (var m = $el.find('.lslide').length - $el.find('.clone.left').length; m > ($el.find('.lslide').length - tItem); m--) {
                                $el.find('.lslide').eq(m - 1).clone().removeClass('lslide').addClass('clone left').prependTo($el);
                            }
                            $children = $el.children();
                        } else {
                            if ($children.hasClass('clone')) {
                                $el.find('.clone').remove();
                                $this.move($el, 0);
                            }
                        }
                    };
                    refresh.clone();
                }
                refresh.sSW = function () {
                    length = $children.length;
                    if (settings.rtl === true && settings.vertical === false) {
                        gutter = 'margin-left';
                    }
                    if (settings.autoWidth === false) {
                        $children.css(property, slideWidth + 'px');
                    }
                    $children.css(gutter, settings.slideMargin + 'px');
                    w = refresh.calWidth(false);
                    $el.css(property, w + 'px');
                    if (settings.loop === true && settings.mode === 'slide') {
                        if (on === false) {
                            scene = $el.find('.clone.left').length;
                        }
                    }
                };
                refresh.calL = function () {
                    $children = $el.children();
                    length = $children.length;
                };
                if (this.doCss()) {
                    $slide.addClass('usingCss');
                }
                refresh.calL();
                if (settings.mode === 'slide') {
                    refresh.calSW();
                    refresh.sSW();
                    if (settings.loop === true) {
                        slideValue = $this.slideValue();
                        this.move($el, slideValue);
                    }
                    if (settings.vertical === false) {
                        this.setHeight($el, false);
                    }

                } else {
                    this.setHeight($el, true);
                    $el.addClass('lSFade');
                    if (!this.doCss()) {
                        $children.fadeOut(0);
                        $children.eq(scene).fadeIn(0);
                    }
                }
                if (settings.loop === true && settings.mode === 'slide') {
                    $children.eq(scene).addClass('active');
                } else {
                    $children.first().addClass('active');
                }
            },
            pager: function () {
                var $this = this;
                refresh.createPager = function () {
                    thumbWidth = (elSize - ((settings.thumbItem * (settings.thumbMargin)) - settings.thumbMargin)) / settings.thumbItem;
                    var $children = $slide.find('.lslide');
                    var length = $slide.find('.lslide').length;
                    var i = 0,
                        pagers = '',
                        v = 0;
                    for (i = 0; i < length; i++) {
                        if (settings.mode === 'slide') {
                            // calculate scene * slide value
                            if (!settings.autoWidth) {
                                v = i * ((slideWidth + settings.slideMargin) * settings.slideMove);
                            } else {
                                v += ((parseInt($children.eq(i).width()) + settings.slideMargin) * settings.slideMove);
                            }
                        }
                        var thumb = $children.eq(i * settings.slideMove).attr('data-thumb');
                        if (settings.gallery === true) {
                            pagers += '<li style="width:100%;' + property + ':' + thumbWidth + 'px;' + gutter + ':' + settings.thumbMargin + 'px"><a href="#"><img src="' + thumb + '" /></a></li>';
                        } else {
                            pagers += '<li><a href="#">' + (i + 1) + '</a></li>';
                        }
                        if (settings.mode === 'slide') {
                            if ((v) >= w - elSize - settings.slideMargin) {
                                i = i + 1;
                                var minPgr = 2;
                                if (settings.autoWidth) {
                                    pagers += '<li><a href="#">' + (i + 1) + '</a></li>';
                                    minPgr = 1;
                                }
                                if (i < minPgr) {
                                    pagers = null;
                                    $slide.parent().addClass('noPager');
                                } else {
                                    $slide.parent().removeClass('noPager');
                                }
                                break;
                            }
                        }
                    }
                    var $cSouter = $slide.parent();
                    $cSouter.find('.lSPager').html(pagers);
                    if (settings.gallery === true) {
                        if (settings.vertical === true) {
                            // set Gallery thumbnail width
                            $cSouter.find('.lSPager').css('width', settings.vThumbWidth + 'px');
                        }
                        pagerWidth = (i * (settings.thumbMargin + thumbWidth)) + 0.5;
                        $cSouter.find('.lSPager').css({
                            property: pagerWidth + 'px',
                            'transition-duration': settings.speed + 'ms'
                        });
                        if (settings.vertical === true) {
                            $slide.parent().css('padding-right', (settings.vThumbWidth + settings.galleryMargin) + 'px');
                        }
                        $cSouter.find('.lSPager').css(property, pagerWidth + 'px');
                    }
                    var $pager = $cSouter.find('.lSPager').find('li');
                    $pager.first().addClass('active');
                    $pager.on('click', function () {
                        if (settings.loop === true && settings.mode === 'slide') {
                            scene = scene + ($pager.index(this) - $cSouter.find('.lSPager').find('li.active').index());
                        } else {
                            scene = $pager.index(this);
                        }
                        $el.mode(false);
                        if (settings.gallery === true) {
                            $this.slideThumb();
                        }
                        return false;
                    });
                };
                if (settings.pager) {
                    var cl = 'lSpg';
                    if (settings.gallery) {
                        cl = 'lSGallery';
                    }
                    $slide.after('<ul class="lSPager ' + cl + '"></ul>');
                    var gMargin = (settings.vertical) ? 'margin-left' : 'margin-top';
                    $slide.parent().find('.lSPager').css(gMargin, settings.galleryMargin + 'px');
                    refresh.createPager();
                }

                setTimeout(function () {
                    refresh.init();
                }, 0);
            },
            setHeight: function (ob, fade) {
                var obj = null,
                    $this = this;
                if (settings.loop) {
                    obj = ob.children('.lslide ').first();
                } else {
                    obj = ob.children().first();
                }
                var setCss = function () {
                    var tH = obj.outerHeight(),
                        tP = 0,
                        tHT = tH;
                    if (fade) {
                        tH = 0;
                        tP = ((tHT) * 100) / elSize;
                    }
                    ob.css({
                        'height': tH + 'px',
                        'padding-bottom': tP + '%'
                    });
                };
                setCss();
                if (obj.find('img').length) {
                    if (obj.find('img')[0].complete) {
                        setCss();
                        if (!interval) {
                            $this.auto();
                        }
                    } else {
                        obj.find('img').load(function () {
                            setTimeout(function () {
                                setCss();
                                if (!interval) {
                                    $this.auto();
                                }
                            }, 100);
                        });
                    }
                } else {
                    if (!interval) {
                        $this.auto();
                    }
                }
            },
            active: function (ob, t) {
                if (this.doCss() && settings.mode === 'fade') {
                    $slide.addClass('on');
                }
                var sc = 0;
                if (scene * settings.slideMove < length) {
                    ob.removeClass('active');
                    if (!this.doCss() && settings.mode === 'fade' && t === false) {
                        ob.fadeOut(settings.speed);
                    }
                    if (t === true) {
                        sc = scene;
                    } else {
                        sc = scene * settings.slideMove;
                    }
                    //t === true ? sc = scene : sc = scene * settings.slideMove;
                    var l, nl;
                    if (t === true) {
                        l = ob.length;
                        nl = l - 1;
                        if (sc + 1 >= l) {
                            sc = nl;
                        }
                    }
                    if (settings.loop === true && settings.mode === 'slide') {
                        //t === true ? sc = scene - $el.find('.clone.left').length : sc = scene * settings.slideMove;
                        if (t === true) {
                            sc = scene - $el.find('.clone.left').length;
                        } else {
                            sc = scene * settings.slideMove;
                        }
                        if (t === true) {
                            l = ob.length;
                            nl = l - 1;
                            if (sc + 1 === l) {
                                sc = nl;
                            } else if (sc + 1 > l) {
                                sc = 0;
                            }
                        }
                    }

                    if (!this.doCss() && settings.mode === 'fade' && t === false) {
                        ob.eq(sc).fadeIn(settings.speed);
                    }
                    ob.eq(sc).addClass('active');
                } else {
                    ob.removeClass('active');
                    ob.eq(ob.length - 1).addClass('active');
                    if (!this.doCss() && settings.mode === 'fade' && t === false) {
                        ob.fadeOut(settings.speed);
                        ob.eq(sc).fadeIn(settings.speed);
                    }
                }
            },
            move: function (ob, v) {
                if (settings.rtl === true) {
                    v = -v;
                }
                if (this.doCss()) {
                    if (settings.vertical === true) {
                        ob.css({
                            'transform': 'translate3d(0px, ' + (-v) + 'px, 0px)',
                            '-webkit-transform': 'translate3d(0px, ' + (-v) + 'px, 0px)'
                        });
                    } else {
                        ob.css({
                            'transform': 'translate3d(' + (-v) + 'px, 0px, 0px)',
                            '-webkit-transform': 'translate3d(' + (-v) + 'px, 0px, 0px)',
                        });
                    }
                } else {
                    if (settings.vertical === true) {
                        ob.css('position', 'relative').animate({
                            top: -v + 'px'
                        }, settings.speed, settings.easing);
                    } else {
                        ob.css('position', 'relative').animate({
                            left: -v + 'px'
                        }, settings.speed, settings.easing);
                    }
                }
                var $thumb = $slide.parent().find('.lSPager').find('li');
                this.active($thumb, true);
            },
            fade: function () {
                this.active($children, false);
                var $thumb = $slide.parent().find('.lSPager').find('li');
                this.active($thumb, true);
            },
            slide: function () {
                var $this = this;
                refresh.calSlide = function () {
                    if (w > elSize) {
                        slideValue = $this.slideValue();
                        $this.active($children, false);
                        if ((slideValue) > w - elSize - settings.slideMargin) {
                            slideValue = w - elSize - settings.slideMargin;
                        } else if (slideValue < 0) {
                            slideValue = 0;
                        }
                        $this.move($el, slideValue);
                        if (settings.loop === true && settings.mode === 'slide') {
                            if (scene >= (length - ($el.find('.clone.left').length / settings.slideMove))) {
                                $this.resetSlide($el.find('.clone.left').length);
                            }
                            if (scene === 0) {
                                $this.resetSlide($slide.find('.lslide').length);
                            }
                        }
                    }
                };
                refresh.calSlide();
            },
            resetSlide: function (s) {
                var $this = this;
                $slide.find('.lSAction a').addClass('disabled');
                setTimeout(function () {
                    scene = s;
                    $slide.css('transition-duration', '0ms');
                    slideValue = $this.slideValue();
                    $this.active($children, false);
                    plugin.move($el, slideValue);
                    setTimeout(function () {
                        $slide.css('transition-duration', settings.speed + 'ms');
                        $slide.find('.lSAction a').removeClass('disabled');
                    }, 50);
                }, settings.speed + 100);
            },
            slideValue: function () {
                var _sV = 0;
                if (settings.autoWidth === false) {
                    _sV = scene * ((slideWidth + settings.slideMargin) * settings.slideMove);
                } else {
                    _sV = 0;
                    for (var i = 0; i < scene; i++) {
                        _sV += (parseInt($children.eq(i).width()) + settings.slideMargin);
                    }
                }
                return _sV;
            },
            slideThumb: function () {
                var position;
                switch (settings.currentPagerPosition) {
                    case 'left':
                        position = 0;
                        break;
                    case 'middle':
                        position = (elSize / 2) - (thumbWidth / 2);
                        break;
                    case 'right':
                        position = elSize - thumbWidth;
                }
                var sc = scene - $el.find('.clone.left').length;
                var $pager = $slide.parent().find('.lSPager');
                if (settings.mode === 'slide' && settings.loop === true) {
                    if (sc >= $pager.children().length) {
                        sc = 0;
                    } else if (sc < 0) {
                        sc = $pager.children().length;
                    }
                }
                var thumbSlide = sc * ((thumbWidth + settings.thumbMargin)) - (position);
                if ((thumbSlide + elSize) > pagerWidth) {
                    thumbSlide = pagerWidth - elSize - settings.thumbMargin;
                }
                if (thumbSlide < 0) {
                    thumbSlide = 0;
                }
                this.move($pager, thumbSlide);
            },
            auto: function () {
                if (settings.auto) {
                    clearInterval(interval);
                    interval = setInterval(function () {
                        $el.goToNextSlide();
                    }, settings.pause);
                }
            },
            pauseOnHover: function () {
                var $this = this;
                if (settings.auto && settings.pauseOnHover) {
                    $slide.on('mouseenter', function () {
                        $(this).addClass('ls-hover');
                        $el.pause();
                        settings.auto = true;
                    });
                    $slide.on('mouseleave', function () {
                        $(this).removeClass('ls-hover');
                        if (!$slide.find('.lightSlider').hasClass('lsGrabbing')) {
                            $this.auto();
                        }
                    });
                }
            },
            touchMove: function (endCoords, startCoords) {
                $slide.css('transition-duration', '0ms');
                if (settings.mode === 'slide') {
                    var distance = endCoords - startCoords;
                    var swipeVal = slideValue - distance;
                    if ((swipeVal) >= w - elSize - settings.slideMargin) {
                        if (settings.freeMove === false) {
                            swipeVal = w - elSize - settings.slideMargin;
                        } else {
                            var swipeValT = w - elSize - settings.slideMargin;
                            swipeVal = swipeValT + ((swipeVal - swipeValT) / 5);

                        }
                    } else if (swipeVal < 0) {
                        if (settings.freeMove === false) {
                            swipeVal = 0;
                        } else {
                            swipeVal = swipeVal / 5;
                        }
                    }
                    this.move($el, swipeVal);
                }
            },

            touchEnd: function (distance) {
                $slide.css('transition-duration', settings.speed + 'ms');
                if (settings.mode === 'slide') {
                    var mxVal = false;
                    var _next = true;
                    slideValue = slideValue - distance;
                    if ((slideValue) > w - elSize - settings.slideMargin) {
                        slideValue = w - elSize - settings.slideMargin;
                        if (settings.autoWidth === false) {
                            mxVal = true;
                        }
                    } else if (slideValue < 0) {
                        slideValue = 0;
                    }
                    var gC = function (next) {
                        var ad = 0;
                        if (!mxVal) {
                            if (next) {
                                ad = 1;
                            }
                        }
                        if (!settings.autoWidth) {
                            var num = slideValue / ((slideWidth + settings.slideMargin) * settings.slideMove);
                            scene = parseInt(num) + ad;
                            if (slideValue >= (w - elSize - settings.slideMargin)) {
                                if (num % 1 !== 0) {
                                    scene++;
                                }
                            }
                        } else {
                            var tW = 0;
                            for (var i = 0; i < $children.length; i++) {
                                tW += (parseInt($children.eq(i).width()) + settings.slideMargin);
                                scene = i + ad;
                                if (tW >= slideValue) {
                                    break;
                                }
                            }
                        }
                    };
                    if (distance >= settings.swipeThreshold) {
                        gC(false);
                        _next = false;
                    } else if (distance <= -settings.swipeThreshold) {
                        gC(true);
                        _next = false;
                    }
                    $el.mode(_next);
                    this.slideThumb();
                } else {
                    if (distance >= settings.swipeThreshold) {
                        $el.goToPrevSlide();
                    } else if (distance <= -settings.swipeThreshold) {
                        $el.goToNextSlide();
                    }
                }
            },


            enableDrag: function () {
                var $this = this;
                if (!isTouch) {
                    var startCoords = 0,
                        endCoords = 0,
                        isDraging = false;
                    $slide.find('.lightSlider').addClass('lsGrab');
                    $slide.on('mousedown', function (e) {
                        if (w < elSize) {
                            if (w !== 0) {
                                return false;
                            }
                        }
                        if ($(e.target).attr('class') !== ('lSPrev') && $(e.target).attr('class') !== ('lSNext')) {
                            startCoords = (settings.vertical === true) ? e.pageY : e.pageX;
                            isDraging = true;
                            if (e.preventDefault) {
                                e.preventDefault();
                            } else {
                                e.returnValue = false;
                            }
                            // ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
                            $slide.scrollLeft += 1;
                            $slide.scrollLeft -= 1;
                            // *
                            $slide.find('.lightSlider').removeClass('lsGrab').addClass('lsGrabbing');
                            clearInterval(interval);
                        }
                    });
                    $(window).on('mousemove', function (e) {
                        if (isDraging) {
                            endCoords = (settings.vertical === true) ? e.pageY : e.pageX;
                            $this.touchMove(endCoords, startCoords);
                        }
                    });
                    $(window).on('mouseup', function (e) {
                        if (isDraging) {
                            $slide.find('.lightSlider').removeClass('lsGrabbing').addClass('lsGrab');
                            isDraging = false;
                            endCoords = (settings.vertical === true) ? e.pageY : e.pageX;
                            var distance = endCoords - startCoords;
                            if (Math.abs(distance) >= settings.swipeThreshold) {
                                $(window).on('click.ls', function (e) {
                                    if (e.preventDefault) {
                                        e.preventDefault();
                                    } else {
                                        e.returnValue = false;
                                    }
                                    e.stopImmediatePropagation();
                                    e.stopPropagation();
                                    $(window).off('click.ls');
                                });
                            }

                            $this.touchEnd(distance);

                        }
                    });
                }
            },


            enableTouch: function () {
                var $this = this;
                if (isTouch) {
                    var startCoords = {},
                        endCoords = {};
                    $slide.on('touchstart', function (e) {
                        endCoords = e.originalEvent.targetTouches[0];
                        startCoords.pageX = e.originalEvent.targetTouches[0].pageX;
                        startCoords.pageY = e.originalEvent.targetTouches[0].pageY;
                        clearInterval(interval);
                    });
                    $slide.on('touchmove', function (e) {
                        if (w < elSize) {
                            if (w !== 0) {
                                return false;
                            }
                        }
                        var orig = e.originalEvent;
                        endCoords = orig.targetTouches[0];
                        var xMovement = Math.abs(endCoords.pageX - startCoords.pageX);
                        var yMovement = Math.abs(endCoords.pageY - startCoords.pageY);
                        if (settings.vertical === true) {
                            if ((yMovement * 3) > xMovement) {
                                e.preventDefault();
                            }
                            $this.touchMove(endCoords.pageY, startCoords.pageY);
                        } else {
                            if ((xMovement * 3) > yMovement) {
                                e.preventDefault();
                            }
                            $this.touchMove(endCoords.pageX, startCoords.pageX);
                        }

                    });
                    $slide.on('touchend', function () {
                        if (w < elSize) {
                            if (w !== 0) {
                                return false;
                            }
                        }
                        var distance;
                        if (settings.vertical === true) {
                            distance = endCoords.pageY - startCoords.pageY;
                        } else {
                            distance = endCoords.pageX - startCoords.pageX;
                        }
                        $this.touchEnd(distance);
                    });
                }
            },
            build: function () {
                var $this = this;
                $this.initialStyle();
                if (this.doCss()) {

                    if (settings.enableTouch === true) {
                        $this.enableTouch();
                    }
                    if (settings.enableDrag === true) {
                        $this.enableDrag();
                    }
                }

                $(window).on('focus', function () {
                    $this.auto();
                });

                $(window).on('blur', function () {
                    clearInterval(interval);
                });

                $this.pager();
                $this.pauseOnHover();
                $this.controls();
                $this.keyPress();
            }
        };
        plugin.build();
        refresh.init = function () {
            refresh.chbreakpoint();
            if (settings.vertical === true) {
                if (settings.item > 1) {
                    elSize = settings.verticalHeight;
                } else {
                    elSize = $children.outerHeight();
                }
                $slide.css('height', elSize + 'px');
            } else {
                elSize = $slide.outerWidth();
            }
            if (settings.loop === true && settings.mode === 'slide') {
                refresh.clone();
            }
            refresh.calL();
            if (settings.mode === 'slide') {
                $el.removeClass('lSSlide');
            }
            if (settings.mode === 'slide') {
                refresh.calSW();
                refresh.sSW();
            }
            setTimeout(function () {
                if (settings.mode === 'slide') {
                    $el.addClass('lSSlide');
                }
            }, 1000);
            if (settings.pager) {
                refresh.createPager();
            }
            if (settings.adaptiveHeight === true && settings.vertical === false) {
                $el.css('height', $children.eq(scene).outerHeight(true));
            }
            if (settings.adaptiveHeight === false) {
                if (settings.mode === 'slide') {
                    if (settings.vertical === false) {
                        plugin.setHeight($el, false);
                    } else {
                        plugin.auto();
                    }
                } else {
                    plugin.setHeight($el, true);
                }
            }
            if (settings.gallery === true) {
                plugin.slideThumb();
            }
            if (settings.mode === 'slide') {
                plugin.slide();
            }
            if (settings.autoWidth === false) {
                if ($children.length <= settings.item) {
                    $slide.find('.lSAction').hide();
                } else {
                    $slide.find('.lSAction').show();
                }
            } else {
                if ((refresh.calWidth(false) < elSize) && (w !== 0)) {
                    $slide.find('.lSAction').hide();
                } else {
                    $slide.find('.lSAction').show();
                }
            }
        };
        $el.goToPrevSlide = function () {
            if (scene > 0) {
                settings.onBeforePrevSlide.call(this, $el, scene);
                scene--;
                $el.mode(false);
                if (settings.gallery === true) {
                    plugin.slideThumb();
                }
            } else {
                if (settings.loop === true) {
                    settings.onBeforePrevSlide.call(this, $el, scene);
                    if (settings.mode === 'fade') {
                        var l = (length - 1);
                        scene = parseInt(l / settings.slideMove);
                    }
                    $el.mode(false);
                    if (settings.gallery === true) {
                        plugin.slideThumb();
                    }
                } else if (settings.slideEndAnimation === true) {
                    $el.addClass('leftEnd');
                    setTimeout(function () {
                        $el.removeClass('leftEnd');
                    }, 400);
                }
            }
        };
        $el.goToNextSlide = function () {
            var nextI = true;
            if (settings.mode === 'slide') {
                var _slideValue = plugin.slideValue();
                nextI = _slideValue < w - elSize - settings.slideMargin;
            }
            if (((scene * settings.slideMove) < length - settings.slideMove) && nextI) {
                settings.onBeforeNextSlide.call(this, $el, scene);
                scene++;
                $el.mode(false);
                if (settings.gallery === true) {
                    plugin.slideThumb();
                }
            } else {
                if (settings.loop === true) {
                    settings.onBeforeNextSlide.call(this, $el, scene);
                    scene = 0;
                    $el.mode(false);
                    if (settings.gallery === true) {
                        plugin.slideThumb();
                    }
                } else if (settings.slideEndAnimation === true) {
                    $el.addClass('rightEnd');
                    setTimeout(function () {
                        $el.removeClass('rightEnd');
                    }, 400);
                }
            }
        };
        $el.mode = function (_touch) {
            if (settings.adaptiveHeight === true && settings.vertical === false) {
                $el.css('height', $children.eq(scene).outerHeight(true));
            }
            if (on === false) {
                if (settings.mode === 'slide') {
                    if (plugin.doCss()) {
                        $el.addClass('lSSlide');
                        if (settings.speed !== '') {
                            $slide.css('transition-duration', settings.speed + 'ms');
                        }
                        if (settings.cssEasing !== '') {
                            $slide.css('transition-timing-function', settings.cssEasing);
                        }
                    }
                } else {
                    if (plugin.doCss()) {
                        if (settings.speed !== '') {
                            $el.css('transition-duration', settings.speed + 'ms');
                        }
                        if (settings.cssEasing !== '') {
                            $el.css('transition-timing-function', settings.cssEasing);
                        }
                    }
                }
            }
            if (!_touch) {
                settings.onBeforeSlide.call(this, $el, scene);
            }
            if (settings.mode === 'slide') {
                plugin.slide();
            } else {
                plugin.fade();
            }
            if (!$slide.hasClass('ls-hover')) {
                plugin.auto();
            }
            setTimeout(function () {
                if (!_touch) {
                    settings.onAfterSlide.call(this, $el, scene);
                }
            }, settings.speed);
            on = true;
        };
        $el.play = function () {
            $el.goToNextSlide();
            settings.auto = true;
            plugin.auto();
        };
        $el.pause = function () {
            settings.auto = false;
            clearInterval(interval);
        };
        $el.refresh = function () {
            refresh.init();
        };
        $el.getCurrentSlideCount = function () {
            var sc = scene;
            if (settings.loop) {
                var ln = $slide.find('.lslide').length,
                    cl = $el.find('.clone.left').length;
                if (scene <= cl - 1) {
                    sc = ln + (scene - cl);
                } else if (scene >= (ln + cl)) {
                    sc = scene - ln - cl;
                } else {
                    sc = scene - cl;
                }
            }
            return sc + 1;
        };
        $el.getTotalSlideCount = function () {
            return $slide.find('.lslide').length;
        };
        $el.goToSlide = function (s) {
            if (settings.loop) {
                scene = (s + $el.find('.clone.left').length - 1);
            } else {
                scene = s;
            }
            $el.mode(false);
            if (settings.gallery === true) {
                plugin.slideThumb();
            }
        };
        $el.destroy = function () {
            if ($el.lightSlider) {
                $el.goToPrevSlide = function () {
                };
                $el.goToNextSlide = function () {
                };
                $el.mode = function () {
                };
                $el.play = function () {
                };
                $el.pause = function () {
                };
                $el.refresh = function () {
                };
                $el.getCurrentSlideCount = function () {
                };
                $el.getTotalSlideCount = function () {
                };
                $el.goToSlide = function () {
                };
                $el.lightSlider = null;
                refresh = {
                    init: function () {
                    }
                };
                $el.parent().parent().find('.lSAction, .lSPager').remove();
                $el.removeClass('lightSlider lSFade lSSlide lsGrab lsGrabbing leftEnd right').removeAttr('style').unwrap().unwrap();
                $el.children().removeAttr('style');
                $children.removeClass('lslide active');
                $el.find('.clone').remove();
                $children = null;
                interval = null;
                on = false;
                scene = 0;
            }

        };
        setTimeout(function () {
            settings.onSliderLoad.call(this, $el);
        }, 10);
        $(window).on('resize orientationchange', function (e) {
            setTimeout(function () {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
                refresh.init();
            }, 200);
        });
        return this;
    };
}(jQuery));

/*! RateIt | v1.0.22 / 05/27/2014 | https://rateit.codeplex.com/license
    http://rateit.codeplex.com | Twitter: @gjunge
*/
(function ($) {
    $.rateit = {
        aria: {
            resetLabel: 'reset rating',
            ratingLabel: 'rating'
        }
    };

    $.fn.rateit = function (p1, p2) {
        //quick way out.
        var index = 1;
        var options = {};
        var mode = 'init';
        var capitaliseFirstLetter = function (string) {
            return string.charAt(0).toUpperCase() + string.substr(1);
        };

        if (this.length === 0) {
            return this;
        }


        var tp1 = $.type(p1);
        if (tp1 == 'object' || p1 === undefined || p1 === null) {
            options = $.extend({}, $.fn.rateit.defaults, p1); //wants to init new rateit plugin(s).
        }
        else if (tp1 == 'string' && p1 !== 'reset' && p2 === undefined) {
            return this.data('rateit' + capitaliseFirstLetter(p1)); //wants to get a value.
        }
        else if (tp1 == 'string') {
            mode = 'setvalue';
        }

        return this.each(function () {
            var item = $(this);


            //shorten all the item.data('rateit-XXX'), will save space in closure compiler, will be like item.data('XXX') will become x('XXX')
            var itemdata = function (key, value) {

                if (value != null) {
                    //update aria values
                    var ariakey = 'aria-value' + ((key == 'value') ? 'now' : key);
                    var range = item.find('.rateit-range');
                    if (range.attr(ariakey) != undefined) {
                        range.attr(ariakey, value);
                    }

                }

                arguments[0] = 'rateit' + capitaliseFirstLetter(key);
                return item.data.apply(item, arguments); ////Fix for WI: 523
            };

            //handle programmatic reset
            if (p1 == 'reset') {
                var setup = itemdata('init'); //get initial value
                for (var prop in setup) {
                    item.data(prop, setup[prop]);
                }

                if (itemdata('backingfld')) { //reset also backingfield
                    var fld = $(itemdata('backingfld'));
                    fld.val(itemdata('value'));
                    fld.trigger('change');
                    if (fld[0].min) {
                        fld[0].min = itemdata('min');
                    }
                    if (fld[0].max) {
                        fld[0].max = itemdata('max');
                    }
                    if (fld[0].step) {
                        fld[0].step = itemdata('step');
                    }
                }
                item.trigger('reset');
            }

            //add the rate it class.
            if (!item.hasClass('rateit')) {
                item.addClass('rateit');
            }

            var ltr = item.css('direction') != 'rtl';

            // set value mode
            if (mode == 'setvalue') {
                if (!itemdata('init')) {
                    throw 'Can\'t set value before init';
                }


                //if readonly now and it wasn't readonly, remove the eventhandlers.
                if (p1 == 'readonly' && p2 == true && !itemdata('readonly')) {
                    item.find('.rateit-range').unbind();
                    itemdata('wired', false);
                }
                //when we receive a null value, reset the score to its min value.
                if (p1 == 'value') {
                    p2 = (p2 == null) ? itemdata('min') : Math.max(itemdata('min'), Math.min(itemdata('max'), p2));
                }
                if (itemdata('backingfld')) {
                    //if we have a backing field, check which fields we should update.
                    //In case of input[type=range], although we did read its attributes even in browsers that don't support it (using fld.attr())
                    //we only update it in browser that support it (&& fld[0].min only works in supporting browsers), not only does it save us from checking if it is range input type, it also is unnecessary.
                    var fld = $(itemdata('backingfld'));
                    if (p1 == 'value') {
                        fld.val(p2);
                    }
                    if (p1 == 'min' && fld[0].min) {
                        fld[0].min = p2;
                    }
                    if (p1 == 'max' && fld[0].max) {
                        fld[0].max = p2;
                    }
                    if (p1 == 'step' && fld[0].step) {
                        fld[0].step = p2;
                    }
                }

                itemdata(p1, p2);
            }

            //init rateit plugin
            if (!itemdata('init')) {

                //get our values, either from the data-* html5 attribute or from the options.
                itemdata('min', isNaN(itemdata('min')) ? options.min : itemdata('min'));
                itemdata('max', isNaN(itemdata('max')) ? options.max : itemdata('max'));
                itemdata('step', itemdata('step') || options.step);
                itemdata('readonly', itemdata('readonly') !== undefined ? itemdata('readonly') : options.readonly);
                itemdata('resetable', itemdata('resetable') !== undefined ? itemdata('resetable') : options.resetable);
                itemdata('backingfld', itemdata('backingfld') || options.backingfld);
                itemdata('starwidth', itemdata('starwidth') || options.starwidth);
                itemdata('starheight', itemdata('starheight') || options.starheight);
                itemdata('value', Math.max(itemdata('min'), Math.min(itemdata('max'), (!isNaN(itemdata('value')) ? itemdata('value') : (!isNaN(options.value) ? options.value : options.min)))));
                itemdata('ispreset', itemdata('ispreset') !== undefined ? itemdata('ispreset') : options.ispreset);
                //are we LTR or RTL?

                if (itemdata('backingfld')) {
                    //if we have a backing field, hide it, override defaults if range or select.
                    var fld = $(itemdata('backingfld')).hide();

                    if (fld.attr('disabled') || fld.attr('readonly')) {
                        itemdata('readonly', true); //http://rateit.codeplex.com/discussions/362055 , if a backing field is disabled or readonly at instantiation, make rateit readonly.
                    }

                    if (fld[0].nodeName == 'INPUT') {
                        if (fld[0].type == 'range' || fld[0].type == 'text') { //in browsers not support the range type, it defaults to text

                            itemdata('min', parseInt(fld.attr('min')) || itemdata('min')); //if we would have done fld[0].min it wouldn't have worked in browsers not supporting the range type.
                            itemdata('max', parseInt(fld.attr('max')) || itemdata('max'));
                            itemdata('step', parseInt(fld.attr('step')) || itemdata('step'));
                        }
                    }
                    if (fld[0].nodeName == 'SELECT' && fld[0].options.length > 1) {
                        itemdata('min', (!isNaN(itemdata('min')) ? itemdata('min') : Number(fld[0].options[0].value)));
                        itemdata('max', Number(fld[0].options[fld[0].length - 1].value));
                        itemdata('step', Number(fld[0].options[1].value) - Number(fld[0].options[0].value));
                        //see if we have a option that as explicity been selected
                        var selectedOption = fld.find('option[selected]');
                        if (selectedOption.length == 1) {
                            itemdata('value', selectedOption.val());
                        }
                    }
                    else {
                        //if it is not a select box, we can get's it's value using the val function.
                        //If it is a selectbox, we always get a value (the first one of the list), even if it was not explicity set.
                        itemdata('value', fld.val());
                    }
                }

                //Create the necessary tags. For ARIA purposes we need to give the items an ID. So we use an internal index to create unique ids
                var element = item[0].nodeName == 'DIV' ? 'div' : 'span';
                index++;
                var html = '<button id="rateit-reset-{{index}}" type="button" data-role="none" class="rateit-reset" aria-label="' + $.rateit.aria.resetLabel + '" aria-controls="rateit-range-{{index}}"></button><{{element}} id="rateit-range-{{index}}" class="rateit-range" tabindex="0" role="slider" aria-label="' + $.rateit.aria.ratingLabel + '" aria-owns="rateit-reset-{{index}}" aria-valuemin="' + itemdata('min') + '" aria-valuemax="' + itemdata('max') + '" aria-valuenow="' + itemdata('value') + '"><{{element}} class="rateit-selected" style="height:' + itemdata('starheight') + 'px"></{{element}}><{{element}} class="rateit-hover" style="height:' + itemdata('starheight') + 'px"></{{element}}></{{element}}>';
                item.append(html.replace(/{{index}}/gi, index).replace(/{{element}}/gi, element));

                //if we are in RTL mode, we have to change the float of the "reset button"
                if (!ltr) {
                    item.find('.rateit-reset').css('float', 'right');
                    item.find('.rateit-selected').addClass('rateit-selected-rtl');
                    item.find('.rateit-hover').addClass('rateit-hover-rtl');
                }

                itemdata('init', JSON.parse(JSON.stringify(item.data()))); //cheap way to create a clone
            }
            //resize the height of all elements,
            item.find('.rateit-selected, .rateit-hover').height(itemdata('starheight'));

            //set the range element to fit all the stars.
            var range = item.find('.rateit-range');
            range.width(itemdata('starwidth') * (itemdata('max') - itemdata('min'))).height(itemdata('starheight'));


            //add/remove the preset class
            var presetclass = 'rateit-preset' + ((ltr) ? '' : '-rtl');
            if (itemdata('ispreset')) {
                item.find('.rateit-selected').addClass(presetclass);
            }
            else {
                item.find('.rateit-selected').removeClass(presetclass);
            }

            //set the value if we have it.
            if (itemdata('value') != null) {
                var score = (itemdata('value') - itemdata('min')) * itemdata('starwidth');
                item.find('.rateit-selected').width(score);
            }

            //setup the reset button
            var resetbtn = item.find('.rateit-reset');
            if (resetbtn.data('wired') !== true) {
                resetbtn.bind('click', function (e) {
                    e.preventDefault();

                    resetbtn.blur();

                    var event = $.Event('beforereset');
                    item.trigger(event);
                    if (event.isDefaultPrevented()) {
                        return false;
                    }

                    item.rateit('value', null);
                    item.trigger('reset');
                }).data('wired', true);

            }

            //this function calculates the score based on the current position of the mouse.
            var calcRawScore = function (element, event) {
                var pageX = (event.changedTouches) ? event.changedTouches[0].pageX : event.pageX;

                var offsetx = pageX - $(element).offset().left;
                if (!ltr) {
                    offsetx = range.width() - offsetx
                }
                ;
                if (offsetx > range.width()) {
                    offsetx = range.width();
                }
                if (offsetx < 0) {
                    offsetx = 0;
                }

                return score = Math.ceil(offsetx / itemdata('starwidth') * (1 / itemdata('step')));
            };

            //sets the hover element based on the score.
            var setHover = function (score) {
                var w = score * itemdata('starwidth') * itemdata('step');
                var h = range.find('.rateit-hover');
                if (h.data('width') != w) {
                    range.find('.rateit-selected').hide();
                    h.width(w).show().data('width', w);
                    var data = [(score * itemdata('step')) + itemdata('min')];
                    item.trigger('hover', data).trigger('over', data);
                }
            };

            var setSelection = function (value) {
                var event = $.Event('beforerated');
                item.trigger(event, [value]);
                if (event.isDefaultPrevented()) {
                    return false;
                }

                itemdata('value', value);
                if (itemdata('backingfld')) {
                    $(itemdata('backingfld')).val(value).trigger('change');
                }
                if (itemdata('ispreset')) { //if it was a preset value, unset that.
                    range.find('.rateit-selected').removeClass(presetclass);
                    itemdata('ispreset', false);
                }
                range.find('.rateit-hover').hide();
                range.find('.rateit-selected').width(value * itemdata('starwidth') - (itemdata('min') * itemdata('starwidth'))).show();
                item.trigger('hover', [null]).trigger('over', [null]).trigger('rated', [value]);
                return true;
            };

            if (!itemdata('readonly')) {
                //if we are not read only, add all the events

                //if we have a reset button, set the event handler.
                if (!itemdata('resetable')) {
                    resetbtn.hide();
                }

                //when the mouse goes over the range element, we set the "hover" stars.
                if (!itemdata('wired')) {
                    range.bind('touchmove touchend', touchHandler); //bind touch events
                    range.mousemove(function (e) {
                        var score = calcRawScore(this, e);
                        setHover(score);
                    });
                    //when the mouse leaves the range, we have to hide the hover stars, and show the current value.
                    range.mouseleave(function (e) {
                        range.find('.rateit-hover').hide().width(0).data('width', '');
                        item.trigger('hover', [null]).trigger('over', [null]);
                        range.find('.rateit-selected').show();
                    });
                    //when we click on the range, we have to set the value, hide the hover.
                    range.mouseup(function (e) {
                        var score = calcRawScore(this, e);
                        var value = (score * itemdata('step')) + itemdata('min');
                        setSelection(value);
                        range.blur();
                    });

                    //support key nav
                    range.keyup(function (e) {
                        if (e.which == 38 || e.which == (ltr ? 39 : 37)) {
                            setSelection(Math.min(itemdata('value') + itemdata('step'), itemdata('max')));
                        }
                        if (e.which == 40 || e.which == (ltr ? 37 : 39)) {
                            setSelection(Math.max(itemdata('value') - itemdata('step'), itemdata('min')));
                        }
                    });

                    itemdata('wired', true);
                }
                if (itemdata('resetable')) {
                    resetbtn.show();
                }
            }
            else {
                resetbtn.hide();
            }

            range.attr('aria-readonly', itemdata('readonly'));
        });
    };

    //touch converter http://ross.posterous.com/2008/08/19/iphone-touch-events-in-javascript/
    function touchHandler(event) {

        var touches = event.originalEvent.changedTouches,
            first = touches[0],
            type = "";
        switch (event.type) {
            case "touchmove":
                type = "mousemove";
                break;
            case "touchend":
                type = "mouseup";
                break;
            default:
                return;
        }

        var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent(type, true, true, window, 1,
            first.screenX, first.screenY,
            first.clientX, first.clientY, false,
            false, false, false, 0/*left*/, null);

        first.target.dispatchEvent(simulatedEvent);
        event.preventDefault();
    };

    //some default values.
    $.fn.rateit.defaults = {
        min: 0,
        max: 5,
        step: 0.5,
        starwidth: 15,
        starheight: 11,
        readonly: false,
        resetable: true,
        ispreset: false
    };

    //invoke it on all .rateit elements. This could be removed if not wanted.
    $(function () {
        $('div.rateit, span.rateit').rateit();
    });

})(jQuery);

/*! nouislider - 8.1.0 - 2015-10-25 16:05:43 */

(function (factory) {

    if (typeof define === 'function' && define.amd) {

        // AMD. Register as an anonymous module.
        define([], factory);

    } else if (typeof exports === 'object') {

        // Node/CommonJS
        module.exports = factory();

    } else {

        // Browser globals
        window.noUiSlider = factory();
    }

}(function () {

    'use strict';


    // Removes duplicates from an array.
    function unique(array) {
        return array.filter(function (a) {
            return !this[a] ? this[a] = true : false;
        }, {});
    }

    // Round a value to the closest 'to'.
    function closest(value, to) {
        return Math.round(value / to) * to;
    }

    // Current position of an element relative to the document.
    function offset(elem) {

        var rect = elem.getBoundingClientRect(),
            doc = elem.ownerDocument,
            docElem = doc.documentElement,
            pageOffset = getPageOffset();

        // getBoundingClientRect contains left scroll in Chrome on Android.
        // I haven't found a feature detection that proves this. Worst case
        // scenario on mis-match: the 'tap' feature on horizontal sliders breaks.
        if (/webkit.*Chrome.*Mobile/i.test(navigator.userAgent)) {
            pageOffset.x = 0;
        }

        return {
            top: rect.top + pageOffset.y - docElem.clientTop,
            left: rect.left + pageOffset.x - docElem.clientLeft
        };
    }

    // Checks whether a value is numerical.
    function isNumeric(a) {
        return typeof a === 'number' && !isNaN(a) && isFinite(a);
    }

    // Rounds a number to 7 supported decimals.
    function accurateNumber(number) {
        var p = Math.pow(10, 7);
        return Number((Math.round(number * p) / p).toFixed(7));
    }

    // Sets a class and removes it after [duration] ms.
    function addClassFor(element, className, duration) {
        addClass(element, className);
        setTimeout(function () {
            removeClass(element, className);
        }, duration);
    }

    // Limits a value to 0 - 100
    function limit(a) {
        return Math.max(Math.min(a, 100), 0);
    }

    // Wraps a variable as an array, if it isn't one yet.
    function asArray(a) {
        return Array.isArray(a) ? a : [a];
    }

    // Counts decimals
    function countDecimals(numStr) {
        var pieces = numStr.split(".");
        return pieces.length > 1 ? pieces[1].length : 0;
    }

    // http://youmightnotneedjquery.com/#add_class
    function addClass(el, className) {
        if (el.classList) {
            el.classList.add(className);
        } else {
            el.className += ' ' + className;
        }
    }

    // http://youmightnotneedjquery.com/#remove_class
    function removeClass(el, className) {
        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    // http://youmightnotneedjquery.com/#has_class
    function hasClass(el, className) {
        if (el.classList) {
            el.classList.contains(className);
        } else {
            new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        }
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY#Notes
    function getPageOffset() {

        var supportPageOffset = window.pageXOffset !== undefined,
            isCSS1Compat = ((document.compatMode || "") === "CSS1Compat"),
            x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft,
            y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;

        return {
            x: x,
            y: y
        };
    }

    // todo
    function addCssPrefix(cssPrefix) {
        return function (className) {
            return cssPrefix + className;
        };
    }


    var
        // Determine the events to bind. IE11 implements pointerEvents without
        // a prefix, which breaks compatibility with the IE10 implementation.
        /** @const */
        actions = window.navigator.pointerEnabled ? {
            start: 'pointerdown',
            move: 'pointermove',
            end: 'pointerup'
        } : window.navigator.msPointerEnabled ? {
            start: 'MSPointerDown',
            move: 'MSPointerMove',
            end: 'MSPointerUp'
        } : {
            start: 'mousedown touchstart',
            move: 'mousemove touchmove',
            end: 'mouseup touchend'
        },
        defaultCssPrefix = 'noUi-';


// Value calculation

    // Determine the size of a sub-range in relation to a full range.
    function subRangeRatio(pa, pb) {
        return (100 / (pb - pa));
    }

    // (percentage) How many percent is this value of this range?
    function fromPercentage(range, value) {
        return (value * 100) / (range[1] - range[0]);
    }

    // (percentage) Where is this value on this range?
    function toPercentage(range, value) {
        return fromPercentage(range, range[0] < 0 ?
            value + Math.abs(range[0]) :
            value - range[0]);
    }

    // (value) How much is this percentage on this range?
    function isPercentage(range, value) {
        return ((value * (range[1] - range[0])) / 100) + range[0];
    }


// Range conversion

    function getJ(value, arr) {

        var j = 1;

        while (value >= arr[j]) {
            j += 1;
        }

        return j;
    }

    // (percentage) Input a value, find where, on a scale of 0-100, it applies.
    function toStepping(xVal, xPct, value) {

        if (value >= xVal.slice(-1)[0]) {
            return 100;
        }

        var j = getJ(value, xVal), va, vb, pa, pb;

        va = xVal[j - 1];
        vb = xVal[j];
        pa = xPct[j - 1];
        pb = xPct[j];

        return pa + (toPercentage([va, vb], value) / subRangeRatio(pa, pb));
    }

    // (value) Input a percentage, find where it is on the specified range.
    function fromStepping(xVal, xPct, value) {

        // There is no range group that fits 100
        if (value >= 100) {
            return xVal.slice(-1)[0];
        }

        var j = getJ(value, xPct), va, vb, pa, pb;

        va = xVal[j - 1];
        vb = xVal[j];
        pa = xPct[j - 1];
        pb = xPct[j];

        return isPercentage([va, vb], (value - pa) * subRangeRatio(pa, pb));
    }

    // (percentage) Get the step that applies at a certain value.
    function getStep(xPct, xSteps, snap, value) {

        if (value === 100) {
            return value;
        }

        var j = getJ(value, xPct), a, b;

        // If 'snap' is set, steps are used as fixed points on the slider.
        if (snap) {

            a = xPct[j - 1];
            b = xPct[j];

            // Find the closest position, a or b.
            if ((value - a) > ((b - a) / 2)) {
                return b;
            }

            return a;
        }

        if (!xSteps[j - 1]) {
            return value;
        }

        return xPct[j - 1] + closest(
            value - xPct[j - 1],
            xSteps[j - 1]
        );
    }


// Entry parsing

    function handleEntryPoint(index, value, that) {

        var percentage;

        // Wrap numerical input in an array.
        if (typeof value === "number") {
            value = [value];
        }

        // Reject any invalid input, by testing whether value is an array.
        if (Object.prototype.toString.call(value) !== '[object Array]') {
            throw new Error("noUiSlider: 'range' contains invalid value.");
        }

        // Covert min/max syntax to 0 and 100.
        if (index === 'min') {
            percentage = 0;
        } else if (index === 'max') {
            percentage = 100;
        } else {
            percentage = parseFloat(index);
        }

        // Check for correct input.
        if (!isNumeric(percentage) || !isNumeric(value[0])) {
            throw new Error("noUiSlider: 'range' value isn't numeric.");
        }

        // Store values.
        that.xPct.push(percentage);
        that.xVal.push(value[0]);

        // NaN will evaluate to false too, but to keep
        // logging clear, set step explicitly. Make sure
        // not to override the 'step' setting with false.
        if (!percentage) {
            if (!isNaN(value[1])) {
                that.xSteps[0] = value[1];
            }
        } else {
            that.xSteps.push(isNaN(value[1]) ? false : value[1]);
        }
    }

    function handleStepPoint(i, n, that) {

        // Ignore 'false' stepping.
        if (!n) {
            return true;
        }

        // Factor to range ratio
        that.xSteps[i] = fromPercentage([
            that.xVal[i]
            , that.xVal[i + 1]
        ], n) / subRangeRatio(
            that.xPct[i],
            that.xPct[i + 1]);
    }


// Interface

    // The interface to Spectrum handles all direction-based
    // conversions, so the above values are unaware.

    function Spectrum(entry, snap, direction, singleStep) {

        this.xPct = [];
        this.xVal = [];
        this.xSteps = [singleStep || false];
        this.xNumSteps = [false];

        this.snap = snap;
        this.direction = direction;

        var index, ordered = [/* [0, 'min'], [1, '50%'], [2, 'max'] */];

        // Map the object keys to an array.
        for (index in entry) {
            if (entry.hasOwnProperty(index)) {
                ordered.push([entry[index], index]);
            }
        }

        // Sort all entries by value (numeric sort).
        if (ordered.length && typeof ordered[0][0] === "object") {
            ordered.sort(function (a, b) {
                return a[0][0] - b[0][0];
            });
        } else {
            ordered.sort(function (a, b) {
                return a[0] - b[0];
            });
        }


        // Convert all entries to subranges.
        for (index = 0; index < ordered.length; index++) {
            handleEntryPoint(ordered[index][1], ordered[index][0], this);
        }

        // Store the actual step values.
        // xSteps is sorted in the same order as xPct and xVal.
        this.xNumSteps = this.xSteps.slice(0);

        // Convert all numeric steps to the percentage of the subrange they represent.
        for (index = 0; index < this.xNumSteps.length; index++) {
            handleStepPoint(index, this.xNumSteps[index], this);
        }
    }

    Spectrum.prototype.getMargin = function (value) {
        return this.xPct.length === 2 ? fromPercentage(this.xVal, value) : false;
    };

    Spectrum.prototype.toStepping = function (value) {

        value = toStepping(this.xVal, this.xPct, value);

        // Invert the value if this is a right-to-left slider.
        if (this.direction) {
            value = 100 - value;
        }

        return value;
    };

    Spectrum.prototype.fromStepping = function (value) {

        // Invert the value if this is a right-to-left slider.
        if (this.direction) {
            value = 100 - value;
        }

        return accurateNumber(fromStepping(this.xVal, this.xPct, value));
    };

    Spectrum.prototype.getStep = function (value) {

        // Find the proper step for rtl sliders by search in inverse direction.
        // Fixes issue #262.
        if (this.direction) {
            value = 100 - value;
        }

        value = getStep(this.xPct, this.xSteps, this.snap, value);

        if (this.direction) {
            value = 100 - value;
        }

        return value;
    };

    Spectrum.prototype.getApplicableStep = function (value) {

        // If the value is 100%, return the negative step twice.
        var j = getJ(value, this.xPct), offset = value === 100 ? 2 : 1;
        return [this.xNumSteps[j - 2], this.xVal[j - offset], this.xNumSteps[j - offset]];
    };

    // Outside testing
    Spectrum.prototype.convert = function (value) {
        return this.getStep(this.toStepping(value));
    };

    /*	Every input option is tested and parsed. This'll prevent
	endless validation in internal methods. These tests are
	structured with an item for every option available. An
	option can be marked as required by setting the 'r' flag.
	The testing function is provided with three arguments:
		- The provided value for the option;
		- A reference to the options object;
		- The name for the option;

	The testing function returns false when an error is detected,
	or true when everything is OK. It can also modify the option
	object, to make sure all values can be correctly looped elsewhere. */

    var defaultFormatter = {
        'to': function (value) {
            return value !== undefined && value.toFixed(2);
        }, 'from': Number
    };

    function testStep(parsed, entry) {

        if (!isNumeric(entry)) {
            throw new Error("noUiSlider: 'step' is not numeric.");
        }

        // The step option can still be used to set stepping
        // for linear sliders. Overwritten if set in 'range'.
        parsed.singleStep = entry;
    }

    function testRange(parsed, entry) {

        // Filter incorrect input.
        if (typeof entry !== 'object' || Array.isArray(entry)) {
            throw new Error("noUiSlider: 'range' is not an object.");
        }

        // Catch missing start or end.
        if (entry.min === undefined || entry.max === undefined) {
            throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");
        }

        parsed.spectrum = new Spectrum(entry, parsed.snap, parsed.dir, parsed.singleStep);
    }

    function testStart(parsed, entry) {

        entry = asArray(entry);

        // Validate input. Values aren't tested, as the public .val method
        // will always provide a valid location.
        if (!Array.isArray(entry) || !entry.length || entry.length > 2) {
            throw new Error("noUiSlider: 'start' option is incorrect.");
        }

        // Store the number of handles.
        parsed.handles = entry.length;

        // When the slider is initialized, the .val method will
        // be called with the start options.
        parsed.start = entry;
    }

    function testSnap(parsed, entry) {

        // Enforce 100% stepping within subranges.
        parsed.snap = entry;

        if (typeof entry !== 'boolean') {
            throw new Error("noUiSlider: 'snap' option must be a boolean.");
        }
    }

    function testAnimate(parsed, entry) {

        // Enforce 100% stepping within subranges.
        parsed.animate = entry;

        if (typeof entry !== 'boolean') {
            throw new Error("noUiSlider: 'animate' option must be a boolean.");
        }
    }

    function testConnect(parsed, entry) {

        if (entry === 'lower' && parsed.handles === 1) {
            parsed.connect = 1;
        } else if (entry === 'upper' && parsed.handles === 1) {
            parsed.connect = 2;
        } else if (entry === true && parsed.handles === 2) {
            parsed.connect = 3;
        } else if (entry === false) {
            parsed.connect = 0;
        } else {
            throw new Error("noUiSlider: 'connect' option doesn't match handle count.");
        }
    }

    function testOrientation(parsed, entry) {

        // Set orientation to an a numerical value for easy
        // array selection.
        switch (entry) {
            case 'horizontal':
                parsed.ort = 0;
                break;
            case 'vertical':
                parsed.ort = 1;
                break;
            default:
                throw new Error("noUiSlider: 'orientation' option is invalid.");
        }
    }

    function testMargin(parsed, entry) {

        if (!isNumeric(entry)) {
            throw new Error("noUiSlider: 'margin' option must be numeric.");
        }

        parsed.margin = parsed.spectrum.getMargin(entry);

        if (!parsed.margin) {
            throw new Error("noUiSlider: 'margin' option is only supported on linear sliders.");
        }
    }

    function testLimit(parsed, entry) {

        if (!isNumeric(entry)) {
            throw new Error("noUiSlider: 'limit' option must be numeric.");
        }

        parsed.limit = parsed.spectrum.getMargin(entry);

        if (!parsed.limit) {
            throw new Error("noUiSlider: 'limit' option is only supported on linear sliders.");
        }
    }

    function testDirection(parsed, entry) {

        // Set direction as a numerical value for easy parsing.
        // Invert connection for RTL sliders, so that the proper
        // handles get the connect/background classes.
        switch (entry) {
            case 'ltr':
                parsed.dir = 0;
                break;
            case 'rtl':
                parsed.dir = 1;
                parsed.connect = [0, 2, 1, 3][parsed.connect];
                break;
            default:
                throw new Error("noUiSlider: 'direction' option was not recognized.");
        }
    }

    function testBehaviour(parsed, entry) {

        // Make sure the input is a string.
        if (typeof entry !== 'string') {
            throw new Error("noUiSlider: 'behaviour' must be a string containing options.");
        }

        // Check if the string contains any keywords.
        // None are required.
        var tap = entry.indexOf('tap') >= 0,
            drag = entry.indexOf('drag') >= 0,
            fixed = entry.indexOf('fixed') >= 0,
            snap = entry.indexOf('snap') >= 0;

        // Fix #472
        if (drag && !parsed.connect) {
            throw new Error("noUiSlider: 'drag' behaviour must be used with 'connect': true.");
        }

        parsed.events = {
            tap: tap || snap,
            drag: drag,
            fixed: fixed,
            snap: snap
        };
    }

    function testTooltips(parsed, entry) {

        if (entry === true) {
            parsed.tooltips = true;
        }

        if (entry && entry.format) {

            if (typeof entry.format !== 'function') {
                throw new Error("noUiSlider: 'tooltips.format' must be an object.");
            }

            parsed.tooltips = {
                format: entry.format
            };
        }
    }

    function testFormat(parsed, entry) {

        parsed.format = entry;

        // Any object with a to and from method is supported.
        if (typeof entry.to === 'function' && typeof entry.from === 'function') {
            return true;
        }

        throw new Error("noUiSlider: 'format' requires 'to' and 'from' methods.");
    }

    function testCssPrefix(parsed, entry) {

        if (entry !== undefined && typeof entry !== 'string') {
            throw new Error("noUiSlider: 'cssPrefix' must be a string.");
        }

        parsed.cssPrefix = entry;
    }

    // Test all developer settings and parse to assumption-safe values.
    function testOptions(options) {

        var parsed = {
            margin: 0,
            limit: 0,
            animate: true,
            format: defaultFormatter
        }, tests;

        // Tests are executed in the order they are presented here.
        tests = {
            'step': {r: false, t: testStep},
            'start': {r: true, t: testStart},
            'connect': {r: true, t: testConnect},
            'direction': {r: true, t: testDirection},
            'snap': {r: false, t: testSnap},
            'animate': {r: false, t: testAnimate},
            'range': {r: true, t: testRange},
            'orientation': {r: false, t: testOrientation},
            'margin': {r: false, t: testMargin},
            'limit': {r: false, t: testLimit},
            'behaviour': {r: true, t: testBehaviour},
            'format': {r: false, t: testFormat},
            'tooltips': {r: false, t: testTooltips},
            'cssPrefix': {r: false, t: testCssPrefix}
        };

        var defaults = {
            'connect': false,
            'direction': 'ltr',
            'behaviour': 'tap',
            'orientation': 'horizontal'
        };

        // Set defaults where applicable.
        Object.keys(defaults).forEach(function (name) {
            if (options[name] === undefined) {
                options[name] = defaults[name];
            }
        });

        // Run all options through a testing mechanism to ensure correct
        // input. It should be noted that options might get modified to
        // be handled properly. E.g. wrapping integers in arrays.
        Object.keys(tests).forEach(function (name) {

            var test = tests[name];

            // If the option isn't set, but it is required, throw an error.
            if (options[name] === undefined) {

                if (test.r) {
                    throw new Error("noUiSlider: '" + name + "' is required.");
                }

                return true;
            }

            test.t(parsed, options[name]);
        });

        // Forward pips options
        parsed.pips = options.pips;

        // Pre-define the styles.
        parsed.style = parsed.ort ? 'top' : 'left';

        return parsed;
    }


    function closure(target, options) {

        // All variables local to 'closure' are prefixed with 'scope_'
        var scope_Target = target,
            scope_Locations = [-1, -1],
            scope_Base,
            scope_Handles,
            scope_Spectrum = options.spectrum,
            scope_Values = [],
            scope_Events = {};

        var cssClasses = [
            /*  0 */  'target'
            /*  1 */, 'base'
            /*  2 */, 'origin'
            /*  3 */, 'handle'
            /*  4 */, 'horizontal'
            /*  5 */, 'vertical'
            /*  6 */, 'background'
            /*  7 */, 'connect'
            /*  8 */, 'ltr'
            /*  9 */, 'rtl'
            /* 10 */, 'draggable'
            /* 11 */, ''
            /* 12 */, 'state-drag'
            /* 13 */, ''
            /* 14 */, 'state-tap'
            /* 15 */, 'active'
            /* 16 */, ''
            /* 17 */, 'stacking'
            /* 18 */, 'tooltip'
        ].map(addCssPrefix(options.cssPrefix || defaultCssPrefix));


        // Delimit proposed values for handle positions.
        function getPositions(a, b, delimit) {

            // Add movement to current position.
            var c = a + b[0], d = a + b[1];

            // Only alter the other position on drag,
            // not on standard sliding.
            if (delimit) {
                if (c < 0) {
                    d += Math.abs(c);
                }
                if (d > 100) {
                    c -= (d - 100);
                }

                // Limit values to 0 and 100.
                return [limit(c), limit(d)];
            }

            return [c, d];
        }

        // Provide a clean event with standardized offset values.
        function fixEvent(e, pageOffset) {

            // Prevent scrolling and panning on touch events, while
            // attempting to slide. The tap event also depends on this.
            e.preventDefault();

            // Filter the event to register the type, which can be
            // touch, mouse or pointer. Offset changes need to be
            // made on an event specific basis.
            var touch = e.type.indexOf('touch') === 0,
                mouse = e.type.indexOf('mouse') === 0,
                pointer = e.type.indexOf('pointer') === 0,
                x, y, event = e;

            // IE10 implemented pointer events with a prefix;
            if (e.type.indexOf('MSPointer') === 0) {
                pointer = true;
            }

            if (touch) {
                // noUiSlider supports one movement at a time,
                // so we can select the first 'changedTouch'.
                x = e.changedTouches[0].pageX;
                y = e.changedTouches[0].pageY;
            }

            pageOffset = pageOffset || getPageOffset();

            if (mouse || pointer) {
                x = e.clientX + pageOffset.x;
                y = e.clientY + pageOffset.y;
            }

            event.pageOffset = pageOffset;
            event.points = [x, y];
            event.cursor = mouse || pointer; // Fix #435

            return event;
        }

        // Append a handle to the base.
        function addHandle(direction, index) {

            var origin = document.createElement('div'),
                handle = document.createElement('div'),
                additions = ['-lower', '-upper'];

            if (direction) {
                additions.reverse();
            }

            addClass(handle, cssClasses[3]);
            addClass(handle, cssClasses[3] + additions[index]);

            addClass(origin, cssClasses[2]);
            origin.appendChild(handle);

            return origin;
        }

        // Add the proper connection classes.
        function addConnection(connect, target, handles) {

            // Apply the required connection classes to the elements
            // that need them. Some classes are made up for several
            // segments listed in the class list, to allow easy
            // renaming and provide a minor compression benefit.
            switch (connect) {
                case 1:
                    addClass(target, cssClasses[7]);
                    addClass(handles[0], cssClasses[6]);
                    break;
                case 3:
                    addClass(handles[1], cssClasses[6]);
                /* falls through */
                case 2:
                    addClass(handles[0], cssClasses[7]);
                /* falls through */
                case 0:
                    addClass(target, cssClasses[6]);
                    break;
            }
        }

        // Add handles to the slider base.
        function addHandles(nrHandles, direction, base) {

            var index, handles = [];

            // Append handles.
            for (index = 0; index < nrHandles; index += 1) {

                // Keep a list of all added handles.
                handles.push(base.appendChild(addHandle(direction, index)));
            }

            return handles;
        }

        // Initialize a single slider.
        function addSlider(direction, orientation, target) {

            // Apply classes and data to the target.
            addClass(target, cssClasses[0]);
            addClass(target, cssClasses[8 + direction]);
            addClass(target, cssClasses[4 + orientation]);

            var div = document.createElement('div');
            addClass(div, cssClasses[1]);
            target.appendChild(div);
            return div;
        }


        function defaultFormatTooltipValue(formattedValue) {
            return formattedValue;
        }

        function addTooltip(handle) {
            var element = document.createElement('div');
            element.className = cssClasses[18];
            return handle.firstChild.appendChild(element);
        }

        // The tooltips option is a shorthand for using the 'update' event.
        function tooltips(tooltipsOptions) {

            var formatTooltipValue = tooltipsOptions.format ? tooltipsOptions.format : defaultFormatTooltipValue,
                tips = scope_Handles.map(addTooltip);

            bindEvent('update', function (formattedValues, handleId, rawValues) {
                tips[handleId].innerHTML = formatTooltipValue(formattedValues[handleId], rawValues[handleId]);
            });
        }


        function getGroup(mode, values, stepped) {

            // Use the range.
            if (mode === 'range' || mode === 'steps') {
                return scope_Spectrum.xVal;
            }

            if (mode === 'count') {

                // Divide 0 - 100 in 'count' parts.
                var spread = (100 / (values - 1)), v, i = 0;
                values = [];

                // List these parts and have them handled as 'positions'.
                while ((v = i++ * spread) <= 100) {
                    values.push(v);
                }

                mode = 'positions';
            }

            if (mode === 'positions') {

                // Map all percentages to on-range values.
                return values.map(function (value) {
                    return scope_Spectrum.fromStepping(stepped ? scope_Spectrum.getStep(value) : value);
                });
            }

            if (mode === 'values') {

                // If the value must be stepped, it needs to be converted to a percentage first.
                if (stepped) {

                    return values.map(function (value) {

                        // Convert to percentage, apply step, return to value.
                        return scope_Spectrum.fromStepping(scope_Spectrum.getStep(scope_Spectrum.toStepping(value)));
                    });

                }

                // Otherwise, we can simply use the values.
                return values;
            }
        }

        function generateSpread(density, mode, group) {

            function safeIncrement(value, increment) {
                // Avoid floating point variance by dropping the smallest decimal places.
                return (value + increment).toFixed(7) / 1;
            }

            var originalSpectrumDirection = scope_Spectrum.direction,
                indexes = {},
                firstInRange = scope_Spectrum.xVal[0],
                lastInRange = scope_Spectrum.xVal[scope_Spectrum.xVal.length - 1],
                ignoreFirst = false,
                ignoreLast = false,
                prevPct = 0;

            // This function loops the spectrum in an ltr linear fashion,
            // while the toStepping method is direction aware. Trick it into
            // believing it is ltr.
            scope_Spectrum.direction = 0;

            // Create a copy of the group, sort it and filter away all duplicates.
            group = unique(group.slice().sort(function (a, b) {
                return a - b;
            }));

            // Make sure the range starts with the first element.
            if (group[0] !== firstInRange) {
                group.unshift(firstInRange);
                ignoreFirst = true;
            }

            // Likewise for the last one.
            if (group[group.length - 1] !== lastInRange) {
                group.push(lastInRange);
                ignoreLast = true;
            }

            group.forEach(function (current, index) {

                // Get the current step and the lower + upper positions.
                var step, i, q,
                    low = current,
                    high = group[index + 1],
                    newPct, pctDifference, pctPos, type,
                    steps, realSteps, stepsize;

                // When using 'steps' mode, use the provided steps.
                // Otherwise, we'll step on to the next subrange.
                if (mode === 'steps') {
                    step = scope_Spectrum.xNumSteps[index];
                }

                // Default to a 'full' step.
                if (!step) {
                    step = high - low;
                }

                // Low can be 0, so test for false. If high is undefined,
                // we are at the last subrange. Index 0 is already handled.
                if (low === false || high === undefined) {
                    return;
                }

                // Find all steps in the subrange.
                for (i = low; i <= high; i = safeIncrement(i, step)) {

                    // Get the percentage value for the current step,
                    // calculate the size for the subrange.
                    newPct = scope_Spectrum.toStepping(i);
                    pctDifference = newPct - prevPct;

                    steps = pctDifference / density;
                    realSteps = Math.round(steps);

                    // This ratio represents the ammount of percentage-space a point indicates.
                    // For a density 1 the points/percentage = 1. For density 2, that percentage needs to be re-devided.
                    // Round the percentage offset to an even number, then divide by two
                    // to spread the offset on both sides of the range.
                    stepsize = pctDifference / realSteps;

                    // Divide all points evenly, adding the correct number to this subrange.
                    // Run up to <= so that 100% gets a point, event if ignoreLast is set.
                    for (q = 1; q <= realSteps; q += 1) {

                        // The ratio between the rounded value and the actual size might be ~1% off.
                        // Correct the percentage offset by the number of points
                        // per subrange. density = 1 will result in 100 points on the
                        // full range, 2 for 50, 4 for 25, etc.
                        pctPos = prevPct + (q * stepsize);
                        indexes[pctPos.toFixed(5)] = ['x', 0];
                    }

                    // Determine the point type.
                    type = (group.indexOf(i) > -1) ? 1 : (mode === 'steps' ? 2 : 0);

                    // Enforce the 'ignoreFirst' option by overwriting the type for 0.
                    if (!index && ignoreFirst) {
                        type = 0;
                    }

                    if (!(i === high && ignoreLast)) {
                        // Mark the 'type' of this point. 0 = plain, 1 = real value, 2 = step value.
                        indexes[newPct.toFixed(5)] = [i, type];
                    }

                    // Update the percentage count.
                    prevPct = newPct;
                }
            });

            // Reset the spectrum.
            scope_Spectrum.direction = originalSpectrumDirection;

            return indexes;
        }

        function addMarking(spread, filterFunc, formatter) {

            var style = ['horizontal', 'vertical'][options.ort],
                element = document.createElement('div');

            addClass(element, 'noUi-pips');
            addClass(element, 'noUi-pips-' + style);

            function getSize(type) {
                return ['-normal', '-large', '-sub'][type];
            }

            function getTags(offset, source, values) {
                return 'class="' + source + ' ' +
                    source + '-' + style + ' ' +
                    source + getSize(values[1]) +
                    '" style="' + options.style + ': ' + offset + '%"';
            }

            function addSpread(offset, values) {

                if (scope_Spectrum.direction) {
                    offset = 100 - offset;
                }

                // Apply the filter function, if it is set.
                values[1] = (values[1] && filterFunc) ? filterFunc(values[0], values[1]) : values[1];

                // Add a marker for every point
                element.innerHTML += '<div ' + getTags(offset, 'noUi-marker', values) + '></div>';

                // Values are only appended for points marked '1' or '2'.
                if (values[1]) {
                    element.innerHTML += '<div ' + getTags(offset, 'noUi-value', values) + '>' + formatter.to(values[0]) + '</div>';
                }
            }

            // Append all points.
            Object.keys(spread).forEach(function (a) {
                addSpread(a, spread[a]);
            });

            return element;
        }

        function pips(grid) {

            var mode = grid.mode,
                density = grid.density || 1,
                filter = grid.filter || false,
                values = grid.values || false,
                stepped = grid.stepped || false,
                group = getGroup(mode, values, stepped),
                spread = generateSpread(density, mode, group),
                format = grid.format || {
                    to: Math.round
                };

            return scope_Target.appendChild(addMarking(
                spread,
                filter,
                format
            ));
        }


        // Shorthand for base dimensions.
        function baseSize() {
            return scope_Base['offset' + ['Width', 'Height'][options.ort]];
        }

        // External event handling
        function fireEvent(event, handleNumber) {

            if (handleNumber !== undefined && options.handles !== 1) {
                handleNumber = Math.abs(handleNumber - options.dir);
            }

            Object.keys(scope_Events).forEach(function (targetEvent) {

                var eventType = targetEvent.split('.')[0];

                if (event === eventType) {
                    scope_Events[targetEvent].forEach(function (callback) {
                        // .reverse is in place
                        // Return values as array, so arg_1[arg_2] is always valid.
                        callback(asArray(valueGet()), handleNumber, inSliderOrder(Array.prototype.slice.call(scope_Values)));
                    });
                }
            });
        }

        // Returns the input array, respecting the slider direction configuration.
        function inSliderOrder(values) {

            // If only one handle is used, return a single value.
            if (values.length === 1) {
                return values[0];
            }

            if (options.dir) {
                return values.reverse();
            }

            return values;
        }


        // Handler for attaching events trough a proxy.
        function attach(events, element, callback, data) {

            // This function can be used to 'filter' events to the slider.
            // element is a node, not a nodeList

            var method = function (e) {

                if (scope_Target.hasAttribute('disabled')) {
                    return false;
                }

                // Stop if an active 'tap' transition is taking place.
                if (hasClass(scope_Target, cssClasses[14])) {
                    return false;
                }

                e = fixEvent(e, data.pageOffset);

                // Ignore right or middle clicks on start #454
                if (events === actions.start && e.buttons !== undefined && e.buttons > 1) {
                    return false;
                }

                e.calcPoint = e.points[options.ort];

                // Call the event handler with the event [ and additional data ].
                callback(e, data);

            }, methods = [];

            // Bind a closure on the target for every event type.
            events.split(' ').forEach(function (eventName) {
                element.addEventListener(eventName, method, false);
                methods.push([eventName, method]);
            });

            return methods;
        }

        // Handle movement on document for handle and range drag.
        function move(event, data) {

            // Fix #498
            // Check value of .buttons in 'start' to work around a bug in IE10 mobile.
            // https://connect.microsoft.com/IE/feedback/details/927005/mobile-ie10-windows-phone-buttons-property-of-pointermove-event-always-zero
            // IE9 has .buttons zero on mousemove.
            if (event.buttons === 0 && event.which === 0 && data.buttonsProperty !== 0) {
                return end(event, data);
            }

            var handles = data.handles || scope_Handles, positions, state = false,
                proposal = ((event.calcPoint - data.start) * 100) / data.baseSize,
                handleNumber = handles[0] === scope_Handles[0] ? 0 : 1, i;

            // Calculate relative positions for the handles.
            positions = getPositions(proposal, data.positions, handles.length > 1);

            state = setHandle(handles[0], positions[handleNumber], handles.length === 1);

            if (handles.length > 1) {

                state = setHandle(handles[1], positions[handleNumber ? 0 : 1], false) || state;

                if (state) {
                    // fire for both handles
                    for (i = 0; i < data.handles.length; i++) {
                        fireEvent('slide', i);
                    }
                }
            } else if (state) {
                // Fire for a single handle
                fireEvent('slide', handleNumber);
            }
        }

        // Unbind move events on document, call callbacks.
        function end(event, data) {

            // The handle is no longer active, so remove the class.
            var active = scope_Base.querySelector('.' + cssClasses[15]),
                handleNumber = data.handles[0] === scope_Handles[0] ? 0 : 1;

            if (active !== null) {
                removeClass(active, cssClasses[15]);
            }

            // Remove cursor styles and text-selection events bound to the body.
            if (event.cursor) {
                document.body.style.cursor = '';
                document.body.removeEventListener('selectstart', document.body.noUiListener);
            }

            var d = document.documentElement;

            // Unbind the move and end events, which are added on 'start'.
            d.noUiListeners.forEach(function (c) {
                d.removeEventListener(c[0], c[1]);
            });

            // Remove dragging class.
            removeClass(scope_Target, cssClasses[12]);

            // Fire the change and set events.
            fireEvent('set', handleNumber);
            fireEvent('change', handleNumber);
        }

        // Bind move events on document.
        function start(event, data) {

            var d = document.documentElement;

            // Mark the handle as 'active' so it can be styled.
            if (data.handles.length === 1) {
                addClass(data.handles[0].children[0], cssClasses[15]);

                // Support 'disabled' handles
                if (data.handles[0].hasAttribute('disabled')) {
                    return false;
                }
            }

            // A drag should never propagate up to the 'tap' event.
            event.stopPropagation();

            // Attach the move and end events.
            var moveEvent = attach(actions.move, d, move, {
                start: event.calcPoint,
                baseSize: baseSize(),
                pageOffset: event.pageOffset,
                handles: data.handles,
                buttonsProperty: event.buttons,
                positions: [
                    scope_Locations[0],
                    scope_Locations[scope_Handles.length - 1]
                ]
            }), endEvent = attach(actions.end, d, end, {
                handles: data.handles
            });

            d.noUiListeners = moveEvent.concat(endEvent);

            // Text selection isn't an issue on touch devices,
            // so adding cursor styles can be skipped.
            if (event.cursor) {

                // Prevent the 'I' cursor and extend the range-drag cursor.
                document.body.style.cursor = getComputedStyle(event.target).cursor;

                // Mark the target with a dragging state.
                if (scope_Handles.length > 1) {
                    addClass(scope_Target, cssClasses[12]);
                }

                var f = function () {
                    return false;
                };

                document.body.noUiListener = f;

                // Prevent text selection when dragging the handles.
                document.body.addEventListener('selectstart', f, false);
            }
        }

        // Move closest handle to tapped location.
        function tap(event) {

            var location = event.calcPoint, total = 0, handleNumber, to;

            // The tap event shouldn't propagate up and cause 'edge' to run.
            event.stopPropagation();

            // Add up the handle offsets.
            scope_Handles.forEach(function (a) {
                total += offset(a)[options.style];
            });

            // Find the handle closest to the tapped position.
            handleNumber = (location < total / 2 || scope_Handles.length === 1) ? 0 : 1;

            location -= offset(scope_Base)[options.style];

            // Calculate the new position.
            to = (location * 100) / baseSize();

            if (!options.events.snap) {
                // Flag the slider as it is now in a transitional state.
                // Transition takes 300 ms, so re-enable the slider afterwards.
                addClassFor(scope_Target, cssClasses[14], 300);
            }

            // Support 'disabled' handles
            if (scope_Handles[handleNumber].hasAttribute('disabled')) {
                return false;
            }

            // Find the closest handle and calculate the tapped point.
            // The set handle to the new position.
            setHandle(scope_Handles[handleNumber], to);

            fireEvent('slide', handleNumber);
            fireEvent('set', handleNumber);
            fireEvent('change', handleNumber);

            if (options.events.snap) {
                start(event, {handles: [scope_Handles[handleNumber]]});
            }
        }

        // Attach events to several slider parts.
        function events(behaviour) {

            var i, drag;

            // Attach the standard drag event to the handles.
            if (!behaviour.fixed) {

                for (i = 0; i < scope_Handles.length; i += 1) {

                    // These events are only bound to the visual handle
                    // element, not the 'real' origin element.
                    attach(actions.start, scope_Handles[i].children[0], start, {
                        handles: [scope_Handles[i]]
                    });
                }
            }

            // Attach the tap event to the slider base.
            if (behaviour.tap) {

                attach(actions.start, scope_Base, tap, {
                    handles: scope_Handles
                });
            }

            // Make the range draggable.
            if (behaviour.drag) {

                drag = [scope_Base.querySelector('.' + cssClasses[7])];
                addClass(drag[0], cssClasses[10]);

                // When the range is fixed, the entire range can
                // be dragged by the handles. The handle in the first
                // origin will propagate the start event upward,
                // but it needs to be bound manually on the other.
                if (behaviour.fixed) {
                    drag.push(scope_Handles[(drag[0] === scope_Handles[0] ? 1 : 0)].children[0]);
                }

                drag.forEach(function (element) {
                    attach(actions.start, element, start, {
                        handles: scope_Handles
                    });
                });
            }
        }


        // Test suggested values and apply margin, step.
        function setHandle(handle, to, noLimitOption) {

            var trigger = handle !== scope_Handles[0] ? 1 : 0,
                lowerMargin = scope_Locations[0] + options.margin,
                upperMargin = scope_Locations[1] - options.margin,
                lowerLimit = scope_Locations[0] + options.limit,
                upperLimit = scope_Locations[1] - options.limit,
                newScopeValue = scope_Spectrum.fromStepping(to);

            // For sliders with multiple handles,
            // limit movement to the other handle.
            // Apply the margin option by adding it to the handle positions.
            if (scope_Handles.length > 1) {
                to = trigger ? Math.max(to, lowerMargin) : Math.min(to, upperMargin);
            }

            // The limit option has the opposite effect, limiting handles to a
            // maximum distance from another. Limit must be > 0, as otherwise
            // handles would be unmoveable. 'noLimitOption' is set to 'false'
            // for the .val() method, except for pass 4/4.
            if (noLimitOption !== false && options.limit && scope_Handles.length > 1) {
                to = trigger ? Math.min(to, lowerLimit) : Math.max(to, upperLimit);
            }

            // Handle the step option.
            to = scope_Spectrum.getStep(to);

            // Limit to 0/100 for .val input, trim anything beyond 7 digits, as
            // JavaScript has some issues in its floating point implementation.
            to = limit(parseFloat(to.toFixed(7)));

            // Return false if handle can't move and ranges were not updated
            if (to === scope_Locations[trigger] && newScopeValue === scope_Values[trigger]) {
                return false;
            }

            // Set the handle to the new position.
            // Use requestAnimationFrame for efficient painting.
            // No significant effect in Chrome, Edge sees dramatic
            // performace improvements.
            if (window.requestAnimationFrame) {
                window.requestAnimationFrame(function () {
                    handle.style[options.style] = to + '%';
                });
            } else {
                handle.style[options.style] = to + '%';
            }

            // Force proper handle stacking
            if (!handle.previousSibling) {
                removeClass(handle, cssClasses[17]);
                if (to > 50) {
                    addClass(handle, cssClasses[17]);
                }
            }

            // Update locations.
            scope_Locations[trigger] = to;

            // Convert the value to the slider stepping/range.
            scope_Values[trigger] = scope_Spectrum.fromStepping(to);

            fireEvent('update', trigger);

            return true;
        }

        // Loop values from value method and apply them.
        function setValues(count, values) {

            var i, trigger, to;

            // With the limit option, we'll need another limiting pass.
            if (options.limit) {
                count += 1;
            }

            // If there are multiple handles to be set run the setting
            // mechanism twice for the first handle, to make sure it
            // can be bounced of the second one properly.
            for (i = 0; i < count; i += 1) {

                trigger = i % 2;

                // Get the current argument from the array.
                to = values[trigger];

                // Setting with null indicates an 'ignore'.
                // Inputting 'false' is invalid.
                if (to !== null && to !== false) {

                    // If a formatted number was passed, attemt to decode it.
                    if (typeof to === 'number') {
                        to = String(to);
                    }

                    to = options.format.from(to);

                    // Request an update for all links if the value was invalid.
                    // Do so too if setting the handle fails.
                    if (to === false || isNaN(to) || setHandle(scope_Handles[trigger], scope_Spectrum.toStepping(to), i === (3 - options.dir)) === false) {
                        fireEvent('update', trigger);
                    }
                }
            }
        }

        // Set the slider value.
        function valueSet(input) {

            var count, values = asArray(input), i;

            // The RTL settings is implemented by reversing the front-end,
            // internal mechanisms are the same.
            if (options.dir && options.handles > 1) {
                values.reverse();
            }

            // Animation is optional.
            // Make sure the initial values where set before using animated placement.
            if (options.animate && scope_Locations[0] !== -1) {
                addClassFor(scope_Target, cssClasses[14], 300);
            }

            // Determine how often to set the handles.
            count = scope_Handles.length > 1 ? 3 : 1;

            if (values.length === 1) {
                count = 1;
            }

            setValues(count, values);

            // Fire the 'set' event for both handles.
            for (i = 0; i < scope_Handles.length; i++) {
                fireEvent('set', i);
            }
        }

        // Get the slider value.
        function valueGet() {

            var i, retour = [];

            // Get the value from all handles.
            for (i = 0; i < options.handles; i += 1) {
                retour[i] = options.format.to(scope_Values[i]);
            }

            return inSliderOrder(retour);
        }

        // Removes classes from the root and empties it.
        function destroy() {
            cssClasses.forEach(function (cls) {
                if (!cls) {
                    return;
                } // Ignore empty classes
                removeClass(scope_Target, cls);
            });
            scope_Target.innerHTML = '';
            delete scope_Target.noUiSlider;
        }

        // Get the current step size for the slider.
        function getCurrentStep() {

            // Check all locations, map them to their stepping point.
            // Get the step point, then find it in the input list.
            var retour = scope_Locations.map(function (location, index) {

                var step = scope_Spectrum.getApplicableStep(location),

                    // As per #391, the comparison for the decrement step can have some rounding issues.
                    // Round the value to the precision used in the step.
                    stepDecimals = countDecimals(String(step[2])),

                    // Get the current numeric value
                    value = scope_Values[index],

                    // To move the slider 'one step up', the current step value needs to be added.
                    // Use null if we are at the maximum slider value.
                    increment = location === 100 ? null : step[2],

                    // Going 'one step down' might put the slider in a different sub-range, so we
                    // need to switch between the current or the previous step.
                    prev = Number((value - step[2]).toFixed(stepDecimals)),

                    // If the value fits the step, return the current step value. Otherwise, use the
                    // previous step. Return null if the slider is at its minimum value.
                    decrement = location === 0 ? null : (prev >= step[1]) ? step[2] : (step[0] || false);

                return [decrement, increment];
            });

            // Return values in the proper order.
            return inSliderOrder(retour);
        }

        // Attach an event to this slider, possibly including a namespace
        function bindEvent(namespacedEvent, callback) {
            scope_Events[namespacedEvent] = scope_Events[namespacedEvent] || [];
            scope_Events[namespacedEvent].push(callback);

            // If the event bound is 'update,' fire it immediately for all handles.
            if (namespacedEvent.split('.')[0] === 'update') {
                scope_Handles.forEach(function (a, index) {
                    fireEvent('update', index);
                });
            }
        }

        // Undo attachment of event
        function removeEvent(namespacedEvent) {

            var event = namespacedEvent.split('.')[0],
                namespace = namespacedEvent.substring(event.length);

            Object.keys(scope_Events).forEach(function (bind) {

                var tEvent = bind.split('.')[0],
                    tNamespace = bind.substring(tEvent.length);

                if ((!event || event === tEvent) && (!namespace || namespace === tNamespace)) {
                    delete scope_Events[bind];
                }
            });
        }


        // Throw an error if the slider was already initialized.
        if (scope_Target.noUiSlider) {
            throw new Error('Slider was already initialized.');
        }


        // Create the base element, initialise HTML and set classes.
        // Add handles and links.
        scope_Base = addSlider(options.dir, options.ort, scope_Target);
        scope_Handles = addHandles(options.handles, options.dir, scope_Base);

        // Set the connect classes.
        addConnection(options.connect, scope_Target, scope_Handles);

        // Attach user events.
        events(options.events);

        if (options.pips) {
            pips(options.pips);
        }

        if (options.tooltips) {
            tooltips(options.tooltips);
        }

        // can be updated:
        // margin
        // limit
        // step
        // range
        // animate
        function updateOptions(optionsToUpdate) {

            var newOptions = testOptions({
                start: [0, 0],
                margin: optionsToUpdate.margin,
                limit: optionsToUpdate.limit,
                step: optionsToUpdate.step,
                range: optionsToUpdate.range,
                animate: optionsToUpdate.animate
            });

            options.margin = newOptions.margin;
            options.limit = newOptions.limit;
            options.step = newOptions.step;
            options.range = newOptions.range;
            options.animate = newOptions.animate;

            scope_Spectrum = newOptions.spectrum;
        }

        return {
            destroy: destroy,
            steps: getCurrentStep,
            on: bindEvent,
            off: removeEvent,
            get: valueGet,
            set: valueSet,
            updateOptions: updateOptions
        };

    }


    // Run the standard initializer
    function initialize(target, originalOptions) {

        if (!target.nodeName) {
            throw new Error('noUiSlider.create requires a single element.');
        }

        // Test the options and create the slider environment;
        var options = testOptions(originalOptions, target),
            slider = closure(target, options);

        // Use the public value method to set the start values.
        slider.set(options.start);

        target.noUiSlider = slider;
        return slider;
    }

    // Use an object instead of a function for future expansibility;
    return {
        create: initialize
    };

}));

function showpopap() {
    $('.block-popap').fadeIn(600);
    $('.block-popap .block-bg').click(function () {
        $('.block-popap').fadeOut(600);
    })
}

$(function () {
    $('input, select').styler({
        selectSearch: true
    });


    var speed = 3500;
    var homeSlider = $('.home-slider').lightSlider({
        loop: true,
        speed: speed,
        pause: speed * 1.5,
        item: 1,
        auto: true,
        slideMargin: 0,
        onBeforeStart: function ($el) {
            $('.home-slider-conteiner #loader').remove();
            $('.home-slider-conteiner').append('<div id="loader" class="run-animation"/>');
        },
        onAfterSlide: function ($el) {
            $('.home-slider-conteiner #loader').remove();
            $('.home-slider-conteiner').append('<div id="loader" class="run-animation"/>');
        }
    });

    var recommend = $('.recommend-slider').lightSlider({
        loop: false,
        item: 4,
        autoWidth: true,
        enableTouch: false,
        pager: false,
        slideMargin: 30,
    });

    $('.recommend-block .controls .prev').click(function () {
        recommend.goToPrevSlide();
    });
    $('.recommend-block .controls .next').click(function () {
        recommend.goToNextSlide();
    });

    var producttop = $('.producttop-slider').lightSlider({
        loop: false,
        item: 2,
        autoWidth: true,
        enableTouch: false,
        pager: true,
        slideMargin: 30,
    });

    $('.producttop-block .controls .prev').click(function () {
        producttop.goToPrevSlide();
    });
    $('.producttop-block .controls .next').click(function () {
        producttop.goToNextSlide();
    });

    var slider = $('.image-block-list .gallery').lightSlider({
        gallery: true,
        item: 1,
        vertical: true,
        verticalHeight: 550,
        vThumbWidth: 80,
        thumbItem: 6,
        thumbMargin: 5,
        slideMargin: 10,
        onSliderLoad: function (e) {
            var $this = $(e);
            $this.parents('.lSSlideOuter').append('<span class="scroll-top"><span/></span><span class="scroll-bottom"><span/></span>');

            var $prev = $this.parents('.lSSlideOuter').find('.scroll-top');
            var $next = $this.parents('.lSSlideOuter').find('.scroll-bottom');

            $next.click(function () {
                slider.goToNextSlide();
            });
            $prev.click(function () {
                slider.goToPrevSlide();
            });
        }
    });


    $('.rateit').bind('rated reset', function (e) {
        $(this).rateit('readonly', true);
    });

    $('.ui-favorites').click(function () {
        if (!$(this).is('.active')) {
            $(this).addClass('active').text('Избранное');
        }
    });

    $('.popap-show').hover(function () {
        clearTimeout($.data(this, 'timer'));
        $('.popap-block', this).stop(true, true).slideDown(300);
    }, function () {
        $.data(this, 'timer', setTimeout($.proxy(function () {
            $('.popap-block', this).stop(true, true).slideUp(300);
        }, this), 100));
    });

    mapsResize();

    $(window).resize(function () {
        mapsResize();
    })
});

function mapsResize() {
    var w = $(document).width();
    var width = $('.wrapper .container').width();
    $('#map-canvas').css({
        width: w,
        left: -(w - width) / 2,
    });
}

$(function () {

    var html5Slider = document.getElementById('range');
    if (html5Slider) {
        var startPrice = parseInt($('input#min-price').data('min'));
        var maxPrice = parseInt($('input#max-price').data('max'));

        noUiSlider.create(html5Slider, {
            start: [startPrice, maxPrice],
            connect: true,
            range: {
                'min': [0],
                'max': [maxPrice]
            }
        });

        $('.price-range .info-price .ui-delete').click(function () {
            html5Slider.noUiSlider.set([startPrice, maxPrice]);
        });

        html5Slider.noUiSlider.on('update', function (values, handle) {
            $('.price-range .info-price > .min-price > span').html(parseInt(values[0]));
            $('.price-range .info-price > .max-price > span').html(parseInt(values[1]));
            $('input#min-price').val(parseInt(values[0]));
            $('input#max-price').val(parseInt(values[1]));
        });
    }
});
