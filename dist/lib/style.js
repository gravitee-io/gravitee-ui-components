function t(t,e){return getComputedStyle(t).getPropertyValue(e)}export function getCssVar(e,n){return n.startsWith("--")?t(e,n):t(e,`--${n}`)}
//# sourceMappingURL=style.js.map