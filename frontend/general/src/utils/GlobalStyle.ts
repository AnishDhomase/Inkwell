import { createGlobalStyle } from "styled-components";
const GlobalStyles = createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body{
    box-sizing: border-box;
    overflow-x: hidden;    
    font-family : "roboto", sans-serif;
  }
  ::-webkit-scrollbar {
    width:  0px;
  }
  a {
    text-decoration: none;
  }
`;
export default GlobalStyles;
