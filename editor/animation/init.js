//Dont change it
requirejs(['ext_editor_1', 'jquery_190', 'raphael_210', 'snap.svg_030'],
    function (ext, $, Raphael, Snap) {

        var cur_slide = {};

        ext.set_start_game(function (this_e) {
        });

        ext.set_process_in(function (this_e, data) {
            cur_slide = {};
            cur_slide["in"] = data[0];
            this_e.addAnimationSlide(cur_slide);
        });

        ext.set_process_out(function (this_e, data) {
            cur_slide["out"] = data[0];
        });

        ext.set_process_ext(function (this_e, data) {
            cur_slide.ext = data;
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

        ext.set_animate_slide(function (this_e, data, options) {
            var $content = $(this_e.setHtmlSlide(ext.get_template('animation'))).find('.animation-content');
            if (!data) {
                console.log("data is undefined");
                return false;
            }

            //YOUR FUNCTION NAME
            var fname = 'can_pass';

            var checkioInput = data.in;
            var checkioInputStr = fname + '(' + JSON.stringify(checkioInput[0]) + ", " + JSON.stringify(checkioInput[1]) + ", " + JSON.stringify(checkioInput[2]) + ')';
            checkioInputStr = checkioInputStr.replace(/\[/g, "(").replace(/]/g, ")");

            var failError = function (dError) {
                $content.find('.call').html(checkioInputStr);
                $content.find('.output').html(dError.replace(/\n/g, ","));

                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
                $content.find('.answer').remove();
                $content.find('.explanation').remove();
                this_e.setAnimationHeight($content.height() + 60);
            };

            if (data.error) {
                failError(data.error);
                return false;
            }

            if (data.ext && data.ext.inspector_fail) {
                failError(data.ext.inspector_result_addon);
                return false;
            }

            $content.find('.call').html(checkioInputStr);
            $content.find('.output').html('Working...');

            var svg = new MatrixSVG($content.find(".explanation svg")[0]);
            svg.draw(checkioInput[0], checkioInput[1], checkioInput[2]);

            if (data.ext) {
                var rightResult = data.ext["answer"];
                var userResult = data.out;
                var result = data.ext["result"];
                var result_addon = data.ext["result_addon"];

                //if you need additional info from tests (if exists)
                var explanation = data.ext["explanation"];
                $content.find('.output').html('&nbsp;Your result:&nbsp;' + userResult[1]);
                if (!result) {
                    $content.find('.answer').html('Right result:&nbsp;' + JSON.stringify(rightResult));
                    $content.find('.answer').addClass('error');
                    $content.find('.output').addClass('error');
                    $content.find('.call').addClass('error');
                }
                else {
                    $content.find('.answer').remove();
                }
            }
            else {
                $content.find('.answer').remove();
            }


            //Your code here about test explanation animation
            //$content.find(".explanation").html("Something text for example");
            //
            //
            //
            //
            //


            this_e.setAnimationHeight($content.height() + 60);

        });

        //This is for Tryit (but not necessary)
//        var $tryit;
//        ext.set_console_process_ret(function (this_e, ret) {
//            $tryit.find(".checkio-result").html("Result<br>" + ret);
//        });
//
//        ext.set_generate_animation_panel(function (this_e) {
//            $tryit = $(this_e.setHtmlTryIt(ext.get_template('tryit'))).find('.tryit-content');
//            $tryit.find('.bn-check').click(function (e) {
//                e.preventDefault();
//                this_e.sendToConsoleCheckiO("something");
//            });
//        });
        function MatrixSVG(dom) {
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

            var p = 10;
            var sizeX;
            var sizeY;
            var paper;
            var cell = 40;

            this.draw = function (matrix, f, s) {
                sizeX = cell * matrix[0].length + 2 * p;
                sizeY = cell * matrix.length + 2 * p;
                paper = Snap(dom);
                paper.attr({"width": sizeX, "height": sizeY});
                var numb = matrix[f[0]][f[1]];
                for (var row = 0; row < matrix.length; row++) {
                    for (var col = 0; col < matrix[0].length; col++) {
                        var r = paper.rect(p + cell * col, p + cell * row, cell, cell).attr(
                            {stroke: colorBlue4, strokeWidth: 2, fill: colorBlue1});
                        if ((row === f[0] && col === f[1]) || (row === s[0] && col === s[1])) {
                            r.attr({fill: colorBlue2});
                        }
                        if (matrix[row][col] !== numb) {
                            r.attr({fill: colorOrange1});
                        }
                        paper.text(p + cell * (col + 0.5), p + cell * (row + 0.5), String(matrix[row][col])).attr(
                            {stroke: colorBlue4, fontFamily: "Roboto", fontWeight: "bold", fontSize: 36, textAnchor: "middle", dominantBaseline: "central"});
                    }
                }
            }
        }

        //Your Additional functions or objects inside scope
        //
        //
        //


    }
);
