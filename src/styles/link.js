import { css } from 'lit-element';

// language=CSS
export const link = css`
    .link, .link:visited {
        opacity: 1;
        transition: opacity .15s ease-in;
        text-decoration: none;
    }

    .link:hover {
        opacity: .5;
        transition: opacity .15s ease-in;
    }   
`;
