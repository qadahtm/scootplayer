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
                            return (val / 1000000).toFixed(axis.tickDecimals) + "mb";
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

var interval = setInterval(plot_graphs, 1000);
