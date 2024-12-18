import styled, { css } from "styled-components";

export type ButtonProps = {
    background?: string;
    color?: string;
    width?: string;
    transition?: string;
    backgroundHover?: string;
    colorHover?: string;
};

export const styledButton = css<ButtonProps>`
    background-color: ${(props) => props.background || "var(--primary)"};
    border-radius: 8px;
    color: ${(props) => props.color || "var(--primary-foreground)"};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
    font-size: 12px;
    font-weight: bold;
    min-width: 40px;
    width: ${(props) => props.width || null};
    height: 40px;
    padding: 8px;
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
