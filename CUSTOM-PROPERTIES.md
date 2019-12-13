# Gravitee.io UI Components

## Custom Properties

```css

/*****************************
/*     gv-button
******************************/
--gv-button--bgc: "#193E34"; /* set the background color of button. */
--gv-button-primary--bgc: "#009B5B"; /* set the background color of primary button. */
--gv-button--p: "0rem 0.5rem"; /* set the padding. */
--gv-button--fz: "14px"; /* set the font-size */
--gv-button--bdrs: "0.15rem"; /* set the border radius */
--gv-button-icon--c: "#BFBFBF"; /* set the color of icon */

/*****************************
/*     gv-card-category
******************************/
--gv-card-category--bgc: "white"; /* set the background color of card. */
--gv-card-category--c: "#262626"; /* set the color of text. */
--gv-card-category--h: "228px"; /* set the height (default: 228px). */

/*****************************
/*     gv-icon
******************************/
--gv-icon--c: "#000"; /* set the color of icon */
--gv-icon--s: "32"; /* set the height and width of icon (crushes size property) */

/*****************************
/*     gv-image
******************************/
--gv-image--h: "128px"; /* set the height of image */
--gv-image--w: "128px"; /* set the width of image */
--gv-image--bd: "none"; /* set the border of image */
--gv-image--bdrs: "none"; /* set the border radius of image */
--gv-image--of: "contain"; /* set the object-fit of image */

/*****************************
/*     gv-metric
******************************/
--gv-metric--c: "#262626"; /* set the color. */

/*****************************
/*     gv-nav-link
******************************/
--gv-nav-link-a--pv: "15px"; /* set the vertical padding for the inner <a> tag. (Default: 1rem) */
--gv-nav-link-a--ph: "15px"; /* set the horizontal padding for the inner <a> tag. (Default: 1rem) */
--gv-nav-link--c: "#262626"; /* set the color of link. */
--gv-nav-link-active--c: "#FAFAFA"; /* set the color of active link. */
--gv-nav-link--bgc: "transparent"; /* set the background color of link. */
--gv-nav-link-active--bgc: "#193E34"; /* set the background color of active link. */
--gv-nav-link-active--bdb: "none"; /* set the border bottom of active link. (Default: none) */
--gv-nav-link--ta: "center"; /* set the text align (Default: center) */
--gv-nav-link--td: "none"; /* set the text decoration (Default: none) */
--gv-nav-link--tsh: "none"; /* set the text shadow (Default: none) */

/*****************************
/*     gv-select
******************************/
--gv-select--bgc: "#FFF"; /* set the background color. */
--gv-select--bdc: "lightgrey"; /* set the border color. */
--gv-select--c: "#262626"; /* set the color. */
--gv-select-hover--bgc: "#D5FDCB"; /* set the active background color. */
--gv-select-selected--bgc: "#FAFAFA"; /* set the hover background color. */

/*****************************
/*     gv-state
******************************/
--gv-state--bdr: "17px"; /* set the border radius. */
--gv-state--bgc: "#F0F5FF"; /* set the background color. */
--gv-state--c: "#597EF7"; /* set the color. */
--gv-state-major--bgc: "#D5FDCB"; /* set the background color. */
--gv-state-major--c: "#009B5B"; /* set the color. */

/*****************************
/*     gv-tag
******************************/
--gv-tag--bdr: "4px"; /* set the border radius. */
--gv-tag--bsw: "none"; /* set the box shadow. */
--gv-tag--bgc: "#F5F5F5"; /* set the background color. */
--gv-tag-major--bgc: "#009B5B"; /* set the background color. */
--gv-tag-minor--bgc: "#FFF"; /* set the background color. */
--gv-tag--bdc: "#D9D9D9"; /* set the border color. */
--gv-tag-major--bdc: "#009B5B"; /* set the border color. */
--gv-tag-minor--bdc: "#D9D9D9"; /* set the border color. */
--gv-tag--bds: "solid"; /* set the border style. */
--gv-tag-major--bds: "solid"; /* set the border style. */
--gv-tag-minor--bds: "dashed"; /* set the border style. */
--gv-tag--bdw: "1px"; /* set the border width. */
--gv-tag-major--bdw: "1px"; /* set the border width. */
--gv-tag-minor--bdw: "1px"; /* set the border width. */
--gv-tag--c: "#595959"; /* set the color. */
--gv-tag-major--c: "#FFF"; /* set the color. */
--gv-tag-minor--c: "#595959"; /* set the color. */

/*****************************
/*     gv-card-api-full
******************************/
--gv-card-api-full--bgc: "white"; /* set the background color. */

/*****************************
/*     gv-card-api
******************************/
--gv-card-api--bgc: "white"; /* set the background color. */

/*****************************
/*     gv-header-api
******************************/
--gv-header-api--bgc: "#D5FDCB"; /* set the background color. */
--gv-header-api--pl: "4rem"; /* set the padding left */
--gv-header-api--pr: "4rem"; /* set the padding right */
--gv-header-api--c: "#262626"; /* set the color */

/*****************************
/*     gv-info-api
******************************/
--gv-info-api--bgc: "white"; /* set the background color. */

/*****************************
/*     gv-list
******************************/
--gv-list--bgc: "white"; /* set the background color. */

/*****************************
/*     gv-option
******************************/
--gv-option--bgc: "#E8E8E8"; /* set the background color. (default: #E8E8E8) */
--gv-option-icon--c: "#BFBFBF"; /* set the background color. (default: #BFBFBF) */

/*****************************
/*     gv-promote-api
******************************/
--gv-promote-api-image--bgc: "#D5FDCB"; /* set the background color of image. */
--gv-promote-api--bgc: "white"; /* set the background color. */

/*****************************
/*     gv-rating
******************************/
--gv-rating--c: "#262626"; /* set the icon color. */
--gv-rating--s: "13px"; /* set the icon size. */

/*****************************
/*     gv-row-api
******************************/
--gv-row-api--bgc: "white"; /* set the background color. */
--gv-row-api-hover--bgc: "#FAFAFA"; /* set the background color when hover. */

/*****************************
/*     gv-stepper
******************************/
--gv-stepper-validate--bgc: "#009B5B"; /* set validate background color. */
--gv-stepper-passed--bdc: "#D5FDCB"; /* set passed border color. */
--gv-stepper--bgc: "#BFBFBF"; /* set background color. */
--gv-stepper--bdc: "#BFBFBF"; /* set border color. */
--gv-stepper--c: "#BFBFBF"; /* set color for text. */
--gv-stepper-passed--c: "#595959"; /* set passed color for text. */

/*****************************
/*     gv-tree
******************************/
--gv-tree-menu--bgc: "#FFF"; /* set the background color. */
--gv-tree-menu--c: "#262626"; /* set the color. */
--gv-tree-menu-active--bd: "#FFF"; /* set the active border. */
--gv-tree-menu-active--bgc: "#FAFAFA"; /* set the active background color. */
--gv-tree-menu-hover--bgc: "#FFF"; /* set the hover background color. */

/*****************************
/*     gv-menu
******************************/
--gv-menu--c: "#FFF"; /* set the color. */
--gv-menu--bgc: "#193E34"; /* set the background color. */
--gv-menu-link-active--bdb: "3px solid #D5FDCB"; /* set the border of active link. */
--gv-menu--pl: "4rem"; /* set the padding left */
--gv-menu--pr: "4rem"; /* set the padding right */

/*****************************
/*     gv-user-menu
******************************/
--gv-user-menu--c: "#262626"; /* set the color. */
--gv-user-menu-hover--c: "#193E34"; /* set the hover color. */
--gv-user-menu--bgc: "#FFF"; /* set the background color. */
--gv-user-menu-hover--bgc: "#D5FDCB"; /* set the hover background color. */
--gv-user-menu--bdc: "lightgrey"; /* set the border color. */
--gv-user-menu--tsh: "none"; /* set the text shadow. */
```