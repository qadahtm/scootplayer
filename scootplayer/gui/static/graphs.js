var info = {}

function request_graphing_data(buffer) {
    if($('#' + buffer + '_graphs').is(':hidden')) {
        return;
    }
    $.ajax({
        url: buffer
    }).success(function(data) {
        for (metric in data) {
            var options = {
                series: {
                    color: "red"
                }
            };
            if (metric == 'bandwidth' || metric == 'moving_average_bandwidth') {
                options.yaxis = {
                    tickFormatter: function suffixFormatter(val, axis) {
                        if (val == 0)
                            return 0
                        else
                            return (val / 1000).toFixed(axis.tickDecimals);
                    }
                }
            }
            $.plot($("#" + buffer + '-' + metric), [ data[metric] ], options);
        }
    });

}

function plot_graphs() {
    request_graphing_data('playback');
    request_graphing_data('download');
}

function get_sys_info() {
    $.ajax({
        url: '/sys'
    }).done(function(data) {
        if ($.isEmptyObject(data)) {
            return
        }
        info = data
        alert(JSON.stringify(info))
        draw_info()
    }).always(function() {
        if ($.isEmptyObject(info)) {
            setTimeout(get_sys_info, 3000);
        }
    });
}

function draw_info() {
    var length = 25;
    for (var key in info) {
        if (key == 'startup_delay') {
            $("#" + key.replace(/ /g, '_')).text(info[key].substring(0, length) + ' seconds');
        } 
        else if (key == 'system node' || key == 'manifest') {
            $("#" + key.replace(/ /g, '_')).text(info[key]);
        } else {
            $("#" + key.replace(/ /g, '_')).text(info[key].substring(0, length));
        }       
    }
}

get_sys_info()

var interval = setInterval(plot_graphs, 1000);
