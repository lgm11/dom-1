// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"dom.js":[function(require,module,exports) {
window.dom = {}; //创建一个dom
//dom.create = function(tagName){ //接受一个元素，并且创建，例如创建一个div
// return document.createElement(tagName)
//}
//如果我需要创建div里面还有元素呢，例如<div><span></span></div>

/* dom.create = function(string){
    const container = document.createElement('div')//先创建一个div
    container.innerHTML = string//把要写的东西写进div里
    return container.children[0]//返回div里面的东西
} */
//以上代码是放在div里面的，万一有些元素不能放在div里面呢，有没有万能的写法---template

dom.create = function (string) {
  var container = document.createElement("template");
  container.innerHTML = string.trim(); //trim()是为了除去string里的空格以及回车

  return container.content.firstChild;
}; //以下代码为新增弟弟


dom.after = function (node, node2) {
  //接受node2作为node节点的弟弟节点
  node.parentNode.insertBefore(node2, node.nextSibling); //找到节点的爸爸，调用insertBefore把node2插到node下一个节点的前面
}; //以下代码为新增哥哥


dom.before = function (node, node2) {
  node.parentNode.insertBefore(node2, node); //把node插到node的前面
}; //以下代码用于新增儿子


dom.append = function (parent, node) {
  parent.appendChild(node);
}; //以下代码用于新增爸爸


dom.wrap = function (node, parent) {
  //把爸爸加到节点外面就是加爸爸
  dom.before(node, parent); //新增parent围殴node的哥哥，也就是放在node的前面，就是先把排序先排序

  dom.append(parent, node); //然后在改变层级，把node作为parent的儿子。append有个特性就是你把元元素插到别的地方，他会把元素在原来的地方移开
}; //以下代码为删除节点


dom.remove = function (node) {
  node.parentNode.removeChild(node);
  return node; //把它返回出来，说不定以后还会用到这个已经删除的节点呢
}; //以下代码为删除所有儿子（删除后代）


dom.empty = function () {
  //node.innerHTML = ''//这是最快最简单的方法，但是有时候需要返回这个被删除的数组，所以可以尝试以下其他方法
  var _node = node,
      childNodes = _node.childNodes; //等价于const childNodes = node.childNodes

  var array = []; //创建一个空数组来装被删除的儿子，万一以后用到呢

  var x = node.firstChild;

  while (x) {
    array.push(dom.remove(node.firstChild));
    x = node.firstChild; //因为每删除一个，下一个节点就变成了第一个孩子，得重新赋值给x。而且node.child的长度是会变的，所以不能用for循环
  }

  return array;
}; //以下代码为修改和读属性


dom.attr = function (node, name, value) {
  if (arguments.length === 3) {
    node.setAttribute(name, value); //如果接受了3个参数，说明是修改属性
  } else if (arguments.length === 2) {
    node.getAttribute(name); //如果接受两个参数则说明要读取属性
  }
}; //以下代码为修改文本和读取文本


dom.text = function (node, string) {
  if (arguments.length === 2) {
    //重载，看是传几个参数过了，判断是修改还是读取
    if ('innerText' in node) {
      //适配浏览器
      node.innerText = string; //这是ie的写法
    } else {
      node.textContent = string; //这是chrome的写法
    }
  } else {
    if ('innerText' in node) {
      //适配浏览器
      return node.innerText; //这是ie的写法
    } else {
      return node.textContent; //这是chrome的写法
    }
  }
}; //以下代码为读取和修改html内容


dom.html = function (node, string) {
  if (arguments.length === 2) {
    node.innerHTML = string;
  } else if (arguments.length === 1) {
    return node.innerHTML;
  }
}; //以下代码为修改style


dom.style = function (node, name, value) {
  if (arguments.length === 3) {
    //例如dom.style(div,'color','red'),很明显意图是把修改属性
    node.style[name] = value;
  } else if (arguments.length === 2) {
    if (typeof name === 'string') {
      //读取属性名
      return node.style[name];
    } else if (name instanceof Object) {
      //如果是object的实例,添加修改style
      for (var key in name) {
        node.style[key] = name[key];
      }
    }
  }
}; //以下代码为添加class


dom.class.add = function (node, className) {
  node.classList.add(className);
}; //以下代码为删除class


dom.class.remove = function (node, className) {
  node.classList.remove(className);
}; //以下为看class有没有


dom.class.has = function (node, className) {
  return node.classList.contains(className);
}; //以下为添加事件监听


dom.on = function (node, eventName, fn) {
  node.addEventListener(eventName, fn);
}; //以下代码为删除事件监听


dom.off = function (node, eventName, fn) {
  node.removeEventListener(eventName, fn);
}; //查，获取标签或者标签们


dom.find = function (selector) {
  return document.querySelectorAll(selector);
};
/* //如果我想要找特定的一个标签呢，得限定一个查找范围
dom.find = function(selector,scope){//接受一个选择器，范围
    return (scope || document).querySelectorAll(selector)//如果有scope就在scope调用，没有就用document
} */
//获取父元素


dom.parent = function (node) {
  return node.parentNode;
}; //获取子元素


dom.children = function (node) {
  return node.children;
}; //获取兄弟姐妹


dom.siblings = function (node) {
  return Array.from(node.parentNode.children).filter(function (n) {
    return n !== node;
  }); //找出节点爸爸的孩子，得到一个伪数组，然后变成数组，在排除节点自己，得到兄弟姐妹的数组，然后返回就可以了
}; //获取弟弟


dom.next = function (node) {
  var x = node.nextSibling;

  while (x && x.nodeType === 3) {
    //因为有可能下一个节点是文本节点，例如空格回车什么的，所以要判断它的节点类型是不是文本。&&是判断x存不存在的
    x = node.nextSibling;
  }

  return x;
}; //获取哥哥


dom.previous = function (node) {
  var x = node.previousSibling;

  while (x && x.nodeType === 3) {
    x = node.previousSibling;
  }

  return x;
}; //遍历所有节点


dom.each = function (nodeList, fn) {
  for (var i = 0; i < nodeList.length; i++) {
    fn.call(null, nodeList[i]);
  }
}; //排行老几


dom.index = function (node) {
  var list = dom.children(node.parent); //找节点爸爸的儿子

  var i;

  for (i = 0; i < list.length; i++) {
    if (list[i] === node) {
      break;
    }
  }

  return i; //返回的是下标
};
},{}],"../../../AppData/Local/Yarn/Data/global/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57688" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../AppData/Local/Yarn/Data/global/node_modules/parcel/src/builtins/hmr-runtime.js","dom.js"], null)
//# sourceMappingURL=/dom.1d0b6d56.js.map