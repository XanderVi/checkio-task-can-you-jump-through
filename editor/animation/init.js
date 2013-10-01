//Dont change it
requirejs(['ext_editor_1', 'jquery_190', 'raphael_210'],
    function (ext, $, TableComponent) {

        var cur_slide = {};

        ext.set_start_game(function (this_e) {
        });

        ext.set_process_in(function (this_e, data) {
            cur_slide["in"] = data[0];
        });

        ext.set_process_out(function (this_e, data) {
            cur_slide["out"] = data[0];
        });

        ext.set_process_ext(function (this_e, data) {
            cur_slide.ext = data;
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_process_err(function (this_e, data) {
            cur_slide['error'] = data[0];
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_animate_success_slide(function (this_e, options) {
            var $h = $(this_e.setHtmlSlide('<div class="animation-success"><div></div></div>'));
            this_e.setAnimationHeight(115);
        });




        var goodCell = "0";
        var badCell = "123456789";
        var zx = 10;
        var zy = 10;
        var cellSize = 20;

        var colorCell = "#737370";
        var colorDark = "#294270";
        var colorOrange = "#F0801A";
        var colorLightOrange = "#FABA00";
        var colorBlue = "#006CA9";
        var colorLightBlue = "#8FC7ED";
        var colorMediumBlue = "#0A82BD";
        var colorWhite = "#FFFFFF";

        var attrCell = {"stroke": colorCell, "stroke-width": 1};
        var attrGoodCell = {"fill": colorLightBlue};
        var attrBadCell = {"fill": colorLightOrange};
        var attrGoodText = {"stroke": colorBlue, "fill": colorBlue, "font-family": "Verdana", "font-size": 16};
        var attrBadText = {"stroke": colorOrange, "fill": colorOrange, "font-family": "Verdana", "font-size": 16};

        var attrTextRoute = {"stroke": colorDark, "fill": colorDark};
        var attrRectRoute = {"fill": colorMediumBlue};
        var attrResult = {"stroke": colorDark, "stroke-width": 3};

        var delay = 200;
        var stepDelay = delay * 1.5;

        //FUNCTIONS
        function convertStringToArrayMap(strMap) {
            var res = [];
            for (var i = 0; i < strMap.length; i++) {
                res.push(strMap[i].split(""));
            }
            return res;
        }

        function createStrip(paper, matrix, from, to) {
            var rowQuantity = matrix.length;
            var columnQuantity = matrix[0].length;
            var mapSet = paper.set();
            for (var i = 0; i < rowQuantity; i++) {
                var rowSet = paper.set();
                for (var j = 0; j < columnQuantity; j++) {
                    var cellSet = paper.set();
                    cellSet.push(paper.rect(
                        zx + j * cellSize, zy + i * cellSize,
                        cellSize, cellSize).attr(attrCell));
                    cellSet.push(paper.text(zx + (j + 0.5) * cellSize,
                        zy + (i + 0.5) * cellSize,
                        String(matrix[i][j])));
                    if (goodCell.indexOf(matrix[i][j]) !== -1) {
                        cellSet[0].attr(attrGoodCell);
                        cellSet[1].attr(attrGoodText);
                    }
                    else {
                        cellSet[0].attr(attrBadCell);
                        cellSet[1].attr(attrBadText);
                    }
                    cellSet[0].mark = [i, j];
                    cellSet[1].mark = [i, j];
                    rowSet.push(cellSet);
                }
                mapSet.push(rowSet);
            }
            mapSet[from[0] - 1][from[1] - 1][0].attr(attrResult).toFront();
            mapSet[from[0] - 1][from[1] - 1][1].toFront();
            mapSet[to[0] - 1][to[1] - 1][0].attr(attrResult).toFront();
            mapSet[to[0] - 1][to[1] - 1][1].toFront();
            return mapSet;
        }




        ext.set_animate_slide(function (this_e, data, options) {
            var $content = $(this_e.setHtmlSlide(ext.get_template('animation'))).find('.animation-content');
            if (!data) {
                console.log("data is undefined");
                return false;
            }

            var checkioInput = data.in;

            if (data.error) {
                $content.find('.call').html('Fail: checkio(' + JSON.stringify(checkioInput) + ')');
                $content.find('.output').html(data.error.replace(/\n/g, ","));

                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
                $content.find('.answer').remove();
                $content.find('.explanation').remove();
                this_e.setAnimationHeight($content.height() + 60);
                return false;
            }

            var rightResult = data.ext["answer"];
            var userResult = data.out;
            var result = data.ext["result"];
            var result_addon = data.ext["result_addon"];


            //if you need additional info from tests (if exists)
            var explanation = data.ext["explanation"];

            $content.find('.output').html('&nbsp;Your result:&nbsp;' + JSON.stringify(userResult));

            if (!result) {
                $content.find('.call').html('Fail: checkio(' + JSON.stringify(checkioInput) + ')');
                $content.find('.answer').html('Right result:&nbsp;' + JSON.stringify(rightResult));
                $content.find('.answer').addClass('error');
                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
            }
            else {
                $content.find('.call').html('Pass: checkio(' + JSON.stringify(checkioInput) + ')');
                $content.find('.answer').remove();
            }
            //Dont change the code before it

            var canvas = Raphael($content.find(".explanation")[0],
                zx * 2 + cellSize * checkioInput[0][0].length,
                zy * 2 + cellSize * checkioInput[0].length,
                0, 0);
            var mapSet = createStrip(canvas, checkioInput[0], checkioInput[1], checkioInput[2]);
//            var resultRect = canvas.rect(zx, zy, 0, 0).attr(attrPreResult);

            for (var e = 0; e < explanation.length; e++) {
                setTimeout(function() {
                    var t = explanation[e].slice(0);
                    return function() {
                        mapSet[t[0]-1][t[1]-1][1].animate(attrTextRoute, delay);
                        mapSet[t[0]-1][t[1]-1][0].animate(attrRectRoute, delay);
                    }
                }(), stepDelay * e);
            }


            this_e.setAnimationHeight($content.height() + 60);

        });

        var $tryit;
//
        ext.set_console_process_ret(function (this_e, ret) {
            $tryit.find(".checkio-result-in").html(ret);
        });

        ext.set_generate_animation_panel(function (this_e) {

            $tryit = $(this_e.setHtmlTryIt(ext.get_template('tryit')));
            var tMatrix = [
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0]
            ];

            var tCanvas = Raphael($tryit.find(".tryit-canvas")[0],
                zx * 2 + cellSize * tMatrix[0].length,
                zy * 2 + cellSize * tMatrix.length,
                0, 0);
            var mapSet = createStrip(tCanvas, tMatrix, [1, 1], [6, 6]);


            mapSet.click(function(e) {
                var i = this.mark[0];
                var j = this.mark[1];
                var cell = mapSet[i][j];
                var ch = cell[1].attr().text;
                if (goodCell.indexOf(ch) !== -1) {
                    cell[1].attr("text",
                        badCell[Math.floor(Math.random() * badCell.length)]);
                    cell[0].attr(attrBadCell);
                    cell[1].attr(attrBadText);
                }
                else {
                    cell[1].attr("text",
                        "0");
                    cell[0].attr(attrGoodCell);
                    cell[1].attr(attrGoodText);
                }
            });

            $tryit.find('.bn-check').click(function (e) {
                var data = [];
                for (var i = 0; i < mapSet.length; i++) {
                    var row = [];
                    for (var j=0; j < mapSet[i].length; j++){
                        row.push(parseInt(mapSet[i][j][1].attr().text));

                    }
                    data.push(row);
                }
                this_e.sendToConsoleCheckiO([data, [1, 1], [6, 6]]);
                e.stopPropagation();
                return false;
            });

        });

        var colorOrange4 = "#F0801A";
        var colorOrange3 = "#FA8F00";
        var colorOrange2 = "#FAA600";
        var colorOrange1 = "#FABA00";

        var colorBlue4 = "#294270";
        var colorBlue3 = "#006CA9";
        var colorBlue2 = "#65A1CF";
        var colorBlue1 = "#8FC7ED";

        var colorGrey4 = "#737370";
        var colorGrey3 = "#9D9E9E";
        var colorGrey2 = "#C5C6C6";
        var colorGrey1 = "#EBEDED";

        var colorWhite = "#FFFFFF";
        //Your Additional functions or objects inside scope
        //
        //
        //


    }
);
