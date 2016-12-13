(function (w, d, $, undefined) {
  'use strict';
  var predict = function () {
    var defaults = {
      sentenceMode: false,
      stopRule: false,
      service: '',
      prediction: false
    },
    elems = Object.create(null),
    opts = Object.create(null),
    active = null,
    result,last,
    loading = false,
    predictions;
  function select(el, start, end) {
    if(el.createTextRange) {
      var sel = el.createTextRange();
      sel.collapse(true);
      sel.moveStart('character', start);
      sel.moveEnd('character', end);
      sel.select();
    } else if(el.setSelectionRange) {
      el.setSelectionRange(start, end);
    } else if(typeof el.selectionStart != 'undefined') {
      el.selectionStart = start;
      el.selectionEnd = end;
    }
    el.focus();
  };
  function handle(t, p, w, v) {
    var l = v.length,
    s = (function(v, l) {
      if(!l || w.lastIndexOf(v, 0) !== 0) {
        for(var i=0,j=p.length;i<j;i++) {
          if(p[i].toLowerCase().lastIndexOf(v, 0) === 0) {
            last = p[i].toLowerCase();
            break;
          }
        }
      }
      return !!last ? last.toLowerCase().replace(v, '') : '';
    }(v, last)),
    i = (opts.sencenceMode?w.join(' '):w);
    t.value = i + s;
    l = t.value.length;
    select(t, l-s.length, l);
    if(typeof opts.prediction === 'function') {
    opts.prediction.call(null, t, t.value, i, s);
    }
  };
  function defer(t, w, v) {
    if(!!loading) return false;
    loading = true;
    $.post(opts.service, 'request=predict&q=' + v + '&_token=' + _token, function (r) {
      loading = false;
      if(r == 'nok') return;
      predictions = r.slice();
      handle(t, r, w, v);
    }, 'json');
  };
  function kd(e) {
    var t = e.target,
    start = t.selectionStart,	    		
    tv = t.value,
    v = tv.substr(0, start);
    if(e.keyCode == 8|| e.keyCode == 46) {
      e.target.value = v;
        return;
      }
      if(!!opts.stopRule && !!v.match(opts.stopRule)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    function ku(e) {
      e.stopPropagation();
      e.preventDefault();
      var t = e.target, tv = t.value, v, l, p;
      if(opts.sencenceMode) {
        var w = tv.split(" "), v = w.slice(-1)[0].toLowerCase();
      } else {
        v = tv;
      }
      l = v.length;
      if(!l) { 
        return true;
      }
      if(!!opts.stopRule && !!v.match(opts.stopRule)) {
        t.value = tv;
        return false;
      }
      if(!last || !!last && last.lastIndexOf(v, 0) !== 0) {
        defer(t, (opts.sentenceMode?w:tv), v);
        last = null;
      } else {
        handle(t, predictions, (opts.sentenceMode?w:tv), v);
      }			
    };
    function activate(e) {
      if(!!elems[e.target.name] && !e.target.isSameNode(active || document.createElement('a'))) {
        active = e.target;
        opts = elems[e.target.name].opts;
      }
    };
    function deactivate(e) {
      active = null;
      opts = Object.create(null);
    };
    return {
      bind: function (element, options) {
        if(!element.attr('name')) throw ('The element must have a name');
        element.on('focus',   activate, true);
        element.on('blur',    deactivate, true);
        element.on('keyup',   ku, true);
        element.on('keydown', kd, true);
        elems[element.attr('name')] = {};
        elems[element.attr('name')].opts = $.extend(defaults, options);
      },
      unbind: function(element) {
        element.off('focus',   activate, true);
        element.off('blur',    deactivate, true);
        element.off('keyup',   ku, true);
        element.off('keydown', kd, true);
      }
    }
  };
  w['predict'] = new predict(); 
}(window, document, $));
