var engine = function() {
    "use strict";
    var def_settings = {
        hidePeerColumn: 1,
        hideSeedColumn: 0,
        hideTrackerIcons: 0,
        subCategoryFilter: 1,
        hideZeroSeed: 0,
        advFiltration: 2,
        enableTeaserFilter: 1,
        contextMenu: 1,
        searchPopup: 1,
        autoComplite: 1,
        useEnglishPosterName: 0,
        doNotSendStatistics: 0,
        defineCategory: 1,
        allowGetDescription: 1,
        enableFavoriteSync: 1,
        enableHighlight: 1,
        kinopoiskFolderId: '1',
        rightPanel: 0,
        hideTopSearch: 0,
        noBlankPageOnDownloadClick: 0,
        torrentListHeight: 0,
        profileListSync: 0,
        proxyURL: 'http://www.gmodules.com/ig/proxy?url={url}',
        proxyHost: '3s3s.org',
        proxyUrlFixSpaces: 1,
        proxyHostLinks: 0,
        calcSeedCount: 1
    };
    var def_listOptions = {
        favorites: { e: 1, s: 1, w: 100, c: 1 },
        kp_favorites: { e: 1, s: 1, w: 100, c: 1 },
        kp_in_cinema: { e: 1, s: 1, w: 100, c: 1 },
        kp_popular: { e: 1, s: 1, w: 100, c: 2 },
        kp_serials: { e: 1, s: 1, w: 100, c: 1 },
        imdb_in_cinema: { e: 1, s: 1, w: 100, c: 1 },
        imdb_popular: { e: 1, s: 1, w: 100, c: 2 },
        imdb_serials: { e: 1, s: 1, w: 100, c: 1 },
        gg_games_top: { e: 1, s: 1, w: 100, c: 1 },
        gg_games_new: { e: 1, s: 1, w: 100, c: 1 }
    };
    var var_cache = {
        block_href:  new RegExp('\\/\\/','img'),
        block_src:   new RegExp(' src=([\'"]?)','img'),
        unblock_src: new RegExp('data:image\\/gif,base64#blockrurl#','mg'),
        unblock_href:new RegExp('\\/\\/about:blank#blockurl#','mg'),
        rn: new RegExp('[\\r\\n]+','g'),
        searchJs: new RegExp('href=([\'"]?)javascript:', 'img'),
        historyLimit: 100,
        spaceR: /[\s\xA0]/g
    };

    var proxyList = {};

    var history = [];
    var profileList = {};
    var settings = {};

    var lastTrackerList = [];

    var webAppSupportList = function() {
        var list = {
            ru: ['nnm-club', 'kinozal', 'hdclub', 'tfile', 'fast-torrent', 'opensharing', 'btdigg'],
            en: ['bitsnoop', 'extratorrent', 'fenopy', 'torrentz', 'thepiratebay', 'kickass']
        };
        list.all = list.ru.concat(list.en);
        return list
    };

    var defaultProfileTorrentList = function () {
        var list;
        if (_lang.lang === "ru") {
            list = ['nnm-club', 'rutracker', 'kinozal', 'rutor', 'hdclub', 'tfile', 'fast-torrent', 'opensharing', 'btdigg'];
            if (mono.isWebApp) {
                list = webAppSupportList().ru;
            }
        } else {
            list = ['bitsnoop', 'extratorrent', 'fenopy', 'torrentz', 'thepiratebay', 'kickass'];
            if (mono.isWebApp) {
                list = webAppSupportList().en;
            }
        }
        return list;
    };

    var loadModule = function(uid, code) {
        /*
         * загружает пользовательский модуль.
         */
        if (torrent_lib[uid] !== undefined) {
            return;
        }
        torrent_lib[uid] = function() {
            var me = code;
            var icon = (me.icon) ? me.icon : '';
            var name = (me.name) ? me.name : '-no name-';
            var about = (me.about) ? me.about : '';
            var root_url = (me.root_url) ? me.root_url : '';
            var short_url = (me.root_url) ? me.root_url.replace(/http(s?):\/\/([^\/]*)\/?.*$/, 'http$1://$2') : '';
            var login_url = (me.auth) ? me.auth : '';
            var uid = me.uid;
            var custom_id = 'ct_' + me.uid;
            var tests = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            var flags = (me.flags) ? me.flags : {
                a: 0,
                l: 0,
                rs: 1
            };
            var xhr = undefined;
            var kit = function() {
                var ex_cat = (me.cat_name) ? 1 : 0;
                var ex_link = (me.cat_link) ? 1 : 0;
                var ex_link_r = (me.cat_link_r) ? 1 : 0;
                var ex_tr_link_r = (me.tr_link_r) ? 1 : 0;
                var ex_tr_size = (me.tr_size) ? 1 : 0;
                var ex_tr_size_c = (me.s_c) ? 1 : 0;
                var ex_tr_dl = (me.tr_dl) ? 1 : 0;
                var ex_tr_dl_r = (me.tr_dl_r) ? 1 : 0;
                var ex_seed = (me.seed) ? 1 : 0;
                var ex_peer = (me.peer) ? 1 : 0;
                var ex_date = (me.date) ? 1 : 0;
                var ex_date_regexp = (me.t_r && me.t_r_r !== undefined) ? 1 : 0; //t_r t_r_r
                var ex_size_regexp = (me.size_r && me.size_rp !== undefined) ? 1 : 0;
                var ex_seed_regexp = (me.seed_r && me.seed_rp !== undefined) ? 1 : 0;
                var ex_peer_regexp = (me.peer_r && me.peer_rp !== undefined) ? 1 : 0;
                var ex_t_m_r = (me.t_m_r) ? 1 : 0;
                var ex_t_t_r = (me.t_t_r) ? 1 : 0;
                var ex_t_f = (me.t_f !== undefined && me.t_f !== "-1") ? 1 : 0; //me.t_f is string from JSON
                var ex_auth_f = (me.auth_f) ? 1 : 0;
                var ex_encode = (me.encode) ? 1 : 0;
                var ex_post = (me.post) ? 1 : 0;
                if (ex_post === 0) {
                    flags.proxy = 1;
                }
                var ex_charset = (me.charset) ? 1 : 0;
                if (me.cat_alt) {
                    me.cat_attr = 'alt';
                    delete me.cat_alt;
                }
                if (ex_date_regexp === 1) {
                    me.t_r = new RegExp(me.t_r, "ig");
                }
                if (ex_size_regexp === 1) {
                    me.size_r = new RegExp(me.size_r, "ig");
                }
                if (ex_seed_regexp === 1) {
                    me.seed_r = new RegExp(me.seed_r, "ig");
                }
                if (ex_peer_regexp === 1) {
                    me.peer_r = new RegExp(me.peer_r, "ig");
                }

                if (ex_cat === 0) {
                    tests[1] = 1;
                    tests[2] = 1;
                }
                if (ex_link === 0) {
                    tests[2] = 1;
                }
                if (ex_tr_dl === 0) {
                    tests[5] = 1;
                }
                var readCode = function(data) {
                    data = contentFilter(data);
                    var $content = load_in_sandbox(data);

                    if (ex_auth_f === 1) {
                        if (($content.find(me.auth_f)).length === 0) {
                            view.auth(1, custom_id);
                        } else {
                            view.auth(0, custom_id);
                            return [];
                        }
                    }
                    $content = $content.find(me.items);
                    var len = $content.length - ((me.sl !== undefined) ? me.sl : 0);
                    var arr = [];
                    var start = (me.sf !== undefined) ? me.sf : 0;
                    var er = [0, 0, 0, 0, 0, 0, 0, 0];
                    for (var i = start; i < len; i++) {
                        var item = $content.eq(i);
                        var obj = {category: {id: -1}};
                        if (ex_cat === 1) {
                            if (me.cat_attr !== undefined) {
                                obj.category.title = (item.find(me.cat_name)).attr(me.cat_attr);
                            } else {
                                obj.category.title = (item.find(me.cat_name)).text();
                            }
                            if (!obj.category.title) {
                                obj.category.title = undefined;
                                er[0] += 1;
                            } else if (ex_link === 1) {
                                obj.category.url = (item.find(me.cat_link)).attr('href');
                                if (obj.category.url === undefined) {
                                    er[1] += 1;
                                } else if (ex_link_r === 1) {
                                    if (obj.category.url[0] === '/') {
                                        obj.category.url = short_url + obj.category.url;
                                    } else {
                                        obj.category.url = root_url + obj.category.url;
                                    }
                                }
                            }
                        }
                        obj.title = (item.find(me.tr_name)).text();
                        if (!obj.title) {
                            er[2] += 1;
                            continue;
                        }
                        obj.url = (item.find(me.tr_link)).attr('href');
                        if (obj.url === undefined) {
                            er[3] += 1;
                            continue;
                        }
                        obj.url = obj.url.replace(var_cache.rn, '');
                        if (ex_tr_link_r === 1) {
                            if (obj.url[0] === '/') {
                                obj.url = short_url + obj.url;
                            } else {
                                obj.url = root_url + obj.url;
                            }
                        }
                        if (ex_tr_size === 1) {
                            if (me.size_attr !== undefined) {
                                obj.size = (item.find(me.tr_size)).attr(me.size_attr);
                            } else {
                                obj.size = (item.find(me.tr_size)).text();
                            }
                            if (obj.size) {
                                obj.size = obj.size.replace(var_cache.rn, ' ');
                                if (ex_size_regexp === 1) {
                                    obj.size = obj.size.replace(me.size_r, me.size_rp);
                                }
                                if (ex_tr_size_c === 1) {
                                    obj.size = ex_kit.format_size(obj.size);
                                }
                            }
                            if (!ex_kit.isNumber(obj.size)) {
                                obj.size = 0;
                                er[4] += 1;
                            }
                        } else {
                            obj.size = 0;
                        }
                        if (ex_tr_dl === 1) {
                            obj.dl = (item.find(me.tr_dl)).attr('href');
                            if (obj.dl !== undefined) {
                                obj.dl = obj.dl.replace(var_cache.rn, '');
                                if (ex_tr_dl_r === 1) {
                                    if (obj.dl[0] === '/') {
                                        obj.dl = short_url + obj.dl;
                                    } else {
                                        obj.dl = root_url + obj.dl;
                                    }
                                }
                            } else {
                                er[5] += 1;
                            }
                        }
                        if (ex_seed === 1) {
                            obj.seeds = (item.find(me.seed)).text();
                            if (obj.seeds) {
                                obj.seeds = obj.seeds.replace(var_cache.rn, ' ');
                                if (ex_seed_regexp === 1) {
                                    obj.seeds = obj.seeds.replace(me.seed_r, me.seed_rp);
                                }
                            }
                            if (!ex_kit.isNumber(obj.seeds)) {
                                obj.seeds = 1;
                                er[6] += 1;
                            }
                        } else {
                            obj.seeds = 1;
                        }
                        if (ex_peer === 1) {
                            obj.leechs = (item.find(me.peer)).text();
                            if (obj.leechs) {
                                obj.leechs = obj.leechs.replace(var_cache.rn, ' ');
                                if (ex_peer_regexp === 1) {
                                    obj.leechs = obj.leechs.replace(me.peer_r, me.peer_rp);
                                }
                            }
                            if (!ex_kit.isNumber(obj.leechs)) {
                                obj.leechs = 0;
                                er[7] += 1;
                            }
                        } else {
                            obj.leechs = 0;
                        }
                        if (ex_date === 1) {
                            if (me.date_attr !== undefined) {
                                obj.time = (item.find(me.date)).attr(me.date_attr);
                            } else {
                                obj.time = (item.find(me.date)).text();
                            }
                            if (obj.time) {
                                obj.time = obj.time.replace(var_cache.rn, ' ');
                                if (ex_date_regexp === 1) {
                                    obj.time = obj.time.replace(me.t_r, me.t_r_r);
                                }
                                if (ex_t_t_r === 1) {
                                    obj.time = ex_kit.today_replace(obj.time, me.t_f);
                                }
                                if (ex_t_m_r === 1) {
                                    obj.time = ex_kit.month_replace(obj.time);
                                }
                                if (ex_t_f === 1) {
                                    obj.time = ex_kit.format_date(me.t_f, obj.time);
                                }
                            }
                            if (!ex_kit.isNumber(obj.time)) {
                                er[8] += 1;
                                obj.time = 0;
                            }
                        } else {
                            obj.time = 0;
                        }
                        arr.push(obj);
                    }
                    if (Math.max.apply(null,er) !== 0) {
                        var msg = 'Tracker ' + me.name + ' have problem!';
                        if (er[2])
                            msg += "\n" + er[2] + ' - torrent title skip';
                        if (er[3])
                            msg += "\n" + er[3] + ' - torrent url skip';
                        if (er[0])
                            msg += "\n" + er[0] + ' - category title fix';
                        if (er[1])
                            msg += "\n" + er[1] + ' - category url fix';
                        if (er[4])
                            msg += "\n" + er[4] + ' - size fix';
                        if (er[5])
                            msg += "\n" + er[5] + ' - dl link fix';
                        if (er[6])
                            msg += "\n" + er[6] + ' - seeds fix';
                        if (er[7])
                            msg += "\n" + er[7] + ' - leechs fix';
                        if (er[8])
                            msg += "\n" + er[8] + ' - time fix';
                        console.warn(msg);
                    }
                    return arr;
                };
                var loadPage = function(text, cb) {
                    var request = (ex_encode === 1) ? ex_kit.in_cp1251(text) : text;
                    if (xhr !== undefined)
                        xhr.abort();
                    var obj_req = {
                        tracker: custom_id,
                        type: 'GET',
                        url: me.search_path.replace('%search%', request),
                        cache: false,
                        success: function(data) {
                            cb(1, readCode(data));
                        },
                        error: function() {
                            cb(2, 2);
                        }
                    };
                    if (ex_charset) {
                        obj_req.mimeType = "text/plain; charset="+me.charset;
                    }
                    if (ex_post === 1) {
                        obj_req.type = 'POST';
                        obj_req.data = me.post.replace('%search%', request);
                    }
                    xhr = engine.ajax(obj_req);
                };
                return {
                    getPage: loadPage
                };
            }();
            return {
                find: kit.getPage,
                stop: function(){
                    if (xhr !== undefined) {
                        xhr.abort();
                    }
                    //view.loadingStatus(1, uid);
                },
                name: name,
                icon: icon,
                about: about,
                url: root_url,
                flags: flags,
                login_url: login_url,
                uid: uid,
                tests: tests
            };
        }();
    };

    var search = function(text, trackers, nohistory) {
        /*
         * функция выполняет многопоточный поиск по трекерам
         * text - запрос
         * tracker_id - id трекера, если нету - поиск во всех трекерах в списке.
         * nohistory - если 1 то история не пишется.
         */
        text = text.replace(var_cache.spaceR, ' ');
        lastTrackerList = trackers.slice(0);
        trackers.forEach(function(tracker) {
            try {
                view.loadingStatus(0, tracker);
                torrent_lib[tracker].find(text, function(type, arg) {
                    if (type === 1) {
                        // result list
                        view.result(tracker, arg, text);
                    } else
                    if (type === 2) {
                        // error?
                        view.loadingStatus(arg, tracker);
                    }
                });
            } catch (err) {
                view.loadingStatus(2, tracker);
            }
        });
        if (nohistory) {
            return;
        }
        // bug, trackers.length === 1 , > 0 - add all in history
        updateHistory(text, (trackers.length === 1) ? trackers : []);
    };

    var stop = function() {
        lastTrackerList.forEach(function(tracker) {
            if (torrent_lib[tracker] === undefined) {
                return 1;
            }
            torrent_lib[tracker].stop();
            view.loadingStatus(1, tracker);
        });
    };

    var updateHistory = function(title, trackers) {
        /*
         * добавляет поисковый запрос в историю.
         * если такой запрос уже есть - увеличивает кол-во попаданий и обновляет дату запроса.
         */
        if (!title) {
            return;
        }
        var trackers_names = [];
        trackers.forEach(function(tracker) {
            trackers_names.push( torrent_lib[tracker].name );
        });
        var found = false;
        var oldest_time;
        var oldest_item;
        for (var i = 0, item; item = history[i]; i++) {
            if (found === false && item.title === title) {
                item.count += 1;
                item.time = parseInt(Date.now() / 1000);
                item.trackers = trackers;
                item.trackers_names = trackers_names;
                found = true;
            }
            if (oldest_time === undefined || oldest_time > item.time) {
                oldest_time = item.time;
                oldest_item = i;
            }
        }
        if (found === false) {
            history.push({
                title: title,
                count: 1,
                time: parseInt(Date.now() / 1000),
                trackers: trackers,
                trackers_names: trackers_names
            });
        }
        var historyList_len = history.length;
        if (historyList_len > var_cache.historyLimit) {
            history.splice(oldest_item, 1);
        }
        if (historyList_len - 1 > var_cache.historyLimit) {
            history.splice(var_cache.historyLimit);
        }
        mono.storage.set({history: history});
    };

    var contentFilter = function(content) {
        return content.replace(var_cache.searchJs, 'data-bad-href=$1').replace(var_cache.block_href, '//about:blank#blockurl#').replace(var_cache.block_src, ' src=$1data:image/gif,base64#blockrurl#');
    };

    var contentUnFilter = function(content) {
        return content.replace(var_cache.unblock_src, '').replace(var_cache.unblock_href, '//');
    };

    var load_in_sandbox = function(content) {
        var $safe_content;
        $safe_content = $($.parseHTML(content));
        return $safe_content;
    };

    var changeUrlHostProxy = function(url) {
        if (!settings.proxyHost) {
            return url;
        }
        if (url[6] !== '/') {
            return url;
        }
        if (url.indexOf(settings.proxyHost) !== -1) {
            return url;
        }
        var sPos = url.indexOf('//');
        if (sPos === -1) {
            return url;
        }
        sPos += 2;
        sPos = url.indexOf('/', sPos);
        if (sPos === -1) {
            sPos = url.length;
        }
        return url.substr(0, sPos) + '.' + settings.proxyHost + url.substr(sPos);
    };

    var setWebAppUrl = function(url, proxyType) {
        var webAppUrl = '/app/via?url=' + encodeURIComponent(url);
        if (proxyType !== undefined) {
            if (proxyType === 2 && def_settings.proxyHost === settings.proxyHost) {
                return webAppUrl;
            }
            return url;
        }
        return webAppUrl;
    };

    var ajax = function(obj) {
        var url = obj.url;

        var method = obj.type || 'GET';
        method.toUpperCase();

        var data = obj.data;

        if (data && typeof data !== "string") {
            data = $.param(data);
        }

        if (data && method === 'GET') {
            url += ( (url.indexOf('?') === -1)?'?':'&' ) + data;
            data = undefined;
        }

        if (obj.cache === false && ['GET','HEAD'].indexOf(method) !== -1) {
            var nc = '_=' + Date.now();
            url += ( (url.indexOf('?') === -1)?'?':'&' ) + nc;
        }

        if (mono.isFF && obj.tracker) {
            obj.safe = true;
        }

        var proxyType = proxyList[obj.tracker];
        if (method === 'GET' && proxyType === 1) {
            if (settings.proxyUrlFixSpaces) {
                url = url.replace(/[\t\s]+/g, '%20');
            }
            url = settings.proxyURL.replace('{url}', encodeURIComponent(url));
        }

        if (proxyType === 2) {
            url = changeUrlHostProxy(url);
        }

        if (mono.isWebApp && !obj.localXhr) {
            url = setWebAppUrl(url, proxyType);
        }

        var xhr;
        if (mono.isFF) {
            xhr = {};
            xhr.open = [method, url, true];
        } else {
            xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
        }

        if (obj.dataType) {
            xhr.responseType = obj.dataType = obj.dataType.toLowerCase();
        }

        if (!obj.headers) {
            obj.headers = {};
        }

        if (obj.contentType) {
            obj.headers["Content-Type"] = obj.contentType;
        }

        if (data && !obj.headers["Content-Type"]) {
            obj.headers["Content-Type"] = 'application/x-www-form-urlencoded; charset=UTF-8';
        }

        if (mono.isFF) {
            xhr.headers = obj.headers;
            xhr.mimeType = obj.mimeType;
            xhr.data = data;
            xhr.id = Math.floor((Math.random() * 10000) + 1);
            xhr.safe = !!obj.safe;

            mono.sendMessage({action: 'xhr', data: xhr}, function(_xhr) {
                xhr.status = _xhr.status;
                xhr.statusText = _xhr.statusText;
                xhr.response = _xhr.response;
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                    return obj.success && obj.success(xhr.response);
                }
                obj.error && obj.error(xhr);
            }, "service");

            xhr.abort = function() {
                mono.sendMessage({action: 'xhrAbort', data: xhr.id}, undefined, "service");
            }
        } else {
            if (obj.mimeType) {
                xhr.overrideMimeType(obj.mimeType);
            }
            if (obj.headers) {
                for (var key in obj.headers) {
                    xhr.setRequestHeader(key, obj.headers[key]);
                }
            }

            if (mono.isOpera) {
                xhr.onreadystatechange = function () {
                    if (xhr.readyState > 1 && (xhr.status === 302 || xhr.status === 0)) {
                        // Opera xhr redirect
                        if (obj.noRedirect === undefined) {
                            obj.noRedirect = 0;
                        }
                        var location = xhr.getResponseHeader('Location');
                        if (location && obj.noRedirect < 5) {
                            obj.noRedirect++;
                            var _obj = {};
                            for (var key in obj) {
                                _obj[key] = obj[key];
                            }
                            _obj.url = location;
                            delete obj.success;
                            delete obj.error;
                            var _xhr = engine.ajax(_obj);
                            xhr.abort = _xhr.abort;
                        }
                    }
                };
            }

            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304 ||
                    (mono.isOpera && xhr.status === 0 && xhr.response) ) {
                    var response = (obj.dataType) ? xhr.response : xhr.responseText;
                    if (obj.dataType === 'json' && typeof response !== 'object' && xhr.responseText) {
                        response = JSON.parse(xhr.responseText);
                    }
                    return obj.success && obj.success(response);
                }
                obj.error && obj.error(xhr);
            };
            xhr.onerror = function() {
                obj.error && obj.error(xhr);
            };
            xhr.send(data);
        }

        return xhr;
    };

    var optionsMigration = function(cb) {
        var map = {
            HideLeech: 'hidePeerColumn',
            HideSeed: 'hideSeedColumn',
            ShowIcons: 'hideTrackerIcons',
            SubCategoryFilter: 'subCategoryFilter',
            HideZeroSeed: 'hideZeroSeed',
            AdvFiltration: 'advFiltration',
            TeaserFilter: 'enableTeaserFilter',
            context_menu: 'contextMenu',
            search_popup: 'searchPopup',
            AutoComplite_opt: 'autoComplite',
            use_english_postername: 'useEnglishPosterName',
            google_analytics: 'doNotSendStatistics',
            autoSetCat: 'defineCategory',
            allow_get_description: 'allowGetDescription',
            allow_favorites_sync: 'enableFavoriteSync',
            sub_select_enable: 'enableHighlight',
            kinopoisk_f_id: 'kinopoiskFolderId',
            filter_panel_to_left: 'rightPanel',
            no_blank_dl_link: 'noBlankPageOnDownloadClick',
            torrent_list_r: 'torrentListHeight'
        };
        mono.storage.get('optMigrated', function(storage) {
            if (storage.optMigrated) {
                return cb && cb();
            }
            var keys = [];
            for (var item in map) {
                keys.push(item);
            }
            mono.storage.get(keys, function(storage) {
                var newKeys = {
                    optMigrated: 1
                };
                var keys = [];
                for (var item in storage) {
                    if (storage[item] === undefined) {
                        continue;
                    }
                    keys.push(item);
                    if (item === 'ShowIcons' || item === 'filter_panel_to_left') {
                        storage[item] = (!storage[item])?1:0;
                    }
                    newKeys[ map[item] ] = storage[item];
                }
                mono.storage.set(newKeys, function() {
                    mono.storage.remove(keys);
                    cb && cb();
                });
            });
        });
    };

    var loadSettings = function(cb) {
        mono.loadLanguage(function(language) {
            window._lang = language;
            if (_lang.lang !== 'ru') {
                def_settings.hideTopSearch = 1;
            }
            optionsMigration(function() {
                var settings = {};
                var changes = [];
                for (var key in def_settings) {
                    changes.push(key);
                }
                mono.storage.get(changes, function(storage) {
                    for (var key in engine.def_settings) {
                        var defaultValue = engine.def_settings[key];
                        var value = storage[key];
                        if (value === undefined) {
                            value = defaultValue;
                        }
                        settings[key] = value;
                    }
                    cb && cb(settings);
                });
            });
        });
    };

    var prepareProfileList = function () {
        var first = undefined;
        for (var profile in profileList) {
            first = profile;
            break;
        }
        if (first === undefined) {
            first = _lang.label_def_profile;
        }
        if (profileList[first] === undefined) {
            profileList[first] = defaultProfileTorrentList();
        }
    };

    return {
        //need modules
        contentFilter: contentFilter,
        contentUnFilter: contentUnFilter,
        load_in_sandbox: load_in_sandbox,
        ajax: ajax,
        //need view and options
        def_settings: def_settings,
        def_listOptions: def_listOptions,
        //need view
        search: search,
        stop: stop,
        changeUrlHostProxy: changeUrlHostProxy,
        //need options:
        defaultProfileTorrentList: defaultProfileTorrentList,
        webAppSupportList: webAppSupportList,
        loadSettings: loadSettings,
        reloadCustomTorrentList: function(cb) {
            mono.storage.get('customTorrentList', function(storage) {
                var torrentList = storage.customTorrentList || {};
                for (var uid in torrentList) {
                    torrent_lib[uid] = undefined;
                    loadModule(uid, torrentList[uid]);
                }
                cb && cb();
            });
        },
        proxyList: proxyList,
        setProxyList: function(newList) {
            var delList = [], item, i;
            for (item in proxyList) {
                if (newList[item] === undefined) {
                    delList.push(item);
                }
            }
            for (item in newList) {
                proxyList[item] = newList[item];
            }
            for (i = 0, item; item = delList[i]; i++) {
                delete proxyList[item];
            }
        },
        boot: function(cb) {
            if (mono.isChrome) {
                var_cache.historyLimit = 200;
            }

            loadSettings(function (_settings) {
                engine.settings = settings = _settings;

                if (mono.isWebApp) {
                    _settings.allowGetDescription = 0;
                }

                var storageType = (engine.settings.profileListSync === 1)?'sync':'local';

                mono.storage[storageType].get('profileList', function(syncStorage) {
                    mono.storage.get(['customTorrentList', 'profileList',
                        'history', 'lang', 'doNotSendStatistics', 'proxyList', 'titleQualityList'], function(storage) {

                        if (storage.proxyList !== undefined) {
                            if (Array.isArray(storage.proxyList)) {
                                var newList = {};
                                storage.proxyList.forEach(function(item) {
                                    newList[item] = 1;
                                });
                                storage.proxyList = newList;
                            }
                            engine.setProxyList(storage.proxyList);
                        }

                        if (syncStorage.profileList !== undefined) {
                            storage.profileList = syncStorage.profileList;
                        }

                        storage.doNotSendStatistics !== 1 && window.counter && counter();

                        if ( _lang.lang === 'en' ) {
                            def_listOptions.kp_favorites.e = 0;
                            def_listOptions.kp_in_cinema.e = 0;
                            def_listOptions.kp_popular.e = 0;
                            def_listOptions.kp_serials.e = 0;
                        } else {
                            def_listOptions.imdb_in_cinema.e = 0;
                            def_listOptions.imdb_popular.e = 0;
                            def_listOptions.imdb_serials.e = 1;
                            def_listOptions.kp_serials.e = 0;
                        }

                        if (storage.titleQualityList !== undefined) {
                            try {
                                wordRate.setTitleQualityList( JSON.parse(storage.titleQualityList) );
                            } catch (e) {}
                        }
                        wordRate.updateCache();

                        if (typeof storage.history === 'string') {
                            try {
                                storage.history = JSON.parse(storage.history);
                            } catch (e) {
                                storage.history = undefined;
                            }
                        }

                        engine.history = history = storage.history || [];

                        try {
                            engine.profileList = profileList = JSON.parse(storage.profileList || '{}');
                        } catch (e) {
                            engine.profileList = profileList = {};
                        }
                        prepareProfileList();

                        if (storage.customTorrentList) {
                            var torrentList = storage.customTorrentList;
                            for (var uid in torrentList) {
                                loadModule(uid, torrentList[uid]);
                            }
                        }
                        cb && cb();
                    });
                });
            });
        }
    };
}();
$.ajaxSetup({
    jsonp: false
});