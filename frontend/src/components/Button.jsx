import React from 'react';
import styled from 'styled-components';

const Button = ({ children, className, onClick }) => {
  return (
    <StyledWrapper className={className}>
      <button onClick={onClick}>{children}</button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: inline-block;

  button {
    transition: all 0.5s;
    font-size: 12px;
    padding: 0.8ch 1.2ch;
    
    @media (min-width: 768px) {
      font-size: 17px;
      padding: 1ch 2ch;
    }
    background-color: white;
    color: #000;
    cursor: pointer;
    border: none;
    border-radius: 2px;
    box-shadow:
      2px 2px 0px hsl(0, 0%, 90%),
      4px 4px 0px hsl(0, 0%, 80%),
      6px 6px 0px hsl(0, 0%, 70%),
      8px 8px 0px hsl(0, 0%, 60%),
      10px 10px 0px hsl(0, 0%, 50%),
      12px 12px 0px hsl(0, 0%, 40%),
      14px 14px 0px hsl(0, 0%, 30%),
      16px 16px 0px hsl(0, 0%, 20%),
      18px 18px 0px hsl(0, 0%, 10%);
      
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  button:hover {
    background-color: hsl(0, 0%, 50%);
    color: #fff;
    box-shadow: none;
    transform: translate(2px, 2px);
  }
`;

export default Button;
