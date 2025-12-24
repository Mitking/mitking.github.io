import { importShared } from "./6jorU3Le.js";

function noop$1() {}
const extend = Object.assign;
const inBrowser$1 = typeof window !== "undefined";
const isObject = (val) => val !== null && typeof val === "object";
const isDef = (val) => val !== void 0 && val !== null;
const isFunction = (val) => typeof val === "function";
const isPromise = (val) =>
  isObject(val) && isFunction(val.then) && isFunction(val.catch);
const isDate = (val) =>
  Object.prototype.toString.call(val) === "[object Date]" &&
  !Number.isNaN(val.getTime());
function isMobile(value) {
  value = value.replace(/[^-|\d]/g, "");
  return (
    /^((\+86)|(86))?(1)\d{10}$/.test(value) || /^0[0-9-]{10,13}$/.test(value)
  );
}
const isNumeric = (val) => typeof val === "number" || /^\d+(\.\d+)?$/.test(val);
const isIOS$1 = () =>
  inBrowser$1
    ? /ios|iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
    : false;
function get(object, path) {
  const keys = path.split(".");
  let result = object;
  keys.forEach((key) => {
    var _a;
    result = isObject(result) ? ((_a = result[key]) != null ? _a : "") : "";
  });
  return result;
}
function pick(obj, keys, ignoreUndefined) {
  return keys.reduce((ret, key) => {
    if (!ignoreUndefined || obj[key] !== void 0) {
      ret[key] = obj[key];
    }
    return ret;
  }, {});
}
const isSameValue = (newValue, oldValue) =>
  JSON.stringify(newValue) === JSON.stringify(oldValue);
const toArray = (item) => (Array.isArray(item) ? item : [item]);
const flat = (arr) => arr.reduce((acc, val) => acc.concat(val), []);

const unknownProp = null;
const numericProp = [Number, String];
const truthProp = {
  type: Boolean,
  default: true,
};
const makeRequiredProp = (type) => ({
  type,
  required: true,
});
const makeArrayProp = () => ({
  type: Array,
  default: () => [],
});
const makeNumberProp = (defaultVal) => ({
  type: Number,
  default: defaultVal,
});
const makeNumericProp = (defaultVal) => ({
  type: numericProp,
  default: defaultVal,
});
const makeStringProp = (defaultVal) => ({
  type: String,
  default: defaultVal,
});

// src/utils.ts
var inBrowser = typeof window !== "undefined";
function raf(fn) {
  return inBrowser ? requestAnimationFrame(fn) : -1;
}
function cancelRaf(id) {
  if (inBrowser) {
    cancelAnimationFrame(id);
  }
}
function doubleRaf(fn) {
  raf(() => raf(fn));
}

// src/useRect/index.ts
const { unref: unref$2 } = await importShared("vue");

var isWindow = (val) => val === window;
var makeDOMRect = (width2, height2) => ({
  top: 0,
  left: 0,
  right: width2,
  bottom: height2,
  width: width2,
  height: height2,
});
var useRect = (elementOrRef) => {
  const element = unref$2(elementOrRef);
  if (isWindow(element)) {
    const width2 = element.innerWidth;
    const height2 = element.innerHeight;
    return makeDOMRect(width2, height2);
  }
  if (element == null ? void 0 : element.getBoundingClientRect) {
    return element.getBoundingClientRect();
  }
  return makeDOMRect(0, 0);
};

// src/useToggle/index.ts
const { ref: ref$c } = await importShared("vue");

function useToggle(defaultValue = false) {
  const state = ref$c(defaultValue);
  const toggle = (value = !state.value) => {
    state.value = value;
  };
  return [state, toggle];
}

// src/useRelation/useParent.ts
const {
  ref: ref2,
  inject: inject$3,
  computed: computed$6,
  onUnmounted: onUnmounted$2,
  getCurrentInstance: getCurrentInstance$6,
} = await importShared("vue");

function useParent(key) {
  const parent = inject$3(key, null);
  if (parent) {
    const instance = getCurrentInstance$6();
    const { link, unlink, internalChildren } = parent;
    link(instance);
    onUnmounted$2(() => unlink(instance));
    const index = computed$6(() => internalChildren.indexOf(instance));
    return {
      parent,
      index,
    };
  }
  return {
    parent: null,
    index: ref2(-1),
  };
}

// src/useRelation/useChildren.ts
const {
  isVNode,
  provide: provide$2,
  reactive: reactive$3,
  getCurrentInstance: getCurrentInstance2,
} = await importShared("vue");

function flattenVNodes(children) {
  const result = [];
  const traverse = (children2) => {
    if (Array.isArray(children2)) {
      children2.forEach((child) => {
        var _a;
        if (isVNode(child)) {
          result.push(child);
          if ((_a = child.component) == null ? void 0 : _a.subTree) {
            result.push(child.component.subTree);
            traverse(child.component.subTree.children);
          }
          if (child.children) {
            traverse(child.children);
          }
        }
      });
    }
  };
  traverse(children);
  return result;
}
var findVNodeIndex = (vnodes, vnode) => {
  const index = vnodes.indexOf(vnode);
  if (index === -1) {
    return vnodes.findIndex(
      (item) =>
        vnode.key !== void 0 &&
        vnode.key !== null &&
        item.type === vnode.type &&
        item.key === vnode.key
    );
  }
  return index;
};
function sortChildren(parent, publicChildren, internalChildren) {
  const vnodes = flattenVNodes(parent.subTree.children);
  internalChildren.sort(
    (a, b) => findVNodeIndex(vnodes, a.vnode) - findVNodeIndex(vnodes, b.vnode)
  );
  const orderedPublicChildren = internalChildren.map((item) => item.proxy);
  publicChildren.sort((a, b) => {
    const indexA = orderedPublicChildren.indexOf(a);
    const indexB = orderedPublicChildren.indexOf(b);
    return indexA - indexB;
  });
}
function useChildren(key) {
  const publicChildren = reactive$3([]);
  const internalChildren = reactive$3([]);
  const parent = getCurrentInstance2();
  const linkChildren = (value) => {
    const link = (child) => {
      if (child.proxy) {
        internalChildren.push(child);
        publicChildren.push(child.proxy);
        sortChildren(parent, publicChildren, internalChildren);
      }
    };
    const unlink = (child) => {
      const index = internalChildren.indexOf(child);
      publicChildren.splice(index, 1);
      internalChildren.splice(index, 1);
    };
    provide$2(
      key,
      Object.assign(
        {
          link,
          unlink,
          children: publicChildren,
          internalChildren,
        },
        value
      )
    );
  };
  return {
    children: publicChildren,
    linkChildren,
  };
}

// src/useCountDown/index.ts
const {
  ref: ref3,
  computed: computed2,
  onActivated: onActivated$2,
  onDeactivated: onDeactivated$3,
  onBeforeUnmount: onBeforeUnmount$2,
} = await importShared("vue");

var SECOND = 1e3;
var MINUTE = 60 * SECOND;
var HOUR = 60 * MINUTE;
var DAY = 24 * HOUR;
function parseTime(time) {
  const days = Math.floor(time / DAY);
  const hours = Math.floor((time % DAY) / HOUR);
  const minutes = Math.floor((time % HOUR) / MINUTE);
  const seconds = Math.floor((time % MINUTE) / SECOND);
  const milliseconds = Math.floor(time % SECOND);
  return {
    total: time,
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
  };
}
function isSameSecond(time1, time2) {
  return Math.floor(time1 / 1e3) === Math.floor(time2 / 1e3);
}
function useCountDown(options) {
  let rafId;
  let endTime;
  let counting;
  let deactivated;
  const remain = ref3(options.time);
  const current = computed2(() => parseTime(remain.value));
  const pause = () => {
    counting = false;
    cancelRaf(rafId);
  };
  const getCurrentRemain = () => Math.max(endTime - Date.now(), 0);
  const setRemain = (value) => {
    var _a, _b;
    remain.value = value;
    (_a = options.onChange) == null ? void 0 : _a.call(options, current.value);
    if (value === 0) {
      pause();
      (_b = options.onFinish) == null ? void 0 : _b.call(options);
    }
  };
  const microTick = () => {
    rafId = raf(() => {
      if (counting) {
        setRemain(getCurrentRemain());
        if (remain.value > 0) {
          microTick();
        }
      }
    });
  };
  const macroTick = () => {
    rafId = raf(() => {
      if (counting) {
        const remainRemain = getCurrentRemain();
        if (!isSameSecond(remainRemain, remain.value) || remainRemain === 0) {
          setRemain(remainRemain);
        }
        if (remain.value > 0) {
          macroTick();
        }
      }
    });
  };
  const tick = () => {
    if (!inBrowser) {
      return;
    }
    if (options.millisecond) {
      microTick();
    } else {
      macroTick();
    }
  };
  const start = () => {
    if (!counting) {
      endTime = Date.now() + remain.value;
      counting = true;
      tick();
    }
  };
  const reset = (totalTime = options.time) => {
    pause();
    remain.value = totalTime;
  };
  onBeforeUnmount$2(pause);
  onActivated$2(() => {
    if (deactivated) {
      counting = true;
      deactivated = false;
      tick();
    }
  });
  onDeactivated$3(() => {
    if (counting) {
      pause();
      deactivated = true;
    }
  });
  return {
    start,
    pause,
    reset,
    current,
  };
}

// src/useClickAway/index.ts
const { unref: unref3 } = await importShared("vue");

// src/useEventListener/index.ts
const {
  watch: watch$a,
  isRef: isRef$1,
  unref: unref2,
  onUnmounted: onUnmounted2,
  onDeactivated: onDeactivated2,
} = await importShared("vue");

// src/onMountedOrActivated/index.ts
const {
  nextTick: nextTick$3,
  onMounted: onMounted$3,
  onActivated: onActivated2,
} = await importShared("vue");

function onMountedOrActivated(hook) {
  let mounted;
  onMounted$3(() => {
    hook();
    nextTick$3(() => {
      mounted = true;
    });
  });
  onActivated2(() => {
    if (mounted) {
      hook();
    }
  });
}

// src/useEventListener/index.ts
function useEventListener(type, listener, options = {}) {
  if (!inBrowser) {
    return;
  }
  const { target = window, passive = false, capture = false } = options;
  let cleaned = false;
  let attached;
  const add = (target2) => {
    if (cleaned) {
      return;
    }
    const element = unref2(target2);
    if (element && !attached) {
      element.addEventListener(type, listener, {
        capture,
        passive,
      });
      attached = true;
    }
  };
  const remove = (target2) => {
    if (cleaned) {
      return;
    }
    const element = unref2(target2);
    if (element && attached) {
      element.removeEventListener(type, listener, capture);
      attached = false;
    }
  };
  onUnmounted2(() => remove(target));
  onDeactivated2(() => remove(target));
  onMountedOrActivated(() => add(target));
  let stopWatch;
  if (isRef$1(target)) {
    stopWatch = watch$a(target, (val, oldVal) => {
      remove(oldVal);
      add(val);
    });
  }
  return () => {
    stopWatch == null ? void 0 : stopWatch();
    remove(target);
    cleaned = true;
  };
}

// src/useClickAway/index.ts
function useClickAway(target, listener, options = {}) {
  if (!inBrowser) {
    return;
  }
  const { eventName = "click" } = options;
  const onClick = (event) => {
    const targets = Array.isArray(target) ? target : [target];
    const isClickAway = targets.every((item) => {
      const element = unref3(item);
      return element && !element.contains(event.target);
    });
    if (isClickAway) {
      listener(event);
    }
  };
  useEventListener(eventName, onClick, { target: document });
}

// src/useWindowSize/index.ts
const { ref: ref4 } = await importShared("vue");

var width;
var height;
function useWindowSize() {
  if (!width) {
    width = ref4(0);
    height = ref4(0);
    if (inBrowser) {
      const update = () => {
        width.value = window.innerWidth;
        height.value = window.innerHeight;
      };
      update();
      window.addEventListener("resize", update, { passive: true });
      window.addEventListener("orientationchange", update, { passive: true });
    }
  }
  return { width, height };
}

// src/useScrollParent/index.ts
const { ref: ref5, onMounted: onMounted2 } = await importShared("vue");

var overflowScrollReg = /scroll|auto|overlay/i;
var defaultRoot = inBrowser ? window : void 0;
function isElement(node) {
  const ELEMENT_NODE_TYPE = 1;
  return (
    node.tagName !== "HTML" &&
    node.tagName !== "BODY" &&
    node.nodeType === ELEMENT_NODE_TYPE
  );
}
function getScrollParent(el, root = defaultRoot) {
  let node = el;
  while (node && node !== root && isElement(node)) {
    const { overflowY } = window.getComputedStyle(node);
    if (overflowScrollReg.test(overflowY)) {
      return node;
    }
    node = node.parentNode;
  }
  return root;
}
function useScrollParent(el, root = defaultRoot) {
  const scrollParent = ref5();
  onMounted2(() => {
    if (el.value) {
      scrollParent.value = getScrollParent(el.value, root);
    }
  });
  return scrollParent;
}

// src/usePageVisibility/index.ts
const { ref: ref6 } = await importShared("vue");

var visibility;
function usePageVisibility() {
  if (!visibility) {
    visibility = ref6("visible");
    if (inBrowser) {
      const update = () => {
        visibility.value = document.hidden ? "hidden" : "visible";
      };
      update();
      window.addEventListener("visibilitychange", update);
    }
  }
  return visibility;
}

// src/useCustomFieldValue/index.ts
const { watch: watch2, inject: inject2 } = await importShared("vue");

var CUSTOM_FIELD_INJECTION_KEY = Symbol("van-field");
function useCustomFieldValue(customValue) {
  const field = inject2(CUSTOM_FIELD_INJECTION_KEY, null);
  if (field && !field.customValue.value) {
    field.customValue.value = customValue;
    watch2(customValue, () => {
      field.resetValidation();
      field.validateWithTrigger("onChange");
    });
  }
}

