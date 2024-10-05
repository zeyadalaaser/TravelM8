import React from "react";
import styled from "styled-components";

const Sidebar = ({ state, toggleSidebar }) => {
  return (
    <SidebarContainer state={state}>
      <CloseButton onClick={toggleSidebar}>&times;</CloseButton>
      <ul>
        <li>
          <a href="#home" onClick={toggleSidebar}>Home</a>
        </li>
        <li>
          <a href="#services" onClick={toggleSidebar}>About</a>
        </li>
        <li>
          <a href="#recommend" onClick={toggleSidebar}>Places</a>
        </li>
        <li>
          <a href="#testimonials" onClick={toggleSidebar}>Testimonials</a>
        </li>
        <li>
          <a href="#contact" onClick={toggleSidebar}>Contact</a>
        </li>
      </ul>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: ${({ state }) => (state ? "0" : "-250px")};
  height: 100vh;
  width: 250px;
  background-color: #023e8a;
  transition: 0.3s ease-in-out;
  padding-top: 60px;
  z-index: 1000; /* Ensure it appears above other content */
  
  ul {
    list-style-type: none;
    padding: 0;

    li {
      margin: 20px 0;

      a {
        color: white;
        text-decoration: none;
        font-size: 1.2rem;
        padding-left: 20px;
        transition: 0.3s ease-in-out;

        &:hover {
          color: #48cae4;
        }
      }
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;

  &:hover {
    color: #48cae4;
  }
`;

export default Sidebar;
