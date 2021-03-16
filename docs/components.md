# Components

Each components can use `var() - CSS` for customisation.

## How to add an CSS variable ?

1. Add a new line in component documentation (ex: `@cssprop {Length} [--gv-modal--w=280px] - model width`) to declare 
the CSS variable. Be careful with the {Type} and use the naming convention. 
2. Use the custom property in own css code.
3. **ONLY** if you want that's the component to be customizable on the portal, you **MUST** add `@theme facet` in "details" section of component documentation.  
4. Run `npm run generate:theme` to check the variable syntax and rebuild `definition.json` defining the default portal's theme.

### Types 

Here are the types available for CSS variables :

- Length (size in px...)
- Color
- String

### Naming convention

A CSS variable should have this format `--{component-name}-{?optionnal-explicit-selector}--{css-property}` 
and must only contain lowercase alpha and dash characters. 
The `css-property` part should have the *EMMET CHEAT SHEAT CSS* syntax.


 