const { unref: unref$1 } = await importShared("vue");
function getScrollTop(el) {
  const top = "scrollTop" in el ? el.scrollTop : el.pageYOffset;
  return Math.max(top, 0);
}
function setScrollTop(el, value) {
  if ("scrollTop" in el) {
    el.scrollTop = value;
  } else {
    el.scrollTo(el.scrollX, value);
  }
}
function getRootScrollTop() {
  return (
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}
function setRootScrollTop(value) {
  setScrollTop(window, value);
  setScrollTop(document.body, value);
}
function getElementTop(el, scroller) {
  if (el === window) {
    return 0;
  }
  const scrollTop = scroller ? getScrollTop(scroller) : getRootScrollTop();
  return useRect(el).top + scrollTop;
}
const isIOS = isIOS$1();
function resetScroll() {
  if (isIOS) {
    setRootScrollTop(getRootScrollTop());
  }
}
const stopPropagation = (event) => event.stopPropagation();
function preventDefault(event, isStopPropagation) {
  if (typeof event.cancelable !== "boolean" || event.cancelable) {
    event.preventDefault();
  }
  if (isStopPropagation) {
    stopPropagation(event);
  }
}
function isHidden(elementRef) {
  const el = unref$1(elementRef);
  if (!el) {
    return false;
  }
  const style = window.getComputedStyle(el);
  const hidden = style.display === "none";
  const parentHidden = el.offsetParent === null && style.position !== "fixed";
  return hidden || parentHidden;
}
const { width: windowWidth, height: windowHeight } = useWindowSize();
function isContainingBlock(el) {
  const css = window.getComputedStyle(el);
  return (
    css.transform !== "none" ||
    css.perspective !== "none" ||
    ["transform", "perspective", "filter"].some((value) =>
      (css.willChange || "").includes(value)
    )
  );
}
function getContainingBlock(el) {
  let node = el.parentElement;
  while (node) {
    if (
      node &&
      node.tagName !== "HTML" &&
      node.tagName !== "BODY" &&
      isContainingBlock(node)
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}

function addUnit(value) {
  if (isDef(value)) {
    return isNumeric(value) ? `${value}px` : String(value);
  }
  return void 0;
}
function getSizeStyle(originSize) {
  if (isDef(originSize)) {
    if (Array.isArray(originSize)) {
      return {
        width: addUnit(originSize[0]),
        height: addUnit(originSize[1]),
      };
    }
    const size = addUnit(originSize);
    return {
      width: size,
      height: size,
    };
  }
}
function getZIndexStyle(zIndex) {
  const style = {};
  if (zIndex !== void 0) {
    style.zIndex = +zIndex;
  }
  return style;
}
let rootFontSize;
function getRootFontSize() {
  if (!rootFontSize) {
    const doc = document.documentElement;
    const fontSize =
      doc.style.fontSize || window.getComputedStyle(doc).fontSize;
    rootFontSize = parseFloat(fontSize);
  }
  return rootFontSize;
}
function convertRem(value) {
  value = value.replace(/rem/g, "");
  return +value * getRootFontSize();
}
function convertVw(value) {
  value = value.replace(/vw/g, "");
  return (+value * windowWidth.value) / 100;
}
function convertVh(value) {
  value = value.replace(/vh/g, "");
  return (+value * windowHeight.value) / 100;
}
function unitToPx(value) {
  if (typeof value === "number") {
    return value;
  }
  if (inBrowser$1) {
    if (value.includes("rem")) {
      return convertRem(value);
    }
    if (value.includes("vw")) {
      return convertVw(value);
    }
    if (value.includes("vh")) {
      return convertVh(value);
    }
  }
  return parseFloat(value);
}
const camelizeRE = /-(\w)/g;
const camelize = (str) => str.replace(camelizeRE, (_, c) => c.toUpperCase());
const kebabCase = (str) =>
  str
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "");
function padZero(num, targetLength = 2) {
  let str = num + "";
  while (str.length < targetLength) {
    str = "0" + str;
  }
  return str;
}
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
function trimExtraChar(value, char, regExp) {
  const index = value.indexOf(char);
  if (index === -1) {
    return value;
  }
  if (char === "-" && index !== 0) {
    return value.slice(0, index);
  }
  return value.slice(0, index + 1) + value.slice(index).replace(regExp, "");
}
function formatNumber(value, allowDot = true, allowMinus = true) {
  if (allowDot) {
    value = trimExtraChar(value, ".", /\./g);
  } else {
    value = value.split(".")[0];
  }
  if (allowMinus) {
    value = trimExtraChar(value, "-", /-/g);
  } else {
    value = value.replace(/-/, "");
  }
  const regExp = allowDot ? /[^-0-9.]/g : /[^-0-9]/g;
  return value.replace(regExp, "");
}
function addNumber(num1, num2) {
  const cardinal = 10 ** 10;
  return Math.round((num1 + num2) * cardinal) / cardinal;
}

const { hasOwnProperty } = Object.prototype;
function assignKey(to, from, key) {
  const val = from[key];
  if (!isDef(val)) {
    return;
  }
  if (!hasOwnProperty.call(to, key) || !isObject(val)) {
    to[key] = val;
  } else {
    to[key] = deepAssign(Object(to[key]), val);
  }
}
function deepAssign(to, from) {
  Object.keys(from).forEach((key) => {
    assignKey(to, from, key);
  });
  return to;
}

var stdin_default$a = {
  name: "\u59D3\u540D",
  tel: "\u7535\u8BDD",
  save: "\u4FDD\u5B58",
  clear: "\u6E05\u7A7A",
  cancel: "\u53D6\u6D88",
  confirm: "\u786E\u8BA4",
  delete: "\u5220\u9664",
  loading: "\u52A0\u8F7D\u4E2D...",
  noCoupon: "\u6682\u65E0\u4F18\u60E0\u5238",
  nameEmpty: "\u8BF7\u586B\u5199\u59D3\u540D",
  addContact: "\u6DFB\u52A0\u8054\u7CFB\u4EBA",
  telInvalid: "\u8BF7\u586B\u5199\u6B63\u786E\u7684\u7535\u8BDD",
  vanCalendar: {
    end: "\u7ED3\u675F",
    start: "\u5F00\u59CB",
    title: "\u65E5\u671F\u9009\u62E9",
    weekdays: [
      "\u65E5",
      "\u4E00",
      "\u4E8C",
      "\u4E09",
      "\u56DB",
      "\u4E94",
      "\u516D",
    ],
    monthTitle: (year, month) => `${year}\u5E74${month}\u6708`,
    rangePrompt: (maxRange) => `\u6700\u591A\u9009\u62E9 ${maxRange} \u5929`,
  },
  vanCascader: {
    select: "\u8BF7\u9009\u62E9",
  },
  vanPagination: {
    prev: "\u4E0A\u4E00\u9875",
    next: "\u4E0B\u4E00\u9875",
  },
  vanPullRefresh: {
    pulling: "\u4E0B\u62C9\u5373\u53EF\u5237\u65B0...",
    loosing: "\u91CA\u653E\u5373\u53EF\u5237\u65B0...",
  },
  vanSubmitBar: {
    label: "\u5408\u8BA1:",
  },
  vanCoupon: {
    unlimited: "\u65E0\u95E8\u69DB",
    discount: (discount) => `${discount}\u6298`,
    condition: (condition) => `\u6EE1${condition}\u5143\u53EF\u7528`,
  },
  vanCouponCell: {
    title: "\u4F18\u60E0\u5238",
    count: (count) => `${count}\u5F20\u53EF\u7528`,
  },
  vanCouponList: {
    exchange: "\u5151\u6362",
    close: "\u4E0D\u4F7F\u7528",
    enable: "\u53EF\u7528",
    disabled: "\u4E0D\u53EF\u7528",
    placeholder: "\u8F93\u5165\u4F18\u60E0\u7801",
  },
  vanAddressEdit: {
    area: "\u5730\u533A",
    areaEmpty: "\u8BF7\u9009\u62E9\u5730\u533A",
    addressEmpty: "\u8BF7\u586B\u5199\u8BE6\u7EC6\u5730\u5740",
    addressDetail: "\u8BE6\u7EC6\u5730\u5740",
    defaultAddress: "\u8BBE\u4E3A\u9ED8\u8BA4\u6536\u8D27\u5730\u5740",
  },
  vanAddressList: {
    add: "\u65B0\u589E\u5730\u5740",
  },
};

const { ref: ref$b, reactive: reactive$2 } = await importShared("vue");
const lang = ref$b("zh-CN");
const messages = reactive$2({
  "zh-CN": stdin_default$a,
});
const Locale = {
  messages() {
    return messages[lang.value];
  },
  use(newLang, newMessages) {
    lang.value = newLang;
    this.add({ [newLang]: newMessages });
  },
  add(newMessages = {}) {
    deepAssign(messages, newMessages);
  },
};
var stdin_default$9 = Locale;

function createTranslate(name) {
  const prefix = camelize(name) + ".";
  return (path, ...args) => {
    const messages = stdin_default$9.messages();
    const message = get(messages, prefix + path) || get(messages, path);
    return isFunction(message) ? message(...args) : message;
  };
}
function genBem(name, mods) {
  if (!mods) {
    return "";
  }
  if (typeof mods === "string") {
    return ` ${name}--${mods}`;
  }
  if (Array.isArray(mods)) {
    return mods.reduce((ret, item) => ret + genBem(name, item), "");
  }
  return Object.keys(mods).reduce(
    (ret, key) => ret + (mods[key] ? genBem(name, key) : ""),
    ""
  );
}
function createBEM(name) {
  return (el, mods) => {
    if (el && typeof el !== "string") {
      mods = el;
      el = "";
    }
    el = el ? `${name}__${el}` : name;
    return `${el}${genBem(el, mods)}`;
  };
}
function createNamespace(name) {
  const prefixedName = `van-${name}`;
  return [prefixedName, createBEM(prefixedName), createTranslate(prefixedName)];
}

const BORDER = "van-hairline";
const BORDER_TOP = `${BORDER}--top`;
const BORDER_LEFT = `${BORDER}--left`;
const BORDER_RIGHT = `${BORDER}--right`;
const BORDER_BOTTOM = `${BORDER}--bottom`;
const BORDER_SURROUND = `${BORDER}--surround`;
const BORDER_TOP_BOTTOM = `${BORDER}--top-bottom`;
const BORDER_UNSET_TOP_BOTTOM = `${BORDER}-unset--top-bottom`;
const HAPTICS_FEEDBACK = "van-haptics-feedback";
const FORM_KEY = Symbol("van-form");
const LONG_PRESS_START_TIME = 500;
const TAP_OFFSET = 5;

function callInterceptor(interceptor, { args = [], done, canceled, error }) {
  if (interceptor) {
    const returnVal = interceptor.apply(null, args);
    if (isPromise(returnVal)) {
      returnVal
        .then((value) => {
          if (value) {
            done();
          } else if (canceled) {
            canceled();
          }
        })
        .catch(error || noop$1);
    } else if (returnVal) {
      done();
    } else if (canceled) {
      canceled();
    }
  } else {
    done();
  }
}

function withInstall(options) {
  options.install = (app) => {
    const { name } = options;
    if (name) {
      app.component(name, options);
      app.component(camelize(`-${name}`), options);
    }
  };
  return options;
}

const { inject: inject$2, watch: watch$9 } = await importShared("vue");

const POPUP_TOGGLE_KEY = Symbol();
function onPopupReopen(callback) {
  const popupToggleStatus = inject$2(POPUP_TOGGLE_KEY, null);
  if (popupToggleStatus) {
    watch$9(popupToggleStatus, (show) => {
      if (show) {
        callback();
      }
    });
  }
}

const { getCurrentInstance: getCurrentInstance$5 } = await importShared("vue");
function useExpose(apis) {
  const instance = getCurrentInstance$5();
  if (instance) {
    extend(instance.proxy, apis);
  }
}

const {
  computed: computed$5,
  defineComponent: defineComponent$7,
  createVNode: _createVNode$c,
} = await importShared("vue");
const [name$7, bem$7] = createNamespace("badge");
const badgeProps = {
  dot: Boolean,
  max: numericProp,
  tag: makeStringProp("div"),
  color: String,
  offset: Array,
  content: numericProp,
  showZero: truthProp,
  position: makeStringProp("top-right"),
};
var stdin_default$8 = defineComponent$7({
  name: name$7,
  props: badgeProps,
  setup(props, { slots }) {
    const hasContent = () => {
      if (slots.content) {
        return true;
      }
      const { content, showZero } = props;
      return (
        isDef(content) &&
        content !== "" &&
        (showZero || (content !== 0 && content !== "0"))
      );
    };
    const renderContent = () => {
      const { dot, max, content } = props;
      if (!dot && hasContent()) {
        if (slots.content) {
          return slots.content();
        }
        if (isDef(max) && isNumeric(content) && +content > +max) {
          return `${max}+`;
        }
        return content;
      }
    };
    const getOffsetWithMinusString = (val) =>
      val.startsWith("-") ? val.replace("-", "") : `-${val}`;
    const style = computed$5(() => {
      const style2 = {
        background: props.color,
      };
      if (props.offset) {
        const [x, y] = props.offset;
        const { position } = props;
        const [offsetY, offsetX] = position.split("-");
        if (slots.default) {
          if (typeof y === "number") {
            style2[offsetY] = addUnit(offsetY === "top" ? y : -y);
          } else {
            style2[offsetY] =
              offsetY === "top" ? addUnit(y) : getOffsetWithMinusString(y);
          }
          if (typeof x === "number") {
            style2[offsetX] = addUnit(offsetX === "left" ? x : -x);
          } else {
            style2[offsetX] =
              offsetX === "left" ? addUnit(x) : getOffsetWithMinusString(x);
          }
        } else {
          style2.marginTop = addUnit(y);
          style2.marginLeft = addUnit(x);
        }
      }
      return style2;
    });
    const renderBadge = () => {
      if (hasContent() || props.dot) {
        return _createVNode$c(
          "div",
          {
            class: bem$7([
              props.position,
              {
                dot: props.dot,
                fixed: !!slots.default,
              },
            ]),
            style: style.value,
          },
          [renderContent()]
        );
      }
    };
    return () => {
      if (slots.default) {
        const { tag } = props;
        return _createVNode$c(
          tag,
          {
            class: bem$7("wrapper"),
          },
          {
            default: () => [slots.default(), renderBadge()],
          }
        );
      }
      return renderBadge();
    };
  },
});

const Badge = withInstall(stdin_default$8);

let globalZIndex = 2e3;
const useGlobalZIndex = () => ++globalZIndex;
const setGlobalZIndex = (val) => {
  globalZIndex = val;
};

const {
  watch: watch$8,
  provide: provide$1,
  computed: computed$4,
  watchEffect,
  onActivated: onActivated$1,
  onDeactivated: onDeactivated$2,
  onBeforeUnmount: onBeforeUnmount$1,
  defineComponent: defineComponent$6,
  createVNode: _createVNode$b,
} = await importShared("vue");
const [name$6, bem$6] = createNamespace("config-provider");
const CONFIG_PROVIDER_KEY = Symbol(name$6);
const configProviderProps = {
  tag: makeStringProp("div"),
  theme: makeStringProp("light"),
  zIndex: Number,
  themeVars: Object,
  themeVarsDark: Object,
  themeVarsLight: Object,
  themeVarsScope: makeStringProp("local"),
  iconPrefix: String,
};
function insertDash(str) {
  return str.replace(/([a-zA-Z])(\d)/g, "$1-$2");
}
function mapThemeVarsToCSSVars(themeVars) {
  const cssVars = {};
  Object.keys(themeVars).forEach((key) => {
    const formattedKey = insertDash(kebabCase(key));
    cssVars[`--van-${formattedKey}`] = themeVars[key];
  });
  return cssVars;
}
function syncThemeVarsOnRoot(newStyle = {}, oldStyle = {}) {
  Object.keys(newStyle).forEach((key) => {
    if (newStyle[key] !== oldStyle[key]) {
      document.documentElement.style.setProperty(key, newStyle[key]);
    }
  });
  Object.keys(oldStyle).forEach((key) => {
    if (!newStyle[key]) {
      document.documentElement.style.removeProperty(key);
    }
  });
}
var stdin_default$7 = defineComponent$6({
  name: name$6,
  props: configProviderProps,
  setup(props, { slots }) {
    const style = computed$4(() =>
      mapThemeVarsToCSSVars(
        extend(
          {},
          props.themeVars,
          props.theme === "dark" ? props.themeVarsDark : props.themeVarsLight
        )
      )
    );
    if (inBrowser$1) {
      const addTheme = () => {
        document.documentElement.classList.add(`van-theme-${props.theme}`);
      };
      const removeTheme = (theme = props.theme) => {
        document.documentElement.classList.remove(`van-theme-${theme}`);
      };
      watch$8(
        () => props.theme,
        (newVal, oldVal) => {
          if (oldVal) {
            removeTheme(oldVal);
          }
          addTheme();
        },
        {
          immediate: true,
        }
      );
      onActivated$1(addTheme);
      onDeactivated$2(removeTheme);
      onBeforeUnmount$1(removeTheme);
      watch$8(style, (newStyle, oldStyle) => {
        if (props.themeVarsScope === "global") {
          syncThemeVarsOnRoot(newStyle, oldStyle);
        }
      });
      watch$8(
        () => props.themeVarsScope,
        (newScope, oldScope) => {
          if (oldScope === "global") {
            syncThemeVarsOnRoot({}, style.value);
          }
          if (newScope === "global") {
            syncThemeVarsOnRoot(style.value, {});
          }
        }
      );
      if (props.themeVarsScope === "global") {
        syncThemeVarsOnRoot(style.value, {});
      }
    }
    provide$1(CONFIG_PROVIDER_KEY, props);
    watchEffect(() => {
      if (props.zIndex !== void 0) {
        setGlobalZIndex(props.zIndex);
      }
    });
    return () =>
      _createVNode$b(
        props.tag,
        {
          class: bem$6(),
          style: props.themeVarsScope === "local" ? style.value : void 0,
        },
        {
          default: () => {
            var _a;
            return [(_a = slots.default) == null ? void 0 : _a.call(slots)];
          },
        }
      );
  },
});

const {
  inject: inject$1,
  computed: computed$3,
  defineComponent: defineComponent$5,
  createVNode: _createVNode$a,
  mergeProps: _mergeProps$6,
} = await importShared("vue");
const [name$5, bem$5] = createNamespace("icon");
const isImage = (name2) => (name2 == null ? void 0 : name2.includes("/"));
const iconProps = {
  dot: Boolean,
  tag: makeStringProp("i"),
  name: String,
  size: numericProp,
  badge: numericProp,
  color: String,
  badgeProps: Object,
  classPrefix: String,
};
var stdin_default$6 = defineComponent$5({
  name: name$5,
  props: iconProps,
  setup(props, { slots }) {
    const config = inject$1(CONFIG_PROVIDER_KEY, null);
    const classPrefix = computed$3(
      () =>
        props.classPrefix ||
        (config == null ? void 0 : config.iconPrefix) ||
        bem$5()
    );
    return () => {
      const { tag, dot, name: name2, size, badge, color } = props;
      const isImageIcon = isImage(name2);
      return _createVNode$a(
        Badge,
        _mergeProps$6(
          {
            dot: dot,
            tag: tag,
            class: [
              classPrefix.value,
              isImageIcon ? "" : `${classPrefix.value}-${name2}`,
            ],
            style: {
              color,
              fontSize: addUnit(size),
            },
            content: badge,
          },
          props.badgeProps
        ),
        {
          default: () => {
            var _a;
            return [
              (_a = slots.default) == null ? void 0 : _a.call(slots),
              isImageIcon &&
                _createVNode$a(
                  "img",
                  {
                    class: bem$5("image"),
                    src: name2,
                  },
                  null
                ),
            ];
          },
        }
      );
    };
  },
});

const Icon = withInstall(stdin_default$6);
var stdin_default$5 = Icon;

const {
  computed: computed$2,
  defineComponent: defineComponent$4,
  createVNode: _createVNode$9,
} = await importShared("vue");
const [name$4, bem$4] = createNamespace("loading");
const SpinIcon = Array(12)
  .fill(null)
  .map((_, index) =>
    _createVNode$9(
      "i",
      {
        class: bem$4("line", String(index + 1)),
      },
      null
    )
  );
const CircularIcon = _createVNode$9(
  "svg",
  {
    class: bem$4("circular"),
    viewBox: "25 25 50 50",
  },
  [
    _createVNode$9(
      "circle",
      {
        cx: "50",
        cy: "50",
        r: "20",
        fill: "none",
      },
      null
    ),
  ]
);
const loadingProps = {
  size: numericProp,
  type: makeStringProp("circular"),
  color: String,
  vertical: Boolean,
  textSize: numericProp,
  textColor: String,
};
var stdin_default$4 = defineComponent$4({
  name: name$4,
  props: loadingProps,
  setup(props, { slots }) {
    const spinnerStyle = computed$2(() =>
      extend(
        {
          color: props.color,
        },
        getSizeStyle(props.size)
      )
    );
    const renderIcon = () => {
      const DefaultIcon = props.type === "spinner" ? SpinIcon : CircularIcon;
      return _createVNode$9(
        "span",
        {
          class: bem$4("spinner", props.type),
          style: spinnerStyle.value,
        },
        [slots.icon ? slots.icon() : DefaultIcon]
      );
    };
    const renderText = () => {
      var _a;
      if (slots.default) {
        return _createVNode$9(
          "span",
          {
            class: bem$4("text"),
            style: {
              fontSize: addUnit(props.textSize),
              color: (_a = props.textColor) != null ? _a : props.color,
            },
          },
          [slots.default()]
        );
      }
    };
    return () => {
      const { type, vertical } = props;
      return _createVNode$9(
        "div",
        {
          class: bem$4([
            type,
            {
              vertical,
            },
          ]),
          "aria-live": "polite",
          "aria-busy": true,
        },
        [renderIcon(), renderText()]
      );
    };
  },
});

const Loading = withInstall(stdin_default$4);

const popupSharedProps = {
  // whether to show popup
  show: Boolean,
  // z-index
  zIndex: numericProp,
  // whether to show overlay
  overlay: truthProp,
  // transition duration
  duration: numericProp,
  // teleport
  teleport: [String, Object],
  // prevent body scroll
  lockScroll: truthProp,
  // whether to lazy render
  lazyRender: truthProp,
  // callback function before close
  beforeClose: Function,
  // overlay props
  overlayProps: Object,
  // overlay custom style
  overlayStyle: Object,
  // overlay custom class name
  overlayClass: unknownProp,
  // Initial rendering animation
  transitionAppear: Boolean,
  // whether to close popup when overlay is clicked
  closeOnClickOverlay: truthProp,
};
const popupSharedPropKeys = Object.keys(popupSharedProps);

const { ref: ref$a } = await importShared("vue");
function getDirection(x, y) {
  if (x > y) {
    return "horizontal";
  }
  if (y > x) {
    return "vertical";
  }
  return "";
}
function useTouch() {
  const startX = ref$a(0);
  const startY = ref$a(0);
  const deltaX = ref$a(0);
  const deltaY = ref$a(0);
  const offsetX = ref$a(0);
  const offsetY = ref$a(0);
  const direction = ref$a("");
  const isTap = ref$a(true);
  const isVertical = () => direction.value === "vertical";
  const isHorizontal = () => direction.value === "horizontal";
  const reset = () => {
    deltaX.value = 0;
    deltaY.value = 0;
    offsetX.value = 0;
    offsetY.value = 0;
    direction.value = "";
    isTap.value = true;
  };
  const start = (event) => {
    reset();
    startX.value = event.touches[0].clientX;
    startY.value = event.touches[0].clientY;
  };
  const move = (event) => {
    const touch = event.touches[0];
    deltaX.value = (touch.clientX < 0 ? 0 : touch.clientX) - startX.value;
    deltaY.value = touch.clientY - startY.value;
    offsetX.value = Math.abs(deltaX.value);
    offsetY.value = Math.abs(deltaY.value);
    const LOCK_DIRECTION_DISTANCE = 10;
    if (
      !direction.value ||
      (offsetX.value < LOCK_DIRECTION_DISTANCE &&
        offsetY.value < LOCK_DIRECTION_DISTANCE)
    ) {
      direction.value = getDirection(offsetX.value, offsetY.value);
    }
    if (
      isTap.value &&
      (offsetX.value > TAP_OFFSET || offsetY.value > TAP_OFFSET)
    ) {
      isTap.value = false;
    }
  };
  return {
    move,
    start,
    reset,
    startX,
    startY,
    deltaX,
    deltaY,
    offsetX,
    offsetY,
    direction,
    isVertical,
    isHorizontal,
    isTap,
  };
}

const {
  watch: watch$7,
  onBeforeUnmount,
  onDeactivated: onDeactivated$1,
} = await importShared("vue");
let totalLockCount = 0;
const BODY_LOCK_CLASS = "van-overflow-hidden";
function useLockScroll(rootRef, shouldLock) {
  const touch = useTouch();
  const DIRECTION_UP = "01";
  const DIRECTION_DOWN = "10";
  const onTouchMove = (event) => {
    touch.move(event);
    const direction = touch.deltaY.value > 0 ? DIRECTION_DOWN : DIRECTION_UP;
    const el = getScrollParent(event.target, rootRef.value);
    const { scrollHeight, offsetHeight, scrollTop } = el;
    let status = "11";
    if (scrollTop === 0) {
      status = offsetHeight >= scrollHeight ? "00" : "01";
    } else if (scrollTop + offsetHeight >= scrollHeight) {
      status = "10";
    }
    if (
      status !== "11" &&
      touch.isVertical() &&
      !(parseInt(status, 2) & parseInt(direction, 2))
    ) {
      preventDefault(event, true);
    }
  };
  const lock = () => {
    document.addEventListener("touchstart", touch.start);
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    if (!totalLockCount) {
      document.body.classList.add(BODY_LOCK_CLASS);
    }
    totalLockCount++;
  };
  const unlock = () => {
    if (totalLockCount) {
      document.removeEventListener("touchstart", touch.start);
      document.removeEventListener("touchmove", onTouchMove);
      totalLockCount--;
      if (!totalLockCount) {
        document.body.classList.remove(BODY_LOCK_CLASS);
      }
    }
  };
  const init = () => shouldLock() && lock();
  const destroy = () => shouldLock() && unlock();
  onMountedOrActivated(init);
  onDeactivated$1(destroy);
  onBeforeUnmount(destroy);
  watch$7(shouldLock, (value) => {
    value ? lock() : unlock();
  });
}

const { ref: ref$9, watch: watch$6 } = await importShared("vue");

function useLazyRender(show) {
  const inited = ref$9(false);
  watch$6(
    show,
    (value) => {
      if (value) {
        inited.value = value;
      }
    },
    { immediate: true }
  );
  return (render) => () => inited.value ? render() : null;
}

const { getCurrentInstance: getCurrentInstance$4 } = await importShared("vue");

const useScopeId = () => {
  var _a;
  const { scopeId } =
    ((_a = getCurrentInstance$4()) == null ? void 0 : _a.vnode) || {};
  return scopeId ? { [scopeId]: "" } : null;
};

const {
  ref: ref$8,
  defineComponent: defineComponent$3,
  Teleport: Teleport$1,
  Transition: Transition$1,
  vShow: _vShow$3,
  mergeProps: _mergeProps$5,
  createVNode: _createVNode$8,
  withDirectives: _withDirectives$3,
} = await importShared("vue");
const [name$3, bem$3] = createNamespace("overlay");
const overlayProps = {
  show: Boolean,
  zIndex: numericProp,
  duration: numericProp,
  className: unknownProp,
  lockScroll: truthProp,
  lazyRender: truthProp,
  customStyle: Object,
  teleport: [String, Object],
};
var stdin_default$3 = defineComponent$3({
  name: name$3,
  inheritAttrs: false,
  props: overlayProps,
  setup(props, { attrs, slots }) {
    const root = ref$8();
    const lazyRender = useLazyRender(() => props.show || !props.lazyRender);
    const onTouchMove = (event) => {
      if (props.lockScroll) {
        preventDefault(event, true);
      }
    };
    const renderOverlay = lazyRender(() => {
      var _a;
      const style = extend(getZIndexStyle(props.zIndex), props.customStyle);
      if (isDef(props.duration)) {
        style.animationDuration = `${props.duration}s`;
      }
      return _withDirectives$3(
        _createVNode$8(
          "div",
          _mergeProps$5(
            {
              ref: root,
              style: style,
              class: [bem$3(), props.className],
            },
            attrs
          ),
          [(_a = slots.default) == null ? void 0 : _a.call(slots)]
        ),
        [[_vShow$3, props.show]]
      );
    });
    useEventListener("touchmove", onTouchMove, {
      target: root,
    });
    return () => {
      const Content = _createVNode$8(
        Transition$1,
        {
          name: "van-fade",
          appear: true,
        },
        {
          default: renderOverlay,
        }
      );
      if (props.teleport) {
        return _createVNode$8(
          Teleport$1,
          {
            to: props.teleport,
          },
          {
            default: () => [Content],
          }
        );
      }
      return Content;
    };
  },
});

const Overlay = withInstall(stdin_default$3);

const {
  ref: ref$7,
  watch: watch$5,
  provide,
  Teleport,
  nextTick: nextTick$2,
  computed: computed$1,
  onMounted: onMounted$2,
  Transition,
  onActivated,
  onDeactivated,
  defineComponent: defineComponent$2,
  mergeProps: _mergeProps$4,
  createVNode: _createVNode$7,
  vShow: _vShow$2,
  withDirectives: _withDirectives$2,
  Fragment: _Fragment$2,
} = await importShared("vue");
const popupProps = extend({}, popupSharedProps, {
  round: Boolean,
  position: makeStringProp("center"),
  closeIcon: makeStringProp("cross"),
  closeable: Boolean,
  transition: String,
  iconPrefix: String,
  closeOnPopstate: Boolean,
  closeIconPosition: makeStringProp("top-right"),
  destroyOnClose: Boolean,
  safeAreaInsetTop: Boolean,
  safeAreaInsetBottom: Boolean,
});
const [name$2, bem$2] = createNamespace("popup");
var stdin_default$2 = defineComponent$2({
  name: name$2,
  inheritAttrs: false,
  props: popupProps,
  emits: [
    "open",
    "close",
    "opened",
    "closed",
    "keydown",
    "update:show",
    "clickOverlay",
    "clickCloseIcon",
  ],
  setup(props, { emit, attrs, slots }) {
    let opened;
    let shouldReopen;
    const zIndex = ref$7();
    const popupRef = ref$7();
    const lazyRender = useLazyRender(() => props.show || !props.lazyRender);
    const style = computed$1(() => {
      const style2 = {
        zIndex: zIndex.value,
      };
      if (isDef(props.duration)) {
        const key =
          props.position === "center"
            ? "animationDuration"
            : "transitionDuration";
        style2[key] = `${props.duration}s`;
      }
      return style2;
    });
    const open = () => {
      if (!opened) {
        opened = true;
        zIndex.value =
          props.zIndex !== void 0 ? +props.zIndex : useGlobalZIndex();
        emit("open");
      }
    };
    const close = () => {
      if (opened) {
        callInterceptor(props.beforeClose, {
          done() {
            opened = false;
            emit("close");
            emit("update:show", false);
          },
        });
      }
    };
    const onClickOverlay = (event) => {
      emit("clickOverlay", event);
      if (props.closeOnClickOverlay) {
        close();
      }
    };
    const renderOverlay = () => {
      if (props.overlay) {
        const overlayProps = extend(
          {
            show: props.show,
            class: props.overlayClass,
            zIndex: zIndex.value,
            duration: props.duration,
            customStyle: props.overlayStyle,
            role: props.closeOnClickOverlay ? "button" : void 0,
            tabindex: props.closeOnClickOverlay ? 0 : void 0,
          },
          props.overlayProps
        );
        return _createVNode$7(
          Overlay,
          _mergeProps$4(overlayProps, useScopeId(), {
            onClick: onClickOverlay,
          }),
          {
            default: slots["overlay-content"],
          }
        );
      }
    };
    const onClickCloseIcon = (event) => {
      emit("clickCloseIcon", event);
      close();
    };
    const renderCloseIcon = () => {
      if (props.closeable) {
        return _createVNode$7(
          Icon,
          {
            role: "button",
            tabindex: 0,
            name: props.closeIcon,
            class: [
              bem$2("close-icon", props.closeIconPosition),
              HAPTICS_FEEDBACK,
            ],
            classPrefix: props.iconPrefix,
            onClick: onClickCloseIcon,
          },
          null
        );
      }
    };
    let timer;
    const onOpened = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        emit("opened");
      });
    };
    const onClosed = () => emit("closed");
    const onKeydown = (event) => emit("keydown", event);
    const renderPopup = lazyRender(() => {
      var _a;
      const {
        destroyOnClose,
        round,
        position,
        safeAreaInsetTop,
        safeAreaInsetBottom,
        show,
      } = props;
      if (!show && destroyOnClose) {
        return;
      }
      return _withDirectives$2(
        _createVNode$7(
          "div",
          _mergeProps$4(
            {
              ref: popupRef,
              style: style.value,
              role: "dialog",
              tabindex: 0,
              class: [
                bem$2({
                  round,
                  [position]: position,
                }),
                {
                  "van-safe-area-top": safeAreaInsetTop,
                  "van-safe-area-bottom": safeAreaInsetBottom,
                },
              ],
              onKeydown: onKeydown,
            },
            attrs,
            useScopeId()
          ),
          [
            (_a = slots.default) == null ? void 0 : _a.call(slots),
            renderCloseIcon(),
          ]
        ),
        [[_vShow$2, show]]
      );
    });
    const renderTransition = () => {
      const { position, transition, transitionAppear } = props;
      const name2 =
        position === "center" ? "van-fade" : `van-popup-slide-${position}`;
      return _createVNode$7(
        Transition,
        {
          name: transition || name2,
          appear: transitionAppear,
          onAfterEnter: onOpened,
          onAfterLeave: onClosed,
        },
        {
          default: renderPopup,
        }
      );
    };
    watch$5(
      () => props.show,
      (show) => {
        if (show && !opened) {
          open();
          if (attrs.tabindex === 0) {
            nextTick$2(() => {
              var _a;
              (_a = popupRef.value) == null ? void 0 : _a.focus();
            });
          }
        }
        if (!show && opened) {
          opened = false;
          emit("close");
        }
      }
    );
    useExpose({
      popupRef,
    });
    useLockScroll(popupRef, () => props.show && props.lockScroll);
    useEventListener("popstate", () => {
      if (props.closeOnPopstate) {
        close();
        shouldReopen = false;
      }
    });
    onMounted$2(() => {
      if (props.show) {
        open();
      }
    });
    onActivated(() => {
      if (shouldReopen) {
        emit("update:show", true);
        shouldReopen = false;
      }
    });
    onDeactivated(() => {
      if (props.show && props.teleport) {
        close();
        shouldReopen = true;
      }
    });
    provide(POPUP_TOGGLE_KEY, () => props.show);
    return () => {
      if (props.teleport) {
        return _createVNode$7(
          Teleport,
          {
            to: props.teleport,
          },
          {
            default: () => [renderOverlay(), renderTransition()],
          }
        );
      }
      return _createVNode$7(_Fragment$2, null, [
        renderOverlay(),
        renderTransition(),
      ]);
    };
  },
});

