!function() {
    var Dialog = require('./dialog')
    var $doc = $(document);
    var UI = {};
    $doc.delegate('.btn_file_browse', 'click', function() {
        var $this = $(this);
        var opt = $.extend(true, {
            filters: []
        }, $this.data('dialog'));
        Dialog.open(opt, function(file_path) {
            if (file_path) {
                $this.prev('.txt_file').val(file_path);
                $this.parent().trigger('change', file_path);
            }
        });
    });
    /**
     * 初始化一个file
     */
    function file($container, options){
        options = $.extend(true, {
            width_btn: 40,
            width_minus: 0,
            type: 'geo',
            val: '',
            placeholder: '',
            onchange: null,
            dialogOpt: {}
        }, options);

        var width_btn = options.width_btn;
        var width_minus = options.width_minus;

        if (!$container.data('inited')) {
            var onchange = options.onchange;
            var tmpl_file = '<input type="text" value="'+options.val+'" placeholder="'+options.placeholder+'" class="txt_file" style="width: calc(100% - '+(width_btn + width_minus)+'px);"/>'+
                        '<span data-type="'+options.type+'" data-dialog=\''+JSON.stringify(options.dialogOpt)+'\' class="btn_file_browse" value="浏览" style="width:'+width_btn+'px;"/>';
            $container.html(tmpl_file);
            if (onchange) {
                $container.on('change', onchange);
            }
            $container.data('inited', true);
        }
        var $txt_file = $container.find('.txt_file');

        return {
            val: function() {
                return $txt_file.val();
            },
            setVal: function(val) {
                $txt_file.val(val);
                $container.attr('title', val);
            }
        }
    }

    UI.file = file;
    exports.UI = UI;
}();