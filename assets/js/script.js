window.options = {};
window.options.sortby = "enddate"; //startdate, enddate, relevance
window.options.developer_mode = true;
window.options.mapping = {
    "education": "education",
    "career": "works",
    "project": "projects",
    "honor": "honors",
    "teaching": "teaching",
    "publications": "publications",
    "trips": "trips",
    "advisees": "advisees",
    "press": "press",
    "aboutme": "references",
    "certificate": "certificates"
};
window.options.months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
window.options.maxTitleChars = 26;


$(document).ready(function () {
    console.log("ready!");

    window.site.wrapDomElements();
    window.site.disableContextMenu();
    window.site.blockBackButton();


    window.site.draw(true);

    window.site.loadData();


});

$(window).resize(function () {
    console.log("resized!");
    window.site.draw(false);
});

window.site = {

    view: {
        container: "container",
        cards: "card",
        item_rows: "item_row",
    },

    data: {},

    wrapDomElements: function () {
        for (selector in this.view) {
            this.view[selector] = $(this.view[selector]);
        }
    },

    draw: function (firsttime) {
        this.view.container.css("height", window.innerHeight + "px");

        var cardHeight = window.innerHeight / 3 - 6 / 100 * window.innerHeight;
        this.view.cards.css("height", cardHeight + "px");

        if (firsttime) {
            for (var i = 0; i < this.view.cards.length; i++) {
                var type = $(this.view.cards[i]).attr("data-type");

                if (type != "me") {
                    $(this.view.cards[i]).find("icon").attr("id", "icon_" + type);

                    $(this.view.cards[i]).find("icon").css("background-image", "url(./assets/icons/" + type + "_animated.svg)");

                    /*new Vivus("icon_" + type, {
                        duration: 200,
                        type: 'delayed',
                        file: './assets/img/' + type + '.svg',
                        onReady: function (myVivus) {
                            // `el` property is the SVG element
                            myVivus.el.setAttribute('height', '120%');
                            myVivus.el.setAttribute('style', 'position:relative;top:-20%');
                        }
                    });*/

                }
            }
        }

        document.getElementById('map').addEventListener('load', function () {
            // Will get called after embed element was loaded
            window.site.map = svgPanZoom(document.getElementById('map'), {
                panEnabled: true,
                controlIconsEnabled: false,
                zoomEnabled: true,
                dblClickZoomEnabled: true,
                mouseWheelZoomEnabled: true,
                preventMouseEventsDefault: true,
                zoomScaleSensitivity: 0.2,
                minZoom: 0.5,
                maxZoom: 10,
                fit: true,
                contain: false,
                center: true,
                refreshRate: 'auto',
                onZoom: function (event) {
                    //console.log(event)
                },
                onPan: function (event) {
                    //console.log(event)
                },
            });

            $("zoomplus").on("click", function () {
                window.site.map.zoomIn();
            });

            $("zoomminus").on("click", function () {
                window.site.map.zoomOut();
            });
        });



    },
    disableContextMenu: function () {
        window.oncontextmenu = function (event) {
            event.preventDefault();
            event.stopPropagation();
            console.log("Non puoi premere tasto destro!!");
            return false;
        }
    },
    overrideConsole: function () {
        if (window.option.developer_mode) {
            console.log("----- DEVELOPER MODE -----");
        } else {
            console.log = function () {};
        }
    },
    getPlatformType: function () {
        if (navigator.userAgent.match(/mobile/i)) {
            return 'Mobile';
        } else if (navigator.userAgent.match(/iPad|Android|Touch/i)) {
            return 'Tablet';
        } else {
            return 'Desktop';
        }
        return "";
    },
    getStorage: function () {
        if (!window.localStorage) {
            Object.defineProperty(window, "localStorage", new(function () {
                var aKeys = [],
                    oStorage = {};
                Object.defineProperty(oStorage, "getItem", {
                    value: function (sKey) {
                        return sKey ? this[sKey] : null;
                    },
                    writable: false,
                    configurable: false,
                    enumerable: false
                });
                Object.defineProperty(oStorage, "key", {
                    value: function (nKeyId) {
                        return aKeys[nKeyId];
                    },
                    writable: false,
                    configurable: false,
                    enumerable: false
                });
                Object.defineProperty(oStorage, "setItem", {
                    value: function (sKey, sValue) {
                        if (!sKey) {
                            return;
                        }
                        document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
                    },
                    writable: false,
                    configurable: false,
                    enumerable: false
                });
                Object.defineProperty(oStorage, "length", {
                    get: function () {
                        return aKeys.length;
                    },
                    configurable: false,
                    enumerable: false
                });
                Object.defineProperty(oStorage, "removeItem", {
                    value: function (sKey) {
                        if (!sKey) {
                            return;
                        }
                        document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
                    },
                    writable: false,
                    configurable: false,
                    enumerable: false
                });
                Object.defineProperty(oStorage, "clear", {
                    value: function () {
                        if (!aKeys.length) {
                            return;
                        }
                        for (var sKey in aKeys) {
                            document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
                        }
                    },
                    writable: false,
                    configurable: false,
                    enumerable: false
                });
                this.get = function () {
                    var iThisIndx;
                    for (var sKey in oStorage) {
                        iThisIndx = aKeys.indexOf(sKey);
                        if (iThisIndx === -1) {
                            oStorage.setItem(sKey, oStorage[sKey]);
                        } else {
                            aKeys.splice(iThisIndx, 1);
                        }
                        delete oStorage[sKey];
                    }
                    for (aKeys; aKeys.length > 0; aKeys.splice(0, 1)) {
                        oStorage.removeItem(aKeys[0]);
                    }
                    for (var aCouple, iKey, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
                        aCouple = aCouples[nIdx].split(/\s*=\s*/);
                        if (aCouple.length > 1) {
                            oStorage[iKey = unescape(aCouple[0])] = unescape(aCouple[1]);
                            aKeys.push(iKey);
                        }
                    }
                    return oStorage;
                };
                this.configurable = false;
                this.enumerable = true;
            })());
        }
        return window.localStorage;
    },
    checkCookies: function () {
        if (!navigator.cookieEnabled) {
            swal({
                    title: "Do'h",
                    text: site.d("nocookies"),
                    type: "warning",
                    confirmButtonColor: "#f9b23b",
                    confirmButtonText: site.d("reloadpage")
                },
                function (isConfirm) {
                    if (isConfirm) {
                        location.reload(true);
                    }
                });
            window.stop();
        } else {
            site.storage = site.getStorage();
        }
    },
    blockBackButton: function (data) {
        history.pushState(null, null, location.href);
        window.onpopstate = function () {
            history.go(1);
        };
    },
    loadData: function () {
        $.ajax({
            url: "./data/data.json?" + (new Date).getTime(),
            dataType: 'json',
            crossDomain: true,
            success: function (response) {
                window.site.dataLoaded(response);
            },
            error: function (xhr, status, error) {
                console.log(status + '; ' + error);
            }
        });
    },
    dataLoaded: function (data) {
        this.data = data;
        console.log("Data loaded...");
        this.downloadPublicationList();
        this.sort();
        console.log("...and sorted");
        this.fillRows();

        $("card[data-type='me'] info").html(this.data.me.presentation);
    },
    downloadPublicationList: function () {

        $.get(this.data.publications_url, function (pubs) {
                window.site.data.publications_bib = pubs;
                let parser = new BibLatexParser(pubs, {
                    processUnexpected: true,
                    processUnknown: true
                })
                window.site.data.publications_json = parser.parse();
                //console.log(window.site.data.publications_json);

                window.site.processPublicationList();
            })
            .fail(function () {
                console.log("error in downloading publications");
            });

    },
    processPublicationList: function () {

        window.site.data.publications = [];
        for (var e in this.data.publications_json.entries) {
            var entry = this.data.publications_json.entries[e];

            try {
                var pub = {};
                //------------------------------------------------------
                pub.title = "";
                entry.fields.title.forEach(function (title) {
                    if ("text" in title) {
                        pub.title += title.text;
                    }
                });
                //------------------------------------------------------
                pub.publisher = "";
                if ("publisher" in entry.fields) {
                    entry.fields.publisher.forEach(function (publisher) {
                        if ("text" in publisher[0]) {
                            pub.publisher += publisher[0].text;
                        }
                    });
                }
                //------------------------------------------------------
                pub.date = "date" in entry.fields ? entry.fields.date : "";
                //------------------------------------------------------
                pub.doi = "doi" in entry.fields ? entry.fields.doi : "";
                //------------------------------------------------------
                pub.url = "url" in entry.fields ? entry.fields.url : "";
                //------------------------------------------------------
                pub.authors = [];
                pub.authors_csv = "";
                entry.fields.author.forEach(function (author) {
                    var fullname = "";
                    if ("given" in author) {
                        fullname += author.given[0].text;
                    }

                    if ("family" in author) {
                        fullname += " " + author.family[0].text;
                    }

                    if (fullname != "") {
                        pub.authors.push(fullname);
                        pub.authors_csv += fullname + ", ";
                    }
                });
                pub.authors_csv = pub.authors_csv.slice(0, -2);
                //------------------------------------------------------
                pub.location = "";
                if ("booktitle" in entry.fields) {
                    entry.fields.booktitle.forEach(function (title) {
                        if ("text" in title) {
                            pub.location += title.text;
                        }
                    });
                }
                if ("journaltitle" in entry.fields) {
                    entry.fields.journaltitle.forEach(function (title) {
                        if ("text" in title) {
                            pub.location += title.text;
                        }
                    });
                }
                //------------------------------------------------------
                pub.type = entry.bib_type == "incollection" ? "book" : entry.bib_type == "inproceedings" ? "conference" : "journal";
                //console.log(pub);

                window.site.data.publications.push(pub);
            } catch (error) {
                console.log(error);
            }
        }

        this.drawPublicationList();

    },
    drawPublicationList: function () {

        var el = "";

        for (var p in this.data.publications) {

            var pub = this.data.publications[p];

            var authors = pub.authors_csv.replace("Mirko Gelsomini", "<b>Mirko Gelsomini</b>");

            var icon = "📰";
            if (pub.type == "conference") {
                icon = "📘";
            } else if (pub.type == "journal") {
                icon = "📰";
            } else {
                icon = "📑";
            }

            el += `<pub_item_row url="${pub.url}">
                        <type>${pub.type}</type>
                        <title>${pub.title}</title>
                        <authors>${authors}</authors>
                        <location><publisher>[${pub.publisher}]</publisher> ${pub.location}</location>
                        <date>${pub.date}</date>
                        <doi><a href="${pub.url}" target="_blank">${pub.doi}</a></doi>
                        <icon alt="${pub.type}">${icon}</icon>
                    </pub_item_row>
                    `;

        }

        //console.log(el);

        $("[data-type=publications] content").html(el);

        $("pub_item_row").on("click", function () {
            var url = $(this).attr("url")
            window.open(url);
        })

    },
    sort: function () {

        //console.log(window.data);

        var dataArray = [];
        for (i in this.data.item) {
            var item = this.data.item[i];

            if ("enddate" in item) {
                //nothing
            } else {
                item.enddate = item.startdate;
            }

            dataArray.push(item);
        }

        //console.log(dataArray);
        //{year: window.data.item[i].startdate.year,month: window.data.item[i].startdate.month},
        if (window.options.sortby == "startdate") {

            dataArray.sort(function (a, b) {
                if (a.startdate.year < b.startdate.year) return 1;
                if (b.startdate.year < a.startdate.year) return -1;
                if (a.startdate.year == b.startdate.year) {
                    var montha, monthb;
                    if (a.startdate.month == "") montha = 12;
                    else montha = a.startdate.month;
                    if (b.startdate.month == "") monthb = 12;
                    else monthb = b.startdate.month;
                    if (montha > monthb) return -1;
                    if (montha < monthb) return 1;
                }
                return 0;
            });

        } else if (window.options.sortby == "enddate") {

            dataArray.sort(function (a, b) {
                if (a.enddate.year < b.enddate.year) return 1;
                if (b.enddate.year < a.enddate.year) return -1;
                if (a.enddate.year == b.enddate.year) {
                    var montha, monthb;
                    if (a.enddate.month == "") montha = 12;
                    else montha = a.enddate.month;
                    if (b.enddate.month == "") monthb = 12;
                    else monthb = b.enddate.month;
                    if (montha > monthb) return -1;
                    if (montha < monthb) return 1;
                }
                return 0;
            });

        } else if (window.options.sortby == "relevance") {

            dataArray.sort(function (a, b) {
                if (a.dimension < b.dimension) return -1;
                if (b.dimension < a.dimension) return 1;
                return 0;
            });

        }

        window.site.data.item = dataArray;
    },
    fillRows: function () {
        var categories = {};
        for (var i = 0; i < this.data.item.length; i++) {
            var item = this.data.item[i];
            if (categories[window.options.mapping[item.type]] === undefined) {
                categories[window.options.mapping[item.type]] = 0;
            }
            categories[window.options.mapping[item.type]]++;

            $("[data-type=" + window.options.mapping[item.type] + "]").find("content").append(this.createItemRow(item))

        }
        console.log(categories);
        this.view.item_rows.remove();
        $(".loading").removeClass("loading");
    },
    createItemRow: function (item) {

        var display = true;
        if (item.display == false) display = false;

        if (display) {

            var symbol = "./assets/icons/" + item.icon + ".png";
            var title = item.title;
            var topic = item.subtitle || "";

            var location = "";
            if (item.position !== undefined && item.position.name !== undefined) {
                var location = item.position.name;

                if (item.position.address !== undefined) {
                    location += ", " + item.position.address;
                }
            }


            /*if ((title + " - " + subtitle).length > window.options.maxTitleChars) {
                if (title.length > window.options.maxTitleChars) {
                    title = title.substr(0, window.options.maxTitleChars - 3) + "...";
                } else {
                    title = (title + " - " + subtitle).substr(0, window.options.maxTitleChars - 3) + "...";
                }
            } else {
                title = title + " - " + subtitle;
            }*/

            var description = item.content;
            var startMonth = window.options.months[item.startdate.month - 1] || "";
            var startYear = item.startdate.year;
            var endMonth = window.options.months[item.enddate.month - 1] || "";
            var endYear = item.enddate.year;

            var date = `
                <start>${startMonth} ${startYear}</start><end>${endMonth} ${endYear}</end>
                `;
            if (startMonth == "" && endMonth == "" && startYear == endYear) {
                date = `
                <start>${startYear}</start>
                `;
            } else if (startMonth == endMonth && startYear == endYear) {
                date = `
                <start>${startMonth} ${startYear}</start>
                `;
            }

            var el = `
                    <item_row>
                        <left>
                            <item_symbol_outer>
                                <item_symbol_inner style="background:url(${symbol})"></item_symbol_inner>
                            </item_symbol_outer>
                            <item_date>${date}</item_date>
                        </left>
                        <right>
                            <item_title><span>${title}</span></item_title>
                            <item_topic><span>${topic}</span></item_topic>
                            <item_location>📍 <span>${location}</span></item_location>
                        </right>
                        <item_description><span>${description}</span></item_description>                        
                    </item_row>

            `
            return el;
        }

        return "";
    }



}