const Popup = withInstall(stdin_default$2);

let lockCount = 0;
function lockClick(lock) {
  if (lock) {
    if (!lockCount) {
      document.body.classList.add("van-toast--unclickable");
    }
    lockCount++;
  } else if (lockCount) {
    lockCount--;
    if (!lockCount) {
      document.body.classList.remove("van-toast--unclickable");
    }
  }
}

const {
  watch: watch$4,
  onMounted: onMounted$1,
  onUnmounted: onUnmounted$1,
  defineComponent: defineComponent$1,
  createVNode: _createVNode$6,
  mergeProps: _mergeProps$3,
} = await importShared("vue");
const [name$1, bem$1] = createNamespace("toast");
const popupInheritProps$1 = [
  "show",
  "overlay",
  "teleport",
  "transition",
  "overlayClass",
  "overlayStyle",
  "closeOnClickOverlay",
  "zIndex",
];
const toastProps = {
  icon: String,
  show: Boolean,
  type: makeStringProp("text"),
  overlay: Boolean,
  message: numericProp,
  iconSize: numericProp,
  duration: makeNumberProp(2e3),
  position: makeStringProp("middle"),
  teleport: [String, Object],
  wordBreak: String,
  className: unknownProp,
  iconPrefix: String,
  transition: makeStringProp("van-fade"),
  loadingType: String,
  forbidClick: Boolean,
  overlayClass: unknownProp,
  overlayStyle: Object,
  closeOnClick: Boolean,
  closeOnClickOverlay: Boolean,
  zIndex: numericProp,
};
var stdin_default$1 = defineComponent$1({
  name: name$1,
  props: toastProps,
  emits: ["update:show"],
  setup(props, { emit, slots }) {
    let timer;
    let clickable = false;
    const toggleClickable = () => {
      const newValue = props.show && props.forbidClick;
      if (clickable !== newValue) {
        clickable = newValue;
        lockClick(clickable);
      }
    };
    const updateShow = (show) => emit("update:show", show);
    const onClick = () => {
      if (props.closeOnClick) {
        updateShow(false);
      }
    };
    const clearTimer = () => clearTimeout(timer);
    const renderIcon = () => {
      const { icon, type, iconSize, iconPrefix, loadingType } = props;
      const hasIcon = icon || type === "success" || type === "fail";
      if (hasIcon) {
        return _createVNode$6(
          Icon,
          {
            name: icon || type,
            size: iconSize,
            class: bem$1("icon"),
            classPrefix: iconPrefix,
          },
          null
        );
      }
      if (type === "loading") {
        return _createVNode$6(
          Loading,
          {
            class: bem$1("loading"),
            size: iconSize,
            type: loadingType,
          },
          null
        );
      }
    };
    const renderMessage = () => {
      const { type, message } = props;
      if (slots.message) {
        return _createVNode$6(
          "div",
          {
            class: bem$1("text"),
          },
          [slots.message()]
        );
      }
      if (isDef(message) && message !== "") {
        return type === "html"
          ? _createVNode$6(
              "div",
              {
                key: 0,
                class: bem$1("text"),
                innerHTML: String(message),
              },
              null
            )
          : _createVNode$6(
              "div",
              {
                class: bem$1("text"),
              },
              [message]
            );
      }
    };
    watch$4(() => [props.show, props.forbidClick], toggleClickable);
    watch$4(
      () => [props.show, props.type, props.message, props.duration],
      () => {
        clearTimer();
        if (props.show && props.duration > 0) {
          timer = setTimeout(() => {
            updateShow(false);
          }, props.duration);
        }
      }
    );
    onMounted$1(toggleClickable);
    onUnmounted$1(toggleClickable);
    return () =>
      _createVNode$6(
        Popup,
        _mergeProps$3(
          {
            class: [
              bem$1([
                props.position,
                props.wordBreak === "normal" ? "break-normal" : props.wordBreak,
                {
                  [props.type]: !props.icon,
                },
              ]),
              props.className,
            ],
            lockScroll: false,
            onClick: onClick,
            onClosed: clearTimer,
            "onUpdate:show": updateShow,
          },
          pick(props, popupInheritProps$1)
        ),
        {
          default: () => [renderIcon(), renderMessage()],
        }
      );
  },
});

