var App, closeThemeBox, darkBooth, darkTheme, elp, generateDeftheme, getColor, getFaceList, lightTheme, masterKeys, removeTheme, saveCurrentTheme, saveToLocalStorage, setColor, setTheme, setUndoKey, setUndoLive, themeGenerator, themes, undo, undoTheme, updateUserThemes, userThemes;

App = App || {};

App.liveTheme = {};

generateDeftheme = name => {
  return $.get('./js/templates/deftheme.handlebars').then(t => {
    var compiled, o;
    o = _.extend({
      name: name
    }, App.liveTheme);
    compiled = Handlebars.compile(t);
    return compiled(o);
  });
};

themeGenerator = () => {
  var name;
  name = $('#theme-name').val();
  if (!name) {
    name = prompt("Generate theme", "untitled");
    $('#theme-name').val(name);
  }
  return generateDeftheme(name).then(generated => {
    App.generatedTheme = generated;
    App.generatedThemeName = name + "-theme.el";
    return $.get('./js/templates/deftheme-panel.handlebars', file => {
      var c, compiled, ctx;
      compiled = Handlebars.compile(file);
      ctx = {
        generated: generated,
        name: name
      };
      c = compiled(ctx);
      $('#theme-generated').html(c);
    });
  });
};

saveCurrentTheme = () => {
  var downloadLink, textBlob;
  if (!(App.generatedTheme && App.generatedThemeName)) {
    return;
  }
  textBlob = new Blob([App.generatedTheme], {
    type: 'text/plain'
  });
  downloadLink = document.createElement("a");
  downloadLink.download = App.generatedThemeName;
  if (window.webkitURL !== null) {
    downloadLink.href = window.webkitURL.createObjectURL(textBlob);
  } else {
    downloadLink.href = window.URL.createObjectURL(textBlob);
    downloadLink.onclick = (e) => {
      document.body.removeChild(e.target);
    };
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
  }
  downloadLink.click();
};

App = App || {};

App.codeSpans = {
  kw: '<span class="keyword">',
  cm: '<span class="comment">',
  bi: '<span class="builtin">',
  ty: '<span class="type">',
  va: '<span class="variable">',
  co: '<span class="constant">',
  st: '<span class="string">',
  fn: '<span class="function">',
  rg: '<span class="region">',
  ss: '<span class="secondary-selection">',
  cu: '<span class="cursor">',
  sx: '</span>'
};

