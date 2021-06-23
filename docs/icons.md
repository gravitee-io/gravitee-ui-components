# Icons

## How to use icon ?

### With `gv-icon` component

**First, import the component**

```javascript
import '@gravitee/ui-components/wc/gv-icon';
```
**And use in template**

```html
<gv-icon shape="food:bread"></gv-icon>
```

### With simple SVG Element

```html
<svg>
  <use xlink:href="./css/icons/food.svg#bread" /> 
</svg>
```

## How to add a new icon ?

1. Add your SVG icon file into `.files/icons/{category}`
2. run `npm run generate:icons`
3. Check the `gv-icons` story
4. Commit all changes 

