import React from "react";
import styled from "styled-components";
import homeImage from "../assets/hero.png";

export default function Hero() {
  return (
    <Section id="hero">
      <div className="background">
        <img src={homeImage} alt="" />
      </div>
      <div className="content">
        <div className="title">
          <h1>TRAVEL TO EXPLORE</h1>
          <p>
            Discover new destinations and create unforgettable memories!
          </p>
        </div>
        <div className="search">
          <div className="container">
            <label htmlFor="location">Where you want to go</label>
            <input
              type="text"
              id="location"
              placeholder="Search Your location"
              aria-label="Location"
            />
          </div>
          <div className="container">
            <label htmlFor="checkin">Check-in</label>
            <input
              type="date"
              id="checkin"
              aria-label="Check-in Date"
            />
          </div>
          <div className="container">
            <label htmlFor="checkout">Check-out</label>
            <input
              type="date"
              id="checkout"
              aria-label="Check-out Date"
            />
          </div>
          <button>Explore Now</button>
        </div>
      </div>
    </Section>
  );
}

const Section = styled.section`
  position: relative;
  margin-top: 2rem;
  width: 100%;
  height: 100%;

  .background {
    height: 100%;
    img {
      width: 100%;
      filter: brightness(60%);
    }
  }

  .content {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    z-index: 3;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    .title {
      color: white;
      h1 {
        font-size: 1.5rem;
        letter-spacing: 0.2rem;
      }
      p {
        text-align: center;
        padding: 0 10vw;
        margin-top: 0.5rem;
        font-size: 1.2rem;
      }
    }

    .search {
      display: flex;
      flex-wrap: wrap; /* Allow wrapping for smaller screens */
      background-color: rgba(255, 255, 255, 0.8);
      padding: 1rem;
      border-radius: 0.5rem;
      width: 80%;
      max-width: 900px;
      gap: 1rem;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      align-items: center; /* Align items vertically */

      .container {
        display: flex;
        align-items: center;
        flex-direction: column;
        padding: 0 1rem;
        flex: 1;

        label {
          font-size: 1.1rem;
          color: #03045e;
        }

        input {
          background-color: transparent;
          border: 1px solid #ccc;
          border-radius: 0.3rem;
          text-align: center;
          color: black;
          width: 100%;
          padding: 0.5rem;

          &[type="date"] {
            padding-left: 0; // Adjust padding for date input
          }

          &::placeholder {
            color: #aaa; // Lighter color for placeholder
            opacity: 1; // Show the placeholder
          }

          &:focus {
            outline: none;
            border-color: #4361ee; // Change border color on focus
          }
        }
      }

      button {
        padding: 1rem;
        cursor: pointer;
        border-radius: 0.3rem;
        border: none;
        color: white;
        background-color: #4361ee;
        font-size: 1.1rem;
        text-transform: uppercase;
        transition: 0.3s ease-in-out;
        width: auto; // Set width to auto for the button
        min-width: 120px; // Minimum width for the button to look uniform

        &:hover {
          background-color: #023e8a;
        }
      }
    }
  }

  @media screen and (min-width: 280px) and (max-width: 1500px) {
    height: 25rem;

    .background {
      background-color: palegreen;
      img {
        height: 100%;
      }
    }

    .content {
      .title {
        h1 {
          font-size: 2rem;
        }
        p {
          font-size: 0.8rem;
          padding: 1vw;
        }
      }

      .search {
        flex-direction: row; // Stack elements vertically on smaller screens
        padding: 0.8rem;
        gap: 0.8rem;

        button {
          width: auto; // Keep button auto width on smaller screens
          min-width: 120px; // Keep minimum width for button
          padding: 1rem;
          font-size: 1rem;
        }
      }
    }
  }
`;
