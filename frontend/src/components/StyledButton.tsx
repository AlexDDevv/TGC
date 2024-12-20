import styled, { css } from "styled-components";

export type ButtonProps = {
    background?: string;
    color?: string;
    minWidth?: string;
    width?: string;
    height?: string;
    margin?: string;
    padding?: string;
    transition?: string;
    backgroundHover?: string;
    colorHover?: string;
};

export const styledButton = css<ButtonProps>`
    background-color: ${(props) => props.background || "var(--primary)"};
    border-radius: 8px;
    border: none;
    color: ${(props) => props.color || "var(--primary-foreground)"};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
    font-size: 12px;
    font-weight: bold;
    min-width: ${(props) => props.minWidth || "40px"};
    width: ${(props) => props.width || null};
    height: ${(props) => props.height || "40px"};
    margin: ${(props) => props.margin || null};
    padding: ${(props) => props.padding || "0 16px"};
    transition: ${(props) => props.transition || null};
    cursor: pointer;

    &:hover {
        background-color: ${(props) => props.backgroundHover || null};
        color: ${(props) => props.colorHover || null};
    }
`;

export const Button = styled.button<ButtonProps>`
    ${styledButton}
`;