const { createApp, reactive: reactive$1 } = await importShared("vue");
function usePopupState() {
  const state = reactive$1({
    show: false,
  });
  const toggle = (show) => {
    state.show = show;
  };
  const open = (props) => {
    extend(state, props, { transitionAppear: true });
    toggle(true);
  };
  const close = () => toggle(false);
  useExpose({ open, close, toggle });
  return {
    open,
    close,
    state,
    toggle,
  };
}
function mountComponent(RootComponent) {
  const app = createApp(RootComponent);
  const root = document.createElement("div");
  document.body.appendChild(root);
  return {
    instance: app.mount(root),
    unmount() {
      app.unmount();
      document.body.removeChild(root);
    },
  };
}

const {
  ref: ref$6,
  watch: watch$3,
  getCurrentInstance: getCurrentInstance$3,
  mergeProps: _mergeProps$2,
  createVNode: _createVNode$5,
} = await importShared("vue");
const defaultOptions = {
  icon: "",
  type: "text",
  message: "",
  className: "",
  overlay: false,
  onClose: void 0,
  onOpened: void 0,
  duration: 2e3,
  teleport: "body",
  iconSize: void 0,
  iconPrefix: void 0,
  position: "middle",
  transition: "van-fade",
  forbidClick: false,
  loadingType: void 0,
  overlayClass: "",
  overlayStyle: void 0,
  closeOnClick: false,
  closeOnClickOverlay: false,
};
let queue = [];
let allowMultiple = false;
let currentOptions$1 = extend({}, defaultOptions);
const defaultOptionsMap = /* @__PURE__ */ new Map();
function parseOptions$1(message) {
  if (isObject(message)) {
    return message;
  }
  return {
    message,
  };
}
function createInstance() {
  const { instance } = mountComponent({
    setup() {
      const message = ref$6("");
      const { open, state, close, toggle } = usePopupState();
      const onClosed = () => {};
      const render = () => {
        const attrs = {
          onClosed,
          "onUpdate:show": toggle,
        };
        return _createVNode$5(
          stdin_default$1,
          _mergeProps$2(state, attrs),
          null
        );
      };
      watch$3(message, (val) => {
        state.message = val;
      });
      getCurrentInstance$3().render = render;
      return {
        open,
        close,
        message,
      };
    },
  });
  return instance;
}
function getInstance() {
  if (!queue.length || allowMultiple) {
    const instance = createInstance();
    queue.push(instance);
  }
  return queue[queue.length - 1];
}
function showToast(options = {}) {
  if (!inBrowser$1) {
    return {};
  }
  const toast = getInstance();
  const parsedOptions = parseOptions$1(options);
  toast.open(
    extend(
      {},
      currentOptions$1,
      defaultOptionsMap.get(parsedOptions.type || currentOptions$1.type),
      parsedOptions
    )
  );
  return toast;
}
const createMethod = (type) => (options) =>
  showToast(
    extend(
      {
        type,
      },
      parseOptions$1(options)
    )
  );