App.faceTable = {
  background: {
    id: "rbg",
    title: "Background",
    rx: /background-color +\. +"([^"]*)"/,
    rx24: /default +\(\(t +\(\(t +\(.*:background +"([^"]*)"/,
    el: ['.default', 'background-color']
  },
  foreground: {
    id: "rfg",
    title: "Foreground",
    rx: /foreground-color \. +"([^"]*)"/,
    rx24: /default +\(\(t +\(\(t +\(.*:foreground +"([^"]*)"/,
    el: ['.default', 'color']
  },
  keyword: {
    id: "rkw",
    title: "Keywords",
    rx: /font-lock-keyword-face +\(\(t +\(.*:foreground +"([^"]*)"/,
    el: ['.keyword', 'color']
  },
  comment: {
    id: "rcmt",
    title: "Comments",
    rx: /font-lock-comment-face +\(\(t +\(.*:foreground +"([^"]*)"/,
    el: ['.comment', 'color']
  },
  builtin: {
    id: "rbt",
    title: "Builtins",
    rx: /font-lock-builtin-face +\(\(t +\(.*:foreground +"([^"]*)"/,
    el: ['.builtin', 'color']
  },
  type: {
    id: "rtp",
    title: "Class/Type",
    rx: /font-lock-type-face +\(\(t +\(.*:foreground +"([^"]*)"/,
    el: ['.type', 'color']
  },
  variable: {
    id: "rvar",
    title: "Variables",
    rx: /font-lock-variable-name-face +\(\(t +\(.*:foreground +"([^"]*)"/,
    el: ['.variable', 'color']
  },
  constant: {
    id: "rconst",
    title: "Constants",
    rx: /font-lock-constant-face +\(\(t +\(.*:foreground +"([^"]*)"/,
    el: ['.constant', 'color']
  },
  string: {
    id: "rstr",
    title: "Strings",
    rx: /font-lock-string-face +\(\(t +\(.*:foreground +"([^"]*)"/,
    el: ['.string', 'color']
  },
  "function": {
    id: "rfun",
    title: "Functions",
    rx: /font-lock-function-name-face +\(\(t +\(.*:foreground +"([^"]*)"/,
    el: ['.function', 'color']
  },
  cursor: {
    id: "rcr",
    title: "Cursor",
    rx: /cursor-color +\. +"([^"]*)"/,
    rx24: /cursor +\(\(t +\(\(t +\(.*:background +"([^"]*)"/,
    el: ['.cursor', 'background-color']
  },
  region: {
    id: "reg",
    title: "Region",
    rx: /region +\(\(t +\(.*:background +"([^"]*)"/,
    el: ['.region', 'background-color']
  },
  secondary: {
    id: "rss",
    title: "Secondary Selection",
    rx: /secondary-selection +\(\(t +\(.*:background +"([^"]*)"/,
    el: ['.secondary-selection', 'background-color']
  },
  border: {
    id: "rbd",
    title: "Fringe",
    rx: /border-color +\. +"([^"]*)"/,
    rx24: /fringe +\(\(t +\(\(t +\(.*:background +"([^"]*)"/,
    el: ['.fringe', 'border-color']
  },
  modelinebg: {
    id: "modbg",
    title: "Modeline bg",
    rx: /mode-line +\(\(t +\(.*:background +"([^"]*)"/,
    el: ['.modeline', 'background-color']
  },
  modelinefg: {
    id: "modfg",
    title: "Modeline fg",
    rx: /mode-line +\(\(t +\(.*:foreground +"([^"]*)"/,
    el: ['.modeline', 'color']
  },
  prompt: {
    id: "pmp",
    title: "Minibuffer",
    rx: /minibuffer-prompt +\(\(t +\(.*:foreground +"([^"]*)"/,
    el: ['.prompt', 'color']
  }
};

getFaceList = t => {
  return _.keys(t).map(k => ({
      name: k,
      id: t[k].id,
      title: t[k].title
  }));
};


masterKeys = () => {
  return _.keys(App.faceTable);
};

elp = k => {
  return App.faceTable[k].el[1];
};

getColor = k => {
  return tinycolor($(App.faceTable[k].el[0]).css(elp(k))).toHexString();
};

setColor = (k, col) => {
  $(App.faceTable[k].el[0]).css(elp(k), col);
  $("input[name=" + k + "]").spectrum("set", col);
  $("input[name=" + k + "]").val(col);
  return App.liveTheme[k] = col;
};

setTheme = (themeJson, name) => {
  if (name == null) {
    name = null;
  }

  if (!themeJson) {
    return;
  }

  let o = JSON.parse(themeJson);
  _.each(_.keys(o), k => setColor(k, o[k]));

  if (name) {
    $('#theme-name').val(name);
  }
};

userThemes = {};

updateUserThemes = () => {
  $('#user-themes').empty();
  _.each(_.keys(userThemes), k => { delete userThemes[k]; });
  _.each(_.keys(localStorage), t => {
    if (localStorage.getItem(t)) {
      userThemes[t] = localStorage.getItem(t);
    }
  });
  if (_.keys(userThemes).length > 0) {
    $.get('./js/templates/user-themes.handlebars', file => {
      var template;
      template = Handlebars.compile(file);
      $('#user-themes').html(template({ userThemes: userThemes }));
    });
  }
};

saveToLocalStorage = () => {
  var name;
  name = $('#theme-name').val();
  if (!name) {
    name = prompt("Save theme", "untitled");
  }
  if (!name) {
    return;
  }
  $('#theme-name').val(name);
  if (localStorage.getItem(name)) {
    this.undoTheme = localStorage.getItem(name);
  }
  localStorage.setItem(name, JSON.stringify(App.liveTheme));
  updateUserThemes();
};

removeTheme = name => {
  if (confirm("Remove theme " + name)) {
    localStorage.removeItem(name);
    updateUserThemes();
  }
};

closeThemeBox = () => {
  $('#theme-generated').hide();
  $('#theme-generated .msg').remove();
  $('#generate').removeAttr('disabled');
};

$(() => {
  $('[data-toggle=tooltip]').tooltip({
    placement: 'top'
  });
  $.get('./js/templates/theme-selector.handlebars', file => {
    var template;
    template = Handlebars.compile(file);
    $('#theme-selector').html(template({
      themes: themes
    }));
  });
  $.get('./js/templates/face-list.handlebars', file => {
    var list, template;
    template = Handlebars.compile(file);
    list = getFaceList(App.faceTable);
    $('#face-list').html(template(list));
    $('input.els').spectrum({
      clickoutFiresChange: true,
      showInitial: true,
      showInput: true,
      preferredFormat: "hex",
      chooseText: "Set",
      cancelText: "Reset",
      change: function(color) {
        console.log("Change event from spectrum", color);
      },
      move: function(color) {
        return setColor(this.name, color.toHexString());
      }
    });
  }).then(() => {
    $.get('./js/templates/python.handlebars', file => {
      var template;
      template = Handlebars.compile(file);
      $('#code-sample').html(template(App.codeSpans));
    }).then( () => {
      setTheme(darkTheme);
    });
  });

  if (_.keys(localStorage).length > 0) {
    updateUserThemes();
  }

  $(document).on('click', '#generate', themeGenerator);
});

lightTheme = `{
  "foreground":  "#242121",
  "builtin":     "#738aa1",
  "comment":     "#7d827d",
  "keyword":     "#105163",
  "variable":    "#ac8d4b",
  "constant":    "#456b48",
  "string":      "#4c7685",
  "type":        "#659915",
  "function":    "#375a0d",
  "region":      "#cccccc",
  "secondary":   "#cddbec",
  "border":      "#eef0f0",
  "background":  "#ffffff",
  "modelinefg":  "#ffffff",
  "modelinebg":  "#6f8784",
  "cursor":      "#000000",
  "prompt":      "#7299ff"
}`;

darkTheme = `{
  "foreground": "#fdf4c1",
  "builtin":    "#fe8019",
  "comment":    "#7c6f64",
  "keyword":    "#fb4934",
  "variable":   "#83a598",
  "constant":   "#d3869b",
  "string":     "#b8bb26",
  "type":       "#d3869b",
  "function":   "#b8bb26",
  "region":     "#504945",
  "secondary":  "#3e3834",
  "border":     "#282828",
  "background": "#282828",
  "modelinefg": "#282828",
  "modelinebg": "#7c6f64",
  "cursor":     "#fdf4c1",
  "prompt":     "#b8bb26"
}`;

darkBooth = `{
  "foreground": "#fdf4c1",
  "builtin":    "#fe8019",
  "comment":    "#7c6f64",
  "keyword":    "#dd6f48",
  "variable":   "#83a598",
  "constant":   "#bbaa97",
  "string":     "#429489",
  "type":       "#66999d",
  "function":   "#a99865",
  "region":     "#504945",
  "secondary":  "#3e3834",
  "border":     "#282828",
  "background": "#282828",
  "modelinefg": "#ece09f",
  "modelinebg": "#1e1c1a",
  "cursor":     "#fdf4c1",
  "prompt":     "#61acbb"
}`;

themes = {
  "Dark": darkTheme,
  "Light": lightTheme,
  "DarkBooth": darkBooth
};
