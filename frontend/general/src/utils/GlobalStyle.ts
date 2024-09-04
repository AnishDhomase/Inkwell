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
    color: inherit;
  }
`;
export default GlobalStyles;

export const lightTheme = {
  primary: "#ff7738",
  secondary: "#007bff",
  text: "#000000",
  bodyPrimary: "#ffffff",
  bodySecondary: "#f9f9f9",
  borderColor: "#dcdbdb",
  rightPanelTitle: " #333",
  rightPanelTxtBtn: "#3856ff",
  rightPanelAddBg: "#f0f1f3",
  userCardPartialTxt: "#909090",
  bottomBorder: "#efe9e9",
  blogCardHoverTxt: "#0c1a6b",
  likeSaveBtnBg: "#f9f9f9",
  accountNavPanelSecBg: "#b7b6b6",
};
export const darkTheme = {
  primary: "#ff7738",
  secondary: "#007bff",
  text: "#d3d6db",
  bodyPrimary: "#454444",
  bodySecondary: "#5f5f5f",
  borderColor: "#898686",
  rightPanelTitle: "#f4eeee",
  rightPanelTxtBtn: "#5997f4",
  rightPanelAddBg: "#515152",
  userCardPartialTxt: "#989494",
  bottomBorder: "#626161",
  blogCardHoverTxt: "#007bff",
  likeSaveBtnBg: "#b1a9a9",
  accountNavPanelSecBg: " #3f3d3d",
};