const showLoadingToast = createMethod("loading");
const closeToast = (all) => {
  if (queue.length) {
    {
      queue[0].close();
    }
  }
};

const Toast = withInstall(stdin_default$1);

const {
  defineComponent,
  mergeProps: _mergeProps$1,
  createVNode: _createVNode$4,
} = await importShared("vue");
const [name, bem] = createNamespace("notify");
const popupInheritProps = [
  "lockScroll",
  "position",
  "show",
  "teleport",
  "zIndex",
];
const notifyProps = extend({}, popupSharedProps, {
  type: makeStringProp("danger"),
  color: String,
  message: numericProp,
  position: makeStringProp("top"),
  className: unknownProp,
  background: String,
  lockScroll: Boolean,
});
var stdin_default = defineComponent({
  name,
  props: notifyProps,
  emits: ["update:show"],
  setup(props, { emit, slots }) {
    const updateShow = (show) => emit("update:show", show);
    return () =>
      _createVNode$4(
        Popup,
        _mergeProps$1(
          {
            class: [bem([props.type]), props.className],
            style: {
              color: props.color,
              background: props.background,
            },
            overlay: false,
            duration: 0.2,
            "onUpdate:show": updateShow,
          },
          pick(props, popupInheritProps)
        ),
        {
          default: () => [slots.default ? slots.default() : props.message],
        }
      );
  },
});

const { mergeProps: _mergeProps, createVNode: _createVNode$3 } =
  await importShared("vue");
let timer;
let instance;
const parseOptions = (message) =>
  isObject(message)
    ? message
    : {
        message,
      };
function initInstance() {
  ({ instance } = mountComponent({
    setup() {
      const { state, toggle } = usePopupState();
      return () =>
        _createVNode$3(
          stdin_default,
          _mergeProps(state, {
            "onUpdate:show": toggle,
          }),
          null
        );
    },
  }));
}
const getDefaultOptions = () => ({
  type: "danger",
  color: void 0,
  message: "",
  onClose: void 0,
  onClick: void 0,
  onOpened: void 0,
  duration: 3e3,
  position: void 0,
  className: "",
  lockScroll: false,
  background: void 0,
});
let currentOptions = getDefaultOptions();
const closeNotify = () => {
  if (instance) {
    instance.toggle(false);
  }
};
function showNotify(options) {
  if (!inBrowser$1) {
    return;
  }
  if (!instance) {
    initInstance();
  }
  options = extend({}, currentOptions, parseOptions(options));
  instance.open(options);
  clearTimeout(timer);
  if (options.duration > 0) {
    timer = setTimeout(closeNotify, options.duration);
  }
  return instance;
}

const Notify = withInstall(stdin_default);

/*!
 * pinia v3.0.4
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */
const {
  hasInjectionContext,
  inject,
  toRaw,
  watch: watch$2,
  unref,
  markRaw,
  effectScope,
  ref: ref$5,
  isRef,
  isReactive,
  getCurrentScope,
  onScopeDispose,
  getCurrentInstance: getCurrentInstance$2,
  reactive,
  toRef,
  nextTick: nextTick$1,
  computed,
  toRefs,
} = await importShared("vue");
let activePinia;
const setActivePinia = (pinia) => (activePinia = pinia);
const piniaSymbol =
  /* istanbul ignore next */
  Symbol();
function isPlainObject(o) {
  return (
    o &&
    typeof o === "object" &&
    Object.prototype.toString.call(o) === "[object Object]" &&
    typeof o.toJSON !== "function"
  );
}
var MutationType;
(function (MutationType2) {
  MutationType2["direct"] = "direct";
  MutationType2["patchObject"] = "patch object";
  MutationType2["patchFunction"] = "patch function";
})(MutationType || (MutationType = {}));
function createPinia() {
  const scope = effectScope(true);
  const state = scope.run(() => ref$5({}));
  let _p = [];
  let toBeInstalled = [];
  const pinia = markRaw({
    install(app) {
      setActivePinia(pinia);
      pinia._a = app;
      app.provide(piniaSymbol, pinia);
      app.config.globalProperties.$pinia = pinia;
      toBeInstalled.forEach((plugin) => _p.push(plugin));
      toBeInstalled = [];
    },
    use(plugin) {
      if (!this._a) {
        toBeInstalled.push(plugin);
      } else {
        _p.push(plugin);
      }
      return this;
    },
    _p,
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    _e: scope,
    _s: /* @__PURE__ */ new Map(),
    state,
  });
  return pinia;
}
const noop = () => {};
function addSubscription(subscriptions, callback, detached, onCleanup = noop) {
  subscriptions.add(callback);
  const removeSubscription = () => {
    const isDel = subscriptions.delete(callback);
    isDel && onCleanup();
  };
  if (!detached && getCurrentScope()) {
    onScopeDispose(removeSubscription);
  }
  return removeSubscription;
}
function triggerSubscriptions(subscriptions, ...args) {
  subscriptions.forEach((callback) => {
    callback(...args);
  });
}
const fallbackRunWithContext = (fn) => fn();
const ACTION_MARKER = Symbol();
const ACTION_NAME = Symbol();
function mergeReactiveObjects(target, patchToApply) {
  if (target instanceof Map && patchToApply instanceof Map) {
    patchToApply.forEach((value, key) => target.set(key, value));
  } else if (target instanceof Set && patchToApply instanceof Set) {
    patchToApply.forEach(target.add, target);
  }
  for (const key in patchToApply) {
    if (!patchToApply.hasOwnProperty(key)) continue;
    const subPatch = patchToApply[key];
    const targetValue = target[key];
    if (
      isPlainObject(targetValue) &&
      isPlainObject(subPatch) &&
      target.hasOwnProperty(key) &&
      !isRef(subPatch) &&
      !isReactive(subPatch)
    ) {
      target[key] = mergeReactiveObjects(targetValue, subPatch);
    } else {
      target[key] = subPatch;
    }
  }
  return target;
}
const skipHydrateSymbol =
  /* istanbul ignore next */
  Symbol();
function shouldHydrate(obj) {
  return (
    !isPlainObject(obj) ||
    !Object.prototype.hasOwnProperty.call(obj, skipHydrateSymbol)
  );
}
const { assign } = Object;
function isComputed(o) {
  return !!(isRef(o) && o.effect);
}
function createOptionsStore(id, options, pinia, hot) {
  const { state, actions, getters } = options;
  const initialState = pinia.state.value[id];
  let store;
  function setup() {
    if (!initialState && true) {
      pinia.state.value[id] = state ? state() : {};
    }
    const localState = toRefs(pinia.state.value[id]);
    return assign(
      localState,
      actions,
      Object.keys(getters || {}).reduce((computedGetters, name) => {
        computedGetters[name] = markRaw(
          computed(() => {
            setActivePinia(pinia);
            const store2 = pinia._s.get(id);
            return getters[name].call(store2, store2);
          })
        );
        return computedGetters;
      }, {})
    );
  }
  store = createSetupStore(id, setup, options, pinia, hot, true);
  return store;
}
function createSetupStore(
  $id,
  setup,
  options = {},
  pinia,
  hot,
  isOptionsStore
) {
  let scope;
  const optionsForPlugin = assign({ actions: {} }, options);
  const $subscribeOptions = { deep: true };
  let isListening;
  let isSyncListening;
  let subscriptions = /* @__PURE__ */ new Set();
  let actionSubscriptions = /* @__PURE__ */ new Set();
  let debuggerEvents;
  const initialState = pinia.state.value[$id];
  if (!isOptionsStore && !initialState && true) {
    pinia.state.value[$id] = {};
  }
  ref$5({});
  let activeListener;
  function $patch(partialStateOrMutator) {
    let subscriptionMutation;
    isListening = isSyncListening = false;
    if (typeof partialStateOrMutator === "function") {
      partialStateOrMutator(pinia.state.value[$id]);
      subscriptionMutation = {
        type: MutationType.patchFunction,
        storeId: $id,
        events: debuggerEvents,
      };
    } else {
      mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
      subscriptionMutation = {
        type: MutationType.patchObject,
        payload: partialStateOrMutator,
        storeId: $id,
        events: debuggerEvents,
      };
    }
    const myListenerId = (activeListener = Symbol());
    nextTick$1().then(() => {
      if (activeListener === myListenerId) {
        isListening = true;
      }
    });
    isSyncListening = true;
    triggerSubscriptions(
      subscriptions,
      subscriptionMutation,
      pinia.state.value[$id]
    );
  }
  const $reset = isOptionsStore
    ? function $reset2() {
        const { state } = options;
        const newState = state ? state() : {};
        this.$patch(($state) => {
          assign($state, newState);
        });
      }
    : /* istanbul ignore next */
      noop;
  function $dispose() {
    scope.stop();
    subscriptions.clear();
    actionSubscriptions.clear();
    pinia._s.delete($id);
  }
  const action = (fn, name = "") => {
    if (ACTION_MARKER in fn) {
      fn[ACTION_NAME] = name;
      return fn;
    }
    const wrappedAction = function () {
      setActivePinia(pinia);
      const args = Array.from(arguments);
      const afterCallbackSet = /* @__PURE__ */ new Set();
      const onErrorCallbackSet = /* @__PURE__ */ new Set();
      function after(callback) {
        afterCallbackSet.add(callback);
      }
      function onError(callback) {
        onErrorCallbackSet.add(callback);
      }
      triggerSubscriptions(actionSubscriptions, {
        args,
        name: wrappedAction[ACTION_NAME],
        store,
        after,
        onError,
      });
      let ret;
      try {
        ret = fn.apply(this && this.$id === $id ? this : store, args);
      } catch (error) {
        triggerSubscriptions(onErrorCallbackSet, error);
        throw error;
      }
      if (ret instanceof Promise) {
        return ret
          .then((value) => {
            triggerSubscriptions(afterCallbackSet, value);
            return value;
          })
          .catch((error) => {
            triggerSubscriptions(onErrorCallbackSet, error);
            return Promise.reject(error);
          });
      }
      triggerSubscriptions(afterCallbackSet, ret);
      return ret;
    };
    wrappedAction[ACTION_MARKER] = true;
    wrappedAction[ACTION_NAME] = name;
    return wrappedAction;
  };
  const partialStore = {
    _p: pinia,
    // _s: scope,
    $id,
    $onAction: addSubscription.bind(null, actionSubscriptions),
    $patch,
    $reset,
    $subscribe(callback, options2 = {}) {
      const removeSubscription = addSubscription(
        subscriptions,
        callback,
        options2.detached,
        () => stopWatcher()
      );
      const stopWatcher = scope.run(() =>
        watch$2(
          () => pinia.state.value[$id],
          (state) => {
            if (options2.flush === "sync" ? isSyncListening : isListening) {
              callback(
                {
                  storeId: $id,
                  type: MutationType.direct,
                  events: debuggerEvents,
                },
                state
              );
            }
          },
          assign({}, $subscribeOptions, options2)
        )
      );
      return removeSubscription;
    },
    $dispose,
  };
  const store = reactive(partialStore);
  pinia._s.set($id, store);
  const runWithContext =
    (pinia._a && pinia._a.runWithContext) || fallbackRunWithContext;
  const setupStore = runWithContext(() =>
    pinia._e.run(() => (scope = effectScope()).run(() => setup({ action })))
  );
  for (const key in setupStore) {
    const prop = setupStore[key];
    if ((isRef(prop) && !isComputed(prop)) || isReactive(prop)) {
      if (!isOptionsStore) {
        if (initialState && shouldHydrate(prop)) {
          if (isRef(prop)) {
            prop.value = initialState[key];
          } else {
            mergeReactiveObjects(prop, initialState[key]);
          }
        }
        pinia.state.value[$id][key] = prop;
      }
    } else if (typeof prop === "function") {
      const actionValue = action(prop, key);
      setupStore[key] = actionValue;
      optionsForPlugin.actions[key] = prop;
    } else;
  }
  assign(store, setupStore);
  assign(toRaw(store), setupStore);
  Object.defineProperty(store, "$state", {
    get: () => pinia.state.value[$id],
    set: (state) => {
      $patch(($state) => {
        assign($state, state);
      });
    },
  });
  pinia._p.forEach((extender) => {
    {
      assign(
        store,
        scope.run(() =>
          extender({
            store,
            app: pinia._a,
            pinia,
            options: optionsForPlugin,
          })
        )
      );
    }
  });
  if (initialState && isOptionsStore && options.hydrate) {
    options.hydrate(store.$state, initialState);
  }
  isListening = true;
  isSyncListening = true;
  return store;
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function defineStore(id, setup, setupOptions) {
  let options;
  const isSetupStore = typeof setup === "function";
  options = isSetupStore ? setupOptions : setup;
  function useStore(pinia, hot) {
    const hasContext = hasInjectionContext();
    pinia = // in test mode, ignore the argument provided as we can always retrieve a
      // pinia instance with getActivePinia()
      pinia || (hasContext ? inject(piniaSymbol, null) : null);
    if (pinia) setActivePinia(pinia);
    pinia = activePinia;
    if (!pinia._s.has(id)) {
      if (isSetupStore) {
        createSetupStore(id, setup, options, pinia);
      } else {
        createOptionsStore(id, options, pinia);
      }
    }
    const store = pinia._s.get(id);
    return store;
  }
  useStore.$id = id;
  return useStore;
}

const {
  getCurrentInstance: getCurrentInstance$1,
  ref: ref$4,
  nextTick,
} = await importShared("vue");
const gatewayMac = "C0:49:EF:0D:53:0C";
const userInfo = { userId: "", username: "web", password: "web123" };
const deepClone$1 = (obj) => JSON.parse(JSON.stringify(obj));
const useMqttStore = defineStore("mqtt", {
  state: () => ({
    userId: userInfo.userId, // '0',
    username: userInfo.username, // 'web',
    password: userInfo.password, // 'web123',
    brokerUrl: "wss://d5aa11df.ala.cn-hangzhou.emqxsl.cn:8084/mqtt",
    state: 0, // 登录状态 1成功，0失败 -99登录中 -1重连
    longTextState: "", // type_code
    // msgs: msgs,
    tabValue: 0,
    gatewayMac: gatewayMac,
    doorState: 1,
    btnLoading: false,
    btnLoadingTimer: null,
    timeTask: "",
    timeTaskShadow: "",
    timeTaskDomo: [
      {
        name: "每天上午8点开大门(测试)",
        disabled: true,
        condition: {
          time: { h: 8, m: 0 },
          week: [1, 2, 3, 4, 5, 6, 7],
        },
        action: [
          {
            state: 2,
            delaySec: 0,
          },
          {
            state: 1,
            delaySec: 10,
          },
        ],
      },
    ],
  }),
  actions: {
    setTimeTask(v) {
      this.timeTask = deepClone$1(v);
    },
    delByIndex(index) {
      this.timeTask.splice(index, 1);
    },
    setTimeByIndex(index, v) {
      this.timeTask[index].condition.time.h = Number(v[0]);
      this.timeTask[index].condition.time.m = Number(v[1]);
    },
    addNew(v) {
      if (this.timeTask.length >= 5) {
        showNotify({
          message: "任务最多添加5个任务",
        });
        return;
      }
      this.timeTask.push({
        name: "新的任务",
        disabled: true,
        condition: { time: { h: 8, m: 0 }, week: [] },
        action: [],
      });
    },
    setTimeTaskShadow(v) {
      this.timeTaskShadow = deepClone$1(v);
    },
    login(mqttInstance, userId) {
      if (userId) {
        this.userId = userId;
        mqttInstance.handShaking();
      } else {
        showNotify({
          message: "请先登录",
        });
      }
    },
    logout(mqttInstance) {
      this.username = "";
      this.password = "";
      mqttInstance.disconnect();
      localStorage.setItem(
        "userInfo",
        JSON.stringify({ username: "", userId: "" })
      );
    },
    setDoorState(v) {
      // console.log("setDoorState", v);
      // console.log("setDoorState", this);
      this.doorState = 1;
      nextTick(() => {
        this.doorState = v;
      });
    },
    setBtnLoading(v) {
      this.btnLoading = v;
      if (this.btnLoadingTimer) {
        clearTimeout(this.btnLoadingTimer);
      }
      if (v) {
        this.btnLoadingTimer = setTimeout(() => {
          showNotify({ message: `设备响应超时` });
          this.btnLoading = false;
        }, 10000);
      }
    },
  },
});

const deepClone = (obj) => JSON.parse(JSON.stringify(obj));
const run_version = 1;
const mockUsers = [
  { userId: "0", username: "superadmin", password: "123321" },
  { userId: "11", username: "nomal", password: "123456" },
];
const useUserStore = defineStore("user", {
  state: () => ({
    run_version: run_version,
    version: "V0.0.2",
    userInfo: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : { userId: "", username: "" },
  }),
  actions: {
    userLogin(user) {
      const foundUser = mockUsers.find(
        (u) => u.username === user.username && u.password === user.password
      );
      if (foundUser) {
        this.userInfo = deepClone(foundUser);
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            userId: foundUser.userId,
            username: foundUser.username,
          })
        );
        showNotify({
          type: "success",
          message: "登录成功",
        });
        return true;
      } else {
        showNotify({
          message: "用户名或密码错误",
        });
        return false;
      }
    },
  },
});

