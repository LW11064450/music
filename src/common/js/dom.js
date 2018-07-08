
export function getData (el, name, val) {
  const prefix = 'data-'
  if (val) {
    /*有val设置属性，并赋值*/
    return el.setAttribute(prefix + name, val)
  }
  /*没有val则获取属性值*/
  return el.getAttribute(prefix + name)
}

/*transform属性的各浏览器兼容处理*/
let elementStyle = document.createElement('div').style

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()

export function prefixStyle (style) {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
