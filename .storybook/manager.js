import { addons } from '@storybook/addons';
import { create } from '@storybook/theming/create';
import brandImage from "../assets/images/gravitee-logo-inline.png";


const graviteeTheme = create({
  base: 'light',
  brandTitle: 'Gravitee components',
  brandUrl: 'https://gravitee.io/',
  brandImage
});


addons.setConfig({
  theme: graviteeTheme,
  showRoots: true,
  enableShortcuts: false,
});