const uplogJson = [
  {
    date: "2025-12-*",
    version: "V0.0.3",
    type: "Alpha",
    list: [
      {
        title: "硬件系统",
        content: ["定时任务(rtc)", "计划任务设置(存储于本地fs文件)"],
      },
      {
        title: "移动端",
        content: ["登陆弹窗", "操作记录"],
      },
      {
        title: "服务端",
        content: ["登陆接口", "指令校验接口", "指令历史日志"],
      },
    ],
  },
  {
    date: "2025-12-17",
    version: "V0.0.2",
    type: "Beta",
    list: [
      {
        title: "硬件系统",
        content: ["看门狗任务", "任务调度器添加"],
      },
      {
        title: "移动端",
        content: ["添加开关门SVG动画"],
      },
    ],
  },
  {
    date: "2025-12-15",
    version: "V0.0.1",
    type: "Release",
    list: [
      {
        title: "硬件系统",
        content: ["新建基础版"],
      },
      {
        title: "移动端",
        content: ["新建基础版"],
      },
      {
        title: "服务端",
        content: ["mqtt基础版"],
      },
    ],
  },
];

const {
  createElementVNode: _createElementVNode$2,
  openBlock: _openBlock$3,
  createElementBlock: _createElementBlock$3,
} = await importShared("vue");

const _hoisted_1$3 = {
  width: "800",
  height: "400",
  viewBox: "0 0 1024 512",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "#1989FA",
  "data-spm-anchor-id": "a313x.search_index.0.i3.5fa23a81LNWuQc",
  "p-id": "21312",
  version: "1.1",
  class: "icon",
  t: "1765414531440",
};
const _hoisted_2$2 = ["from", "to"];

const { ref: ref$3, watch: watch$1 } = await importShared("vue");

const _sfc_main$3 = {
  __name: "doorIcon",
  setup(__props) {
    const mqttStore = useMqttStore();
    // defineProps({
    //     animationName: String,
    // })
    const animationName = ref$3("stop");
    const actionTimer = ref$3(null);
    watch$1(
      () => mqttStore.doorState,
      (v) => {
        animationName.value =
          (v === 1 && "stop") || (v === 3 && "close") || (v === 2 && "open");
        if (actionTimer.value) {
          clearTimeout(actionTimer.value);
          actionTimer.value = null;
        }
        actionTimer.value = setTimeout(() => {
          animationName.value = "stop";
          actionTimer.value = null;
        }, 5000);
      }
    );

    return (_ctx, _cache) => {
      return (
        _openBlock$3(),
        _createElementBlock$3("svg", _hoisted_1$3, [
          _createElementVNode$2("g", null, [
            _cache[0] ||
              (_cache[0] = _createElementVNode$2(
                "path",
                {
                  stroke: "null",
                  id: "svg_1",
                  class: "selected",
                  "data-spm-anchor-id":
                    "a313x.search_index.0.i2.5fa23a81LNWuQc",
                  "p-id": "21313",
                  d: "m905,100.12498l-725.33333,0l0,347.47918l213.33333,0l0,13.36458c0,8.01875 8.53333,13.36458 21.33333,13.36458s21.33334,-5.34583 21.33334,-13.36458l0,-13.36458l213.33333,0l0,13.36458c0,8.01875 8.53333,13.36458 21.33333,13.36458s21.33334,-5.34583 21.33334,-13.36458l0,-13.36458l213.33333,0l0,-347.47918zm-640,320.75001l-42.66667,0l0,-294.02084l42.66667,0l0,294.02084zm85.33333,0l-42.66666,0l0,-294.02084l42.66666,0l0,294.02084zm85.33334,0l-42.66667,0l0,-294.02084l42.66667,0l0,294.02084zm85.33333,0l-42.66667,0l0,-294.02084l42.66667,0l0,294.02084zm85.33333,0l-42.66666,0l0,-294.02084l42.66666,0l0,294.02084zm85.33334,0l-42.66667,0l0,-294.02084l42.66667,0l0,294.02084zm85.33333,0l-42.66667,0l0,-294.02084l42.66667,0l0,294.02084zm85.33333,0l-42.66666,0l0,-294.02084l42.66666,0l0,294.02084z",
                },
                null,
                -1
              )),
            _createElementVNode$2(
              "animateTransform",
              {
                attributeName: "transform",
                type: "translate",
                from: `${
                  animationName.value === "open"
                    ? 0
                    : animationName.value === "stop"
                    ? 240
                    : 600
                } 0`,
                to: `${
                  animationName.value === "close"
                    ? 0
                    : animationName.value === "stop"
                    ? 240
                    : 600
                } 0`,
                repeatCount: "indefinite",
                dur: "5s",
              },
              null,
              8,
              _hoisted_2$2
            ),
          ]),
          _cache[1] ||
            (_cache[1] = _createElementVNode$2(
              "g",
              null,
              [
                _createElementVNode$2("rect", {
                  stroke: "null",
                  id: "svg_2",
                  height: "413",
                  width: "101",
                  y: "69",
                  x: "16",
                }),
                _createElementVNode$2("rect", {
                  stroke: "null",
                  id: "svg_5",
                  height: "413",
                  width: "120",
                  y: "69",
                  x: "903",
                }),
              ],
              -1
            )),
        ])
      );
    };
  },
};

const {
  resolveComponent: _resolveComponent$1,
  unref: _unref$1,
  createVNode: _createVNode$2,
  withCtx: _withCtx$1,
  openBlock: _openBlock$2,
  createBlock: _createBlock$1,
  createCommentVNode: _createCommentVNode$1,
  renderList: _renderList$1,
  Fragment: _Fragment$1,
  createElementBlock: _createElementBlock$2,
  toDisplayString: _toDisplayString$1,
  createTextVNode: _createTextVNode$1,
  createElementVNode: _createElementVNode$1,
  vShow: _vShow$1,
  withDirectives: _withDirectives$1,
  vModelSelect: _vModelSelect,
} = await importShared("vue");

const _hoisted_1$2 = { class: "px-2" };
const _hoisted_2$1 = { key: 1 };
const _hoisted_3$1 = { key: 2 };
const _hoisted_4$1 = { key: 3 };
const _hoisted_5$1 = ["onUpdate:modelValue", "disabled"];
const _hoisted_6$1 = ["value"];
const { ref: ref$2 } = await importShared("vue");

