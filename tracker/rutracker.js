var tmp_num = tracker.length;
tracker[tmp_num] = function () {
    var name = 'Рутрекер';
    var filename = 'rutracker';
    var id = null;
    var icon = 'data:image/x-icon;base64,AAABAAEAEBAAAAEAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADg4ODLy8vd3d0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADPz8+KioqgoKDb29vj4+Pf39/q6uoAAAAAAAAAAAAAAAAAAAAAAAAAAADe3t7b29vS0tL29vZOTk5paWlycnJ8fHy8vLwAAAAAAADt7e3c3Nzg4ODc3NympqbDw8OIiIjj4+PtTUD8393///////////+8vLwAAAAAAADU1NSgoKCampqUlJSCgoLz8/NKSUni4uLpJxnqOCrwZ1z2oZvj4+PPz88AAAAAAADr6+vx8fGmpqaurq7P9dn///9paWm9WlPhIBLpIRLpIRL///9XV1fOzMwAAAAAAADg4OD///9D1miK5qEQyz////8+PT1GLCuTFQvNHhHhIBLrtrPPz8+kpKQAAAAAAADh4eH8/PwTzEEQyz8Qyz+M5qL///9sbGxWEQyZJBy9WlO7cmzU1NSioqIAAAAAAADDw8P///8Qyz8Qyz8Qyz8Qyz9r34j///+emZk+PT1lZWTS0tKmpqbg4OAAAAAAAADY2NiP56V74pVh3YAQyz////+mpqZYN9DDtfT///+zoPbf39+xsbEAAAAAAAAAAAAAAAAAAAAAAAAAAAA31F/t7e2YmJhMIedAEulRJ+uhivSYmJi8vLwAAAAAAAAAAAAAAAAAAAAAAADj4+P+/v7IyMh2XdBAEulAEulAEunHuflKSUmYmJgAAAAAAAAAAAAAAAAAAAAAAAAAAADg4ODt7e329vZaM+tAEulAEulRJ+v///9+fn7d3d0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADd3d2plPV4WO/////////////e3t7j4+MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADr6+v///////+/v7/i4uLu7u4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADV1dXp6ekAAAAAAAAAAAAAAAAAAAAAAAD+PwAA/gMAAPgDAAAAAwAAAAMAAAADAAAAAwAAAAMAAAADAAAABwAA8AcAAOAHAADwAwAA/AMAAPwPAAD/PwAA';
    var login_url = 'http://login.rutracker.org/forum/login.php';
    var url = 'http://rutracker.org/forum/tracker.php';
    var root_url = 'http://rutracker.org/forum/';
    var about = 'Крупнейший русскоязычный битторрент трекер. Скачать бесплатно фильмы, музыку, книги, программы..';
    /*
     * a = требует авторизации
     * l = русскоязычный или нет
     * rs= поддержка русского языка
    */
    var flags = {
        a : 1,
        l : 1,
        rs: 1
    }
    var xhr = null;
    var web = function () {
        var calculateCategory = function (f) {
            var groups_arr = [
            /* Сериалы */[864,315,9,104,1535,91,1356,856,188,1408,310,202,935,990,80,119,1530,175,79,172,812,207,805,123,189,271,273,743,184,842,194,1605,85,1144,595,1288,1171,1694,1690,820,819,625,84,242,623,1417,1798,106,166,236,507,504,536,173,918,920,203,1243,1120,140,636,606,776,235,1499,81,266,252,1102,1449,196,372,110,193,1531,237,265,181,1214,497,121,721,1117,1359,387,134,195,2366,2390,2391,2392,2407,2393,2370,2394,2408,2395,2396,2397,2398,2399,2400,2401,2402,2403,2404,2405,2406,911,1691,704,1493,1500,1574,1940,1539,1939,823,1006,972,1299,781,717,1300,1803,1298,825,1606,1458,1463,1459,1938,1461,718,1498,907,877,992,607,594,775,534,1462,904,1460,816,815,325,1457,1301,1692,1540,694,1949,1678,1541,860,1941,1537,2100,2102,2103,1242,2104],
            /* Музыка */[2534,2236,1909,1927,2240,2241,409,1660,1164,1884,445,984,702,983,1990,560,794,556,2307,557,2308,558,793,436,2309,2310,2311,969,405,863,1363,1125,1130,1131,1132,1133,2084,1128,1129,1856,2430,1283,2085,1282,1284,1285,1138,1136,1137,1141,1142,2530,1849,1126,1127,1134,1135,2352,2351,2426,855,865,408,1397,441,1173,1486,1189,1455,446,1172,909,1665,442,1174,1107,2529,1760,1764,1766,1767,1769,1765,1771,1770,1768,1774,1772,1773,2232,2233,1775,1777,416,782,2377,468,1625,691,469,786,785,796,784,783,2331,2431,1215,1220,1221,1334,1216,1223,1224,1225,1226,1217,1227,1228,413,974,463,464,466,465,2018,1396,1395,1351,475,988,880,655,965,919,944,980,946,977,2074,2349,10,2495,424,425,1361,1635,1634,2497,428,1362,429,1219,1452,1331,1330,2499,2503,2504,2502,2501,2505,2500,2507,1121,1122,2510,2509,431,986,2532,2531,2378,2379,2383,2384,2088,2089,2508,2512,1444,239,1163,1885,11,2267,2277,2278,2279,2280,2281,2282,2283,2284,2285,2286,2287,2268,2293,2292,2290,2289,2288,1491,2269,2297,2295,2296,2298,2270,2303,2302,2301,2271,2305,2304,2306,12,1698,1702,1703,1704,1705,1706,1707,2329,2330,1708,1709,1710,1711,1712,1713,1714,1715,1716,1796,1797,1719,1778,1779,1780,1720,798,1724,1725,1730,1731,1726,1727,1815,1816,1728,1729,2230,2231,1732,1736,1737,1738,1739,1740,1741,1742,1743,1744,1745,1746,1747,1748,1749,722,737,738,739,740,951,952,1752,1756,1758,1757,1755,453,1170,1759,1852,1781,1782,1783,2261,1787,1788,2262,1789,1790,2263,1791,1792,1793,1794,2264,1795,13,1821,1844,1822,1894,1895,460,1818,1819,1847,1824,1807,1829,1830,1831,1857,1859,1858,840,1860,1825,1826,1827,1828,1808,797,1805,1832,1833,1834,1835,1893,1836,1837,1838,1839,1840,1841,2229,1809,1861,1862,1947,1946,1945,1944,1810,1869,1873,1871,1867,1864,1865,1866,1811,1868,1875,1877,1878,1880,1881,1842,1648,1812,1886,1887,1912,1913,1890,1754],
            /* Игры */[537,1003,5,635,959,127,2204,53,1008,51,961,962,2187,54,55,2203,52,900,246,278,128,2385,637,642,643,644,2227,2226,2225,645,646,647,649,650,1098,2228,2115,2117,2155,2118,2119,50,2142,2143,2145,2146,139,2478,2479,2480,2481,2482,2533,2483,2484,2485,548,129,908,357,510,887,1116,973,773,774,968,546,700,1926],
            /* Фильмы */[2235,2082,2238,1936,7,187,2090,2221,2091,2092,2093,934,505,212,2459,1235,22,941,1666,124,1543,376,709,1577,511,656,93,905,1576,101,100,103,572,1670,2198,2199,313,2201,312,2339,314,352,549,1213,2109,514,1478],
            /* Мультфтльмы */[4,930,2365,1900,521,2258,208,539,209,484,822,921,922,1247,923,924,1991,925,1165,1245,928,926,1246,1250,927,1248],
            /* Книги */[21,2157,765,2019,31,1427,2195,2223,2447,39,1101,745,1689,2336,2337,1353,1400,2046,1802,2189,2190,2443,2196,2191,2056,2477,1680,1967,2020,1801,1683,1681,2319,2320,2434,2444,2452,2445,2435,2436,2453,2427,2049,1684,2446,1685,2524,2525,995,2022,2471,2375,764,1688,2472,1687,2023,2024,2026,2192,2027,295,2028,2029,1325,2386,2031,2030,2526,2527,2254,2376,2054,770,2476,2494,1528,2032,768,2099,2021,2437,1447,2468,2469,2470,1686,2215,2216,2217,2218,2252,767,2515,2516,2517,2518,2519,2520,1696,2253,2033,1412,1446,753,2037,2224,2194,1410,2034,2433,1961,2432,565,1523,1575,2424,769,2038,2041,2042,2043,2044,2039,2045,2080,2047,2193,1418,1422,1423,1424,1445,1425,1426,1428,1429,1430,1431,1433,1432,2202,862,2461,2462,2463,2464,2473,2465,2048,1238,2055,754,2114,2438,2439,2440,2441,2442,7,2326,1036,400,574,2389,2387,2388,2327,695,399,402,490,499,2324,2325,2342,530,2152,2328,403,1501,1580,525,1279,716,2165,401],
            /* ПО */[1394,1370,2237,1372,1373,1375,1371,1374,1935,1012,1019,2153,1021,1025,1376,1379,1381,899,1473,1195,1013,1028,1029,1030,1031,1032,1033,1034,1066,1035,1038,1039,1536,1051,1040,1041,1636,1042,1014,1060,1061,1062,1067,1086,1068,1063,1087,1192,1088,1193,1071,1073,1052,1053,1054,1055,1056,2077,1057,1018,1058,1016,1079,1080,1081,1082,1083,1084,1085,1089,1090,1065,1064,1092,1204,1027,1199,1091,828,1357,890,830,1290,1962,831,829,633,1009,1963,1954,1010,1674,839,1679,1011,835,1503,1507,1526,1508,1509,1510,1511,1512,1513,1514,1515,1516,1517],
            /* Анимэ */[2535,33,281,1386,1387,1388,282,599,1105,1389,404,1390,1642,1391,893],
            /* Док. и юмор */[670,2107,294,1453,1475,46,2178,671,2177,251,97,851,821,2076,98,56,1469,2123,1280,876,752,1114,2380,1467,672,249,552,500,2112,1327,1468,24,1959,115,939,1481,113,882,1482,393,1569,373,1186,137,1321,532,979,827,1484,1485,114,1332,1495],
            /* Спорт */[2,255,256,1986,1551,626,262,1326,978,1287,1188,1667,1675,257,845,875,263,2073,550,2124,1470,528,486,854,2079,260,2111,1608,1952,1613,1614,1623,1615,1630,2514,1616,2014,1617,1987,2171,1620,1621,1998,751,1697,2004,2001,2002,283,1997,2003,2009,2010,2006,2007,2005,259,2008,126]
            ];
            for (var i=0;i<groups_arr.length;i++)
                if (jQuery.inArray(parseInt(f),groups_arr[i]) > -1) {
                    return i;
                }
            return -1;
        }
        var readCode = function (c) {
            c = view.contentFilter(c);
            //var t = $(c);//.contents();
            var t = view.load_in_sandbox(id,c);
            if (t.find('input[name="login_username"]').length) {
                view.auth(0,id);
                return [];
            } else 
                view.auth(1,id);
            t = t.find('#search-results').children('#tor-tbl').children('tbody').children('tr');
            var l = t.length;
            var arr = [];
            var i = 0;
            for (i = 0;i<l;i++) {
                var td = t.eq(i).children('td');
                if (td.eq(5).children('a').attr('href') == null) continue;
                arr[arr.length] = {
                    /*'type' : td.eq(0).children('img').attr('alt'),
                    'status' : {
                        'code': td.eq(1).children('span').attr('class'), 
                        'text': td.eq(1).children('span').text()
                    },*/
                    'category' : {
                        'title' : td.eq(2).children('div').children('a').text(), 
                        'url': root_url+td.eq(2).children('div').children('a').attr('href'),
                        'id': calculateCategory(td.eq(2).children('div').children('a').attr('href').replace(/.*f=([0-9]*).*$/i,"$1"))
                    },
                    'title' : td.eq(3).children('div').children('a').text(),
                    'url' : root_url+td.eq(3).children('div').children('a').attr('href'),
                    /*'author' : {
                        'name' : td.eq(4).children('a').text(), 
                        'url' : root_url+td.eq(4).children('a').attr('href')
                    } ,*/
                    'size' : td.eq(5).children('u').text(),
                    //'dl' : td.eq(5).children('a').attr('href'),
                    'seeds' : td.eq(6).children('b').text(),
                    'leechs' : td.eq(7).children('b').text(),
                    //'down' : td.eq(8).text(),
                    'time' : td.eq(9).children('u').text()
                }
            }
            return arr;
        }
        var loadPage = function (text) {
            var t = text;
            if (xhr != null)
                xhr.abort();
            xhr = $.ajax({
                type: 'POST',
                url: url,
                cache : false,
                data: {
                    'prev_my' : 0,
                    'prev_new' : 0,
                    'prev_oop' : 0,
                    'f[]' : -1,
                    'o' : 1,
                    's' : 2,
                    'nm' : text,
                    'submit' : ''
                },
                success: function(data) {
                    view.result(id,readCode(data),t);
                },
                error:function (){
                    view.loadingStatus(2,id);
                }
            });
        }
        return {
            getPage : function (a) {
                return loadPage(a);
            }
        }
    }();
    var find = function (text) {
        return web.getPage(text);
    }
    return {
        find : function (a) {
            return find(a);
        },
        setId : function (a) {
            id = a;
        },
        id : id,
        login_url : login_url,
        name : name,
        icon : icon,
        about : about,
        url : root_url,
        filename : filename,
        flags : flags
    }
}();
engine.ModuleLoaded(tmp_num);