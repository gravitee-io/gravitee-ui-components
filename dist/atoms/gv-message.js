import{classMap as r}from"lit-html/directives/class-map.js";import{LitElement as o,html as e,css as s}from"lit-element";export class GvMessage extends o{static get properties(){return{type:{type:String}}}static get styles(){return[s`div{border:1px solid #000;box-sizing:border-box;border-radius:4px;font-style:normal;font-weight:400;line-height:normal;padding:12px 8px}div.info{border-color:#1d3730;background-color:#fafafa;color:#1d3730}div.success{border-color:#193e34;background-color:#d5fdcb;color:#193e34}div.error{border-color:#820014;background-color:#ffccc7;color:#820014}`]}render(){const o={info:!this.type||"success"!==this.type&&"error"!==this.type,success:"success"===this.type,error:"error"===this.type};return e`<div class="${r(o)}"><slot></slot></div>`}}window.customElements.define("gv-message",GvMessage);
//# sourceMappingURL=gv-message.js.map