const _sfc_main$2 = {
  __name: "timeTask",
  props: {
    editMode: Boolean,
  },
  setup(__props) {
    useUserStore();
    const mqttStore = useMqttStore();
    const props = __props;
    const showEditTime = ref$2(false);
    const checkboxGroup = ref$2();
    const currTime = ref$2(["00", "00"]);
    const currIndex = ref$2(0);
    const checkAll = () => {
      if (
        checkboxGroup.value &&
        checkboxGroup.value[0] &&
        checkboxGroup.value[0].toggleAll
      ) {
        checkboxGroup.value[0].toggleAll(true);
      }
    };
    ref$2(0);

    return (_ctx, _cache) => {
      const _component_van_time_picker = _resolveComponent$1("van-time-picker");
      const _component_van_popup = _resolveComponent$1("van-popup");
      const _component_van_empty = _resolveComponent$1("van-empty");
      const _component_van_field = _resolveComponent$1("van-field");
      const _component_van_checkbox = _resolveComponent$1("van-checkbox");
      const _component_van_checkbox_group =
        _resolveComponent$1("van-checkbox-group");
      const _component_van_button = _resolveComponent$1("van-button");
      const _component_van_switch = _resolveComponent$1("van-switch");

      return (
        _openBlock$2(),
        _createElementBlock$2("div", _hoisted_1$2, [
          _createVNode$2(
            _component_van_popup,
            {
              show: showEditTime.value,
              "onUpdate:show":
                _cache[3] ||
                (_cache[3] = ($event) => (showEditTime.value = $event)),
              style: { padding: "20px", height: "50%" },
              position: "bottom",
            },
            {
              default: _withCtx$1(() => [
                _createVNode$2(
                  _component_van_time_picker,
                  {
                    modelValue: currTime.value,
                    "onUpdate:modelValue":
                      _cache[0] ||
                      (_cache[0] = ($event) => (currTime.value = $event)),
                    type: "time",
                    onCancel:
                      _cache[1] ||
                      (_cache[1] = ($event) => (showEditTime.value = false)),
                    onConfirm:
                      _cache[2] ||
                      (_cache[2] = (v) => {
                        _unref$1(mqttStore).setTimeByIndex(
                          currIndex.value,
                          v.selectedValues
                        );
                        showEditTime.value = false;
                      }),
                    "columns-type": ["hour", "minute"],
                  },
                  null,
                  8,
                  ["modelValue"]
                ),
              ]),
              _: 1,
            },
            8,
            ["show"]
          ),
          !_unref$1(mqttStore).timeTask.length
            ? (_openBlock$2(),
              _createBlock$1(_component_van_empty, {
                key: 0,
                description: "暂无任务",
              }))
            : _createCommentVNode$1("", true),
          (_openBlock$2(true),
          _createElementBlock$2(
            _Fragment$1,
            null,
            _renderList$1(_unref$1(mqttStore).timeTask, (item, index) => {
              return (
                _openBlock$2(),
                _createElementBlock$2("div", { key: index }, [
                  props.editMode
                    ? (_openBlock$2(),
                      _createBlock$1(
                        _component_van_field,
                        {
                          key: 0,
                          modelValue: item.name,
                          "onUpdate:modelValue": ($event) =>
                            (item.name = $event),
                          label: "任务名称",
                          placeholder: "任务名称",
                        },
                        null,
                        8,
                        ["modelValue", "onUpdate:modelValue"]
                      ))
                    : (_openBlock$2(),
                      _createElementBlock$2(
                        "div",
                        _hoisted_2$1,
                        _toDisplayString$1(item.name || `任务${index + 1}`),
                        1
                      )),
                  props.editMode
                    ? (_openBlock$2(),
                      _createElementBlock$2("div", _hoisted_3$1, [
                        _createVNode$2(
                          _component_van_checkbox_group,
                          {
                            modelValue: item.condition.week,
                            "onUpdate:modelValue": ($event) =>
                              (item.condition.week = $event),
                            ref_for: true,
                            ref_key: "checkboxGroup",
                            ref: checkboxGroup,
                            direction: "horizontal",
                          },
                          {
                            default: _withCtx$1(() => [
                              (_openBlock$2(),
                              _createElementBlock$2(
                                _Fragment$1,
                                null,
                                _renderList$1([1, 2, 3, 4, 5, 6, 7], (week) => {
                                  return _createVNode$2(
                                    _component_van_checkbox,
                                    {
                                      key: week,
                                      name: week,
                                    },
                                    {
                                      default: _withCtx$1(() => [
                                        _createTextVNode$1(
                                          "周" + _toDisplayString$1(week),
                                          1
                                        ),
                                      ]),
                                      _: 2,
                                    },
                                    1032,
                                    ["name"]
                                  );
                                }),
                                64
                              )),
                            ]),
                            _: 1,
                          },
                          8,
                          ["modelValue", "onUpdate:modelValue"]
                        ),
                        _createVNode$2(
                          _component_van_button,
                          {
                            type: "primary",
                            onClick: checkAll,
                          },
                          {
                            default: _withCtx$1(() => [
                              ...(_cache[4] ||
                                (_cache[4] = [_createTextVNode$1("每天", -1)])),
                            ]),
                            _: 1,
                          }
                        ),
                      ]))
                    : (_openBlock$2(),
                      _createElementBlock$2(
                        "div",
                        _hoisted_4$1,
                        "每周" + _toDisplayString$1(item.condition.week),
                        1
                      )),
                  _createElementVNode$1("div", null, [
                    _createTextVNode$1(
                      "时间: " +
                        _toDisplayString$1(item.condition.time.h) +
                        ":" +
                        _toDisplayString$1(
                          item.condition.time.m < 10
                            ? "0" + item.condition.time.m
                            : item.condition.time.m
                        ) +
                        " ",
                      1
                    ),
                    props.editMode
                      ? (_openBlock$2(),
                        _createBlock$1(
                          _component_van_button,
                          {
                            key: 0,
                            type: "primary",
                            onClick: ($event) => {
                              currTime.value = [
                                item.condition.time.h
                                  .toString()
                                  .padStart(2, "0"),
                                item.condition.time.m
                                  .toString()
                                  .padStart(2, "0"),
                              ];
                              currIndex.value = index;
                              showEditTime.value = true;
                            },
                          },
                          {
                            default: _withCtx$1(() => [
                              ...(_cache[5] ||
                                (_cache[5] = [
                                  _createTextVNode$1(" 编辑", -1),
                                ])),
                            ]),
                            _: 1,
                          },
                          8,
                          ["onClick"]
                        ))
                      : _createCommentVNode$1("", true),
                  ]),
                  _createElementVNode$1("div", null, [
                    _createTextVNode$1(
                      _toDisplayString$1(item.disabled ? "禁用" : "启用"),
                      1
                    ),
                    props.editMode
                      ? (_openBlock$2(),
                        _createBlock$1(
                          _component_van_switch,
                          {
                            key: 0,
                            modelValue: item.disabled,
                            "onUpdate:modelValue": ($event) =>
                              (item.disabled = $event),
                          },
                          null,
                          8,
                          ["modelValue", "onUpdate:modelValue"]
                        ))
                      : _createCommentVNode$1("", true),
                  ]),
                  (_openBlock$2(true),
                  _createElementBlock$2(
                    _Fragment$1,
                    null,
                    _renderList$1(item.action, (act) => {
                      return (
                        _openBlock$2(),
                        _createElementBlock$2("div", null, [
                          _cache[6] ||
                            (_cache[6] = _createTextVNode$1("大门 ", -1)),
                          _withDirectives$1(
                            _createElementVNode$1(
                              "span",
                              null,
                              _toDisplayString$1(act.delaySec) + "秒后,",
                              513
                            ),
                            [[_vShow$1, act.delaySec]]
                          ),
                          _cache[7] ||
                            (_cache[7] = _createTextVNode$1(" 执行 ", -1)),
                          _withDirectives$1(
                            _createElementVNode$1(
                              "select",
                              {
                                "onUpdate:modelValue": ($event) =>
                                  (act.state = $event),
                                disabled: !props.editMode,
                              },
                              [
                                (_openBlock$2(),
                                _createElementBlock$2(
                                  _Fragment$1,
                                  null,
                                  _renderList$1(
                                    [
                                      { text: "开", value: 2 },
                                      { text: "停", value: 1 },
                                      { text: "关", value: 3 },
                                    ],
                                    (opt) => {
                                      return _createElementVNode$1(
                                        "option",
                                        {
                                          key: opt.value,
                                          value: opt.value,
                                        },
                                        _toDisplayString$1(opt.text),
                                        9,
                                        _hoisted_6$1
                                      );
                                    }
                                  ),
                                  64
                                )),
                              ],
                              8,
                              _hoisted_5$1
                            ),
                            [[_vModelSelect, act.state]]
                          ),
                        ])
                      );
                    }),
                    256
                  )),
                  props.editMode
                    ? (_openBlock$2(),
                      _createBlock$1(
                        _component_van_button,
                        {
                          key: 4,
                          type: "primary",
                          color: "red",
                          class: "w-full mt-2",
                          onClick: ($event) =>
                            _unref$1(mqttStore).delByIndex(index),
                        },
                        {
                          default: _withCtx$1(() => [
                            ...(_cache[8] ||
                              (_cache[8] = [_createTextVNode$1("删除", -1)])),
                          ]),
                          _: 1,
                        },
                        8,
                        ["onClick"]
                      ))
                    : _createCommentVNode$1("", true),
                ])
              );
            }),
            128
          )),
        ])
      );
    };
  },
};

const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};

const {
  createElementVNode: _createElementVNode,
  resolveComponent: _resolveComponent,
  createVNode: _createVNode$1,
  createTextVNode: _createTextVNode,
  unref: _unref,
  withCtx: _withCtx,
  renderList: _renderList,
  Fragment: _Fragment,
  openBlock: _openBlock$1,
  createElementBlock: _createElementBlock$1,
  toDisplayString: _toDisplayString,
  vShow: _vShow,
  withDirectives: _withDirectives,
  createBlock: _createBlock,
  createCommentVNode: _createCommentVNode,
  normalizeStyle: _normalizeStyle,
} = await importShared("vue");

const _hoisted_1$1 = {
  class: "flex flex-col w-[100vw] h-[100vh] max-w-[600px]",
};
const _hoisted_2 = { class: "flex flex-col gap-4" };
const _hoisted_3 = { class: "px-2" };
const _hoisted_4 = { class: "flex gap-1" };
const _hoisted_5 = { class: "flex flex-col h-full" };
const _hoisted_6 = { class: "m-4 flex flex-col gap-2" };
const _hoisted_7 = { class: "home-box mt-10" };
const _hoisted_8 = { class: "btn-fa" };
const _hoisted_9 = { class: "flex justify-between" };
const _hoisted_10 = {
  class: "p-8 flex flex-col gap-4 bg-[#F7F8FC] rounded-[20px]",
};
const _hoisted_11 = {
  class: "flex-1 h-[100px] flex justify-center items-center",
};
const _hoisted_12 = { class: "w-[90vw] h-[45vw] relative" };
const _hoisted_13 = { class: "p-0 text-center text-[#1989FA]" };
const _hoisted_14 = {
  class:
    "flex-1 flex overflow-hidden w-[100px] flex-col items-center justify-evenly",
};
const _hoisted_15 = {
  class:
    "animal-btn text-nowrap p-1 border-solid border-1 border-[#1989FA] rounded-2xl bg-white",
};
const {
  getCurrentInstance,
  onMounted,
  onUnmounted,
  ref: ref$1,
  watch,
} = await importShared("vue");

const _sfc_main$1 = {
  __name: "home",
  props: {
    msg: String,
  },
  setup(__props) {
    // 1成功，0失败 -99登录中 -1重连
    const statusMattKeys = {
      1: {
        title: "在线",
        state: 1,
        color: "green",
      },
      0: {
        title: "离线(点此重连)",
        state: 0,
        color: "red",
      },
      "-99": {
        title: "登录中",
        state: -99,
        color: "blue",
      },
      "-1": {
        title: "重连",
        state: -1,
        color: "orange",
      },
    };
    const editMode = ref$1(false);
    const mqttStore = useMqttStore();
    const useStore = useUserStore();
    const showLogin = ref$1(false);
    const uplogShow = ref$1(false);
    const showPopover = ref$1(false);
    const openTimeTaskShow = ref$1(false);
    const user = ref$1({
      username: "",
      password: "",
    });
    const mqttInstance = getCurrentInstance().proxy.$mqtt;
    const stateTextClaComp = ref$1("text-black-500");
    watch(
      () => mqttStore.state,
      (v) => {
        // stateTextClaComp.value = `text-${statusMattKeys[${v}]?.color}-500`
        stateTextClaComp.value = statusMattKeys[`${v}`]?.color;
      },
      { immediate: true }
    );
    const testFn = () => {
      // 测试数据
      setTimeout(() => {
        mqttStore.setTimeTask(mqttStore.timeTaskDomo);
        closeToast();
      }, 1000);
    };
    const openTimeTaskFn = (isave = false) => {
      mqttStore.setTimeTaskShadow(mqttStore.timeTask);
      // 清空
      mqttStore.setTimeTask("");
      if (isave) {
        let msg = JSON.stringify(mqttStore.timeTaskShadow);
        mqttInstance.publish(
          "set/state",
          `${mqttStore.userId}_11_${msg.length} ${msg}`,
          0
        );
      } else {
        mqttInstance.publish("set/state", `${mqttStore.userId}_10`, 0);
      }
      // openTimeTaskShow.value = false
      showLoadingToast({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      const timeTaskWatch = watch(
        () => mqttStore.timeTask,
        (v) => {
          if (v) {
            openTimeTaskShow.value = true;
            timeTaskWatch();
            showNotify({
              message: isave ? "已保存" : "已加载",
              type: "success",
            });
            if (isave) {
              editMode.value = !editMode.value;
            }
            closeToast();
          }
        }
      );
      setTimeout(() => {
        if (!mqttStore.timeTask && timeTaskWatch) {
          timeTaskWatch();
          showNotify({ message: `设备响应超时` });
          mqttStore.setTimeTask(mqttStore.timeTaskShadow);
          closeToast();
        }
      }, 5000);
    };
    const loginMqttFn = () => {
      if (!useStore.userInfo.userId) {
        showNotify({
          message: "请登录",
        });
        showLogin.value = true;
      } else {
        mqttStore.login(mqttInstance, useStore.userInfo.userId);
      }
    };
    const mqttLoading = ref$1(false);
    const mqttRetry = () => {
      if (mqttStore.state === 0) {
        if (mqttLoading.value) {
          showNotify({ message: `重新连接中...` });
          return;
        }
        mqttLoading.value = true;
        loginMqttFn();
        setTimeout(() => {
          mqttLoading.value = false;
        }, 3000);
      }
    };
    const animationName = ref$1("stop");
    const setStateFn = (state) => {
      animationName.value =
        (state === 1 && "stop") ||
        (state === 2 && "open") ||
        (state === 3 && "close");
      if (mqttInstance.client) {
        mqttInstance.publish("set/state", `${mqttStore.userId}_${state}`, 0);
        mqttStore.setBtnLoading(true);
        // showNotify({ type: 'success', message: `已发送指令` });
      } else {
        showNotify({ message: `请手动重连` });
      }
    };
    onMounted(() => {
      mqttRetry();
    });
    onUnmounted(() => {
      mqttStore.logout(mqttInstance);
    });

    return (_ctx, _cache) => {
      const _component_van_field = _resolveComponent("van-field");
      const _component_van_button = _resolveComponent("van-button");
      const _component_van_popup = _resolveComponent("van-popup");
      const _component_van_tag = _resolveComponent("van-tag");
      const _component_van_divider = _resolveComponent("van-divider");
      const _component_van_icon = _resolveComponent("van-icon");

      return (
        _openBlock$1(),
        _createElementBlock$1("div", _hoisted_1$1, [
          _createVNode$1(
            _component_van_popup,
            {
              show: showLogin.value,
              "onUpdate:show":
                _cache[4] ||
                (_cache[4] = ($event) => (showLogin.value = $event)),
              style: { padding: "64px", borderRadius: "20px" },
            },
            {
              default: _withCtx(() => [
                _createElementVNode("div", _hoisted_2, [
                  _cache[18] ||
                    (_cache[18] = _createElementVNode(
                      "div",
                      null,
                      "请登陆",
                      -1
                    )),
                  _createVNode$1(
                    _component_van_field,
                    {
                      modelValue: user.value.username,
                      "onUpdate:modelValue":
                        _cache[0] ||
                        (_cache[0] = ($event) =>
                          (user.value.username = $event)),
                      label: "用户名",
                      placeholder: "请输入用户名",
                    },
                    null,
                    8,
                    ["modelValue"]
                  ),
                  _createVNode$1(
                    _component_van_field,
                    {
                      modelValue: user.value.password,
                      "onUpdate:modelValue":
                        _cache[1] ||
                        (_cache[1] = ($event) =>
                          (user.value.password = $event)),
                      label: "密码",
                      placeholder: "请输入用户名",
                    },
                    null,
                    8,
                    ["modelValue"]
                  ),
                  _createVNode$1(
                    _component_van_button,
                    {
                      onClick:
                        _cache[2] ||
                        (_cache[2] = ($event) => {
                          if (_unref(useStore).userLogin(user.value)) {
                            showLogin.value = false;
                            loginMqttFn();
                          }
                        }),
                    },
                    {
                      default: _withCtx(() => [
                        ...(_cache[16] ||
                          (_cache[16] = [_createTextVNode("登陆", -1)])),
                      ]),
                      _: 1,
                    }
                  ),
                  _createVNode$1(
                    _component_van_button,
                    {
                      onClick:
                        _cache[3] ||
                        (_cache[3] = ($event) => (showLogin.value = false)),
                    },
                    {
                      default: _withCtx(() => [
                        ...(_cache[17] ||
                          (_cache[17] = [_createTextVNode("取消", -1)])),
                      ]),
                      _: 1,
                    }
                  ),
                ]),
              ]),
              _: 1,
            },
            8,
            ["show"]
          ),
          _createVNode$1(
            _component_van_popup,
            {
              show: uplogShow.value,
              "onUpdate:show":
                _cache[5] ||
                (_cache[5] = ($event) => (uplogShow.value = $event)),
              position: "bottom",
              style: { height: "60%" },
            },
            {
              default: _withCtx(() => [
                _createElementVNode("div", null, [
                  _cache[20] ||
                    (_cache[20] = _createElementVNode(
                      "div",
                      { class: "text-center m-2" },
                      "升级日志",
                      -1
                    )),
                  _createElementVNode("div", _hoisted_3, [
                    (_openBlock$1(true),
                    _createElementBlock$1(
                      _Fragment,
                      null,
                      _renderList(_unref(uplogJson), (item, index) => {
                        return (
                          _openBlock$1(),
                          _createElementBlock$1(
                            "div",
                            {
                              key: index,
                              class: "mb-4",
                            },
                            [
                              _createElementVNode("div", _hoisted_4, [
                                _createElementVNode(
                                  "strong",
                                  null,
                                  _toDisplayString(item.version),
                                  1
                                ),
                                _withDirectives(
                                  _createVNode$1(
                                    _component_van_tag,
                                    {
                                      type: "success",
                                      round: "",
                                    },
                                    {
                                      default: _withCtx(() => [
                                        ...(_cache[19] ||
                                          (_cache[19] = [
                                            _createTextVNode("当前版本", -1),
                                          ])),
                                      ]),
                                      _: 1,
                                    },
                                    512
                                  ),
                                  [
                                    [
                                      _vShow,
                                      _unref(useStore).version === item.version,
                                    ],
                                  ]
                                ),
                                _withDirectives(
                                  _createVNode$1(
                                    _component_van_tag,
                                    {
                                      type: "primary",
                                      round: "",
                                    },
                                    {
                                      default: _withCtx(() => [
                                        _createTextVNode(
                                          _toDisplayString(item.type),
                                          1
                                        ),
                                      ]),
                                      _: 2,
                                    },
                                    1536
                                  ),
                                  [[_vShow, item.type]]
                                ),
                              ]),
                              _createElementVNode(
                                "div",
                                null,
                                _toDisplayString(item.date),
                                1
                              ),
                              (_openBlock$1(true),
                              _createElementBlock$1(
                                _Fragment,
                                null,
                                _renderList(item.list, (it, idx) => {
                                  return (
                                    _openBlock$1(),
                                    _createElementBlock$1(
                                      "div",
                                      {
                                        key: idx,
                                        class: "pl-4 p-1",
                                      },
                                      [
                                        _createElementVNode(
                                          "div",
                                          null,
                                          _toDisplayString(it.title),
                                          1
                                        ),
                                        (_openBlock$1(true),
                                        _createElementBlock$1(
                                          _Fragment,
                                          null,
                                          _renderList(it.content, (i, j) => {
                                            return (
                                              _openBlock$1(),
                                              _createElementBlock$1(
                                                "div",
                                                {
                                                  key: j,
                                                  class: "pl-4",
                                                },
                                                _toDisplayString(i),
                                                1
                                              )
                                            );
                                          }),
                                          128
                                        )),
                                      ]
                                    )
                                  );
                                }),
                                128
                              )),
                              _createVNode$1(_component_van_divider),
                            ]
                          )
                        );
                      }),
                      128
                    )),
                  ]),
                ]),
              ]),
              _: 1,
            },
            8,
            ["show"]
          ),
          _createVNode$1(
            _component_van_popup,
            {
              show: openTimeTaskShow.value,
              "onUpdate:show":
                _cache[8] ||
                (_cache[8] = ($event) => (openTimeTaskShow.value = $event)),
              position: "top",
              style: { height: "100%" },
            },
            {
              default: _withCtx(() => [
                _createElementVNode("div", _hoisted_5, [
                  _cache[23] ||
                    (_cache[23] = _createElementVNode(
                      "div",
                      { class: "text-center m-2" },
                      "定时任务",
                      -1
                    )),
                  _createVNode$1(
                    _sfc_main$2,
                    {
                      editMode: editMode.value,
                      class: "flex-1",
                    },
                    null,
                    8,
                    ["editMode"]
                  ),
                  _createElementVNode("div", _hoisted_6, [
                    _unref(mqttStore).userId === "0"
                      ? (_openBlock$1(),
                        _createBlock(
                          _component_van_button,
                          {
                            key: 0,
                            color: "#1989FA",
                            onClick:
                              _cache[6] ||
                              (_cache[6] = () => {
                                if (editMode.value) {
                                  openTimeTaskFn(true);
                                } else {
                                  editMode.value = !editMode.value;
                                }
                              }),
                          },
                          {
                            default: _withCtx(() => [
                              _createTextVNode(
                                _toDisplayString(
                                  editMode.value ? "保存" : "编辑"
                                ),
                                1
                              ),
                            ]),
                            _: 1,
                          }
                        ))
                      : _createCommentVNode("", true),
                    _unref(mqttStore).userId === "0"
                      ? (_openBlock$1(),
                        _createBlock(
                          _component_van_button,
                          {
                            key: 1,
                            color: "#1989FA",
                            plain: "",
                            onClick: _unref(mqttStore).addNew,
                          },
                          {
                            default: _withCtx(() => [
                              ...(_cache[21] ||
                                (_cache[21] = [_createTextVNode("新增", -1)])),
                            ]),
                            _: 1,
                          },
                          8,
                          ["onClick"]
                        ))
                      : _createCommentVNode("", true),
                    _createVNode$1(
                      _component_van_button,
                      {
                        onClick:
                          _cache[7] ||
                          (_cache[7] = ($event) =>
                            (openTimeTaskShow.value = false)),
                      },
                      {
                        default: _withCtx(() => [
                          ...(_cache[22] ||
                            (_cache[22] = [_createTextVNode("返回主页", -1)])),
                        ]),
                        _: 1,
                      }
                    ),
                  ]),
                ]),
              ]),
              _: 1,
            },
            8,
            ["show"]
          ),
          _createElementVNode("div", _hoisted_7, [
            _createElementVNode("div", _hoisted_8, [
              _createElementVNode("div", _hoisted_9, [
                _cache[24] ||
                  (_cache[24] = _createElementVNode(
                    "strong",
                    null,
                    "芯翼达院门",
                    -1
                  )),
                _createElementVNode(
                  "span",
                  {
                    style: _normalizeStyle({ color: stateTextClaComp.value }),
                    onClick: mqttRetry,
                  },
                  _toDisplayString(
                    statusMattKeys[_unref(mqttStore).state]?.title || "未知"
                  ),
                  5
                ),
              ]),
              _createElementVNode("div", _hoisted_10, [
                _createVNode$1(
                  _component_van_button,
                  {
                    type: "primary",
                    loading: _unref(mqttStore).btnLoading,
                    size: "large",
                    onClick:
                      _cache[9] || (_cache[9] = ($event) => setStateFn(2)),
                  },
                  {
                    default: _withCtx(() => [
                      ...(_cache[25] ||
                        (_cache[25] = [_createTextVNode("开", -1)])),
                    ]),
                    _: 1,
                  },
                  8,
                  ["loading"]
                ),
                _createVNode$1(
                  _component_van_button,
                  {
                    type: "primary",
                    loading: _unref(mqttStore).btnLoading,
                    size: "large",
                    onClick:
                      _cache[10] || (_cache[10] = ($event) => setStateFn(1)),
                  },
                  {
                    default: _withCtx(() => [
                      ...(_cache[26] ||
                        (_cache[26] = [_createTextVNode("停", -1)])),
                    ]),
                    _: 1,
                  },
                  8,
                  ["loading"]
                ),
                _createVNode$1(
                  _component_van_button,
                  {
                    type: "primary",
                    loading: _unref(mqttStore).btnLoading,
                    size: "large",
                    onClick:
                      _cache[11] || (_cache[11] = ($event) => setStateFn(3)),
                  },
                  {
                    default: _withCtx(() => [
                      ...(_cache[27] ||
                        (_cache[27] = [_createTextVNode("关", -1)])),
                    ]),
                    _: 1,
                  },
                  8,
                  ["loading"]
                ),
              ]),
            ]),
          ]),
          _createElementVNode("div", _hoisted_11, [
            _createElementVNode("div", _hoisted_12, [
              _createVNode$1(
                _sfc_main$3,
                {
                  animationName: animationName.value,
                  class: "w-full h-full",
                },
                null,
                8,
                ["animationName"]
              ),
            ]),
          ]),
          _createElementVNode("div", _hoisted_13, [
            _createVNode$1(_component_van_icon, { name: "warning" }),
            _cache[28] ||
              (_cache[28] = _createTextVNode("真实状态以实物为准", -1)),
          ]),
          _createElementVNode(
            "div",
            {
              class: "p-2 text-center text-[#cccccc]",
              onClick:
                _cache[12] ||
                (_cache[12] = ($event) => (uplogShow.value = true)),
            },
            "V0.0.2"
          ),
          _createElementVNode(
            "div",
            {
              style: _normalizeStyle([
                {
                  position: "absolute",
                  right: "20px",
                  bottom: "50px",
                  transition: "top 0.3s",
                  display: "flex",
                  color: "#1989FA",
                  "flex-direction": "column",
                },
                {
                  top: showPopover.value
                    ? "calc(100vh - 220px)"
                    : "calc(100vh - 90px)",
                },
              ]),
            },
            [
              _createElementVNode("div", _hoisted_14, [
                _createElementVNode(
                  "div",
                  {
                    class:
                      "animal-btn text-nowrap p-1 border-solid border-1 border-[#1989FA] rounded-2xl bg-white",
                    onClick:
                      _cache[13] ||
                      (_cache[13] = ($event) => (showLogin.value = true)),
                  },
                  [
                    _createVNode$1(_component_van_icon, { name: "friends-o" }),
                    _cache[29] ||
                      (_cache[29] = _createTextVNode("切换用户 ", -1)),
                  ]
                ),
                _createElementVNode(
                  "div",
                  {
                    class:
                      "animal-btn text-nowrap p-1 border-solid border-1 border-[#1989FA] rounded-2xl bg-white",
                    onClick:
                      _cache[14] ||
                      (_cache[14] = () => {
                        openTimeTaskFn();
                        testFn();
                      }),
                  },
                  [
                    _createVNode$1(_component_van_icon, { name: "underway-o" }),
                    _cache[30] ||
                      (_cache[30] = _createTextVNode("定时任务 ", -1)),
                  ]
                ),
                _createElementVNode("div", _hoisted_15, [
                  _createVNode$1(_component_van_icon, { name: "todo-list-o" }),
                  _cache[31] ||
                    (_cache[31] = _createTextVNode("历史记录 ", -1)),
                ]),
              ]),
              _createVNode$1(
                _component_van_icon,
                {
                  name: "setting",
                  onClick:
                    _cache[15] ||
                    (_cache[15] = ($event) =>
                      (showPopover.value = !showPopover.value)),
                  class: "animal-btn animal-roll mr-1",
                  style: _normalizeStyle([
                    { "font-size": "40px", "align-self": "flex-end" },
                    { transform: `rotate(${showPopover.value ? 0 : 180}deg)` },
                  ]),
                },
                null,
                8,
                ["style"]
              ),
            ],
            4
          ),
        ])
      );
    };
  },
};
const compHome = /*#__PURE__*/ _export_sfc(_sfc_main$1, [
  ["__scopeId", "data-v-22e50b95"],
]);

const {
  createVNode: _createVNode,
  openBlock: _openBlock,
  createElementBlock: _createElementBlock,
} = await importShared("vue");

const _hoisted_1 = { class: "flex justify-center" };

const { ref } = await importShared("vue");

const _sfc_main = {
  __name: "App",
  setup(__props) {
    ref(true);

    return (_ctx, _cache) => {
      return (
        _openBlock(),
        _createElementBlock("div", _hoisted_1, [_createVNode(compHome)])
      );
    };
  },
};

export {
  isObject as $,
  cancelRaf as A,
  BORDER_SURROUND as B,
  getScrollTop as C,
  setScrollTop as D,
  inBrowser$1 as E,
  onMountedOrActivated as F,
  makeNumericProp as G,
  HAPTICS_FEEDBACK as H,
  Icon as I,
  useScrollParent as J,
  unitToPx as K,
  Loading as L,
  getZIndexStyle as M,
  isHidden as N,
  usePageVisibility as O,
  Popup as P,
  doubleRaf as Q,
  addUnit as R,
  BORDER_TOP_BOTTOM as S,
  setRootScrollTop as T,
  getElementTop as U,
  callInterceptor as V,
  flat as W,
  isSameValue as X,
  BORDER_UNSET_TOP_BOTTOM as Y,
  FORM_KEY as Z,
  getRootScrollTop as _,
  windowHeight as a,
  isFunction as a0,
  isPromise as a1,
  CUSTOM_FIELD_INJECTION_KEY as a2,
  toArray as a3,
  formatNumber as a4,
  resetScroll as a5,
  useCustomFieldValue as a6,
  isMobile as a7,
  showToast as a8,
  getScrollParent as a9,
  Overlay as aA,
  Toast as aB,
  showNotify as aC,
  useMqttStore as aD,
  useUserStore as aE,
  createPinia as aF,
  makeNumberProp as aa,
  padZero as ab,
  useToggle as ac,
  isDate as ad,
  useScopeId as ae,
  getSizeStyle as af,
  useLazyRender as ag,
  stdin_default$7 as ah,
  useCountDown as ai,
  noop$1 as aj,
  BORDER_TOP as ak,
  BORDER_LEFT as al,
  useClickAway as am,
  getContainingBlock as an,
  stdin_default$5 as ao,
  useLockScroll as ap,
  BORDER as aq,
  LONG_PRESS_START_TIME as ar,
  mountComponent as as,
  usePopupState as at,
  BORDER_BOTTOM as au,
  stopPropagation as av,
  BORDER_RIGHT as aw,
  addNumber as ax,
  Locale as ay,
  Notify as az,
  useChildren as b,
  createNamespace as c,
  withInstall as d,
  _sfc_main as default,
  extend as e,
  useParent as f,
  useExpose as g,
  unknownProp as h,
  Badge as i,
  pick as j,
  popupSharedProps as k,
  makeArrayProp as l,
  makeStringProp as m,
  numericProp as n,
  onPopupReopen as o,
  preventDefault as p,
  popupSharedPropKeys as q,
  isDef as r,
  clamp as s,
  truthProp as t,
  useRect as u,
  makeRequiredProp as v,
  windowWidth as w,
  useTouch as x,
  useEventListener as y,
  raf as z,
};
