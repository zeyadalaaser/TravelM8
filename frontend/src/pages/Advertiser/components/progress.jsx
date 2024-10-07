/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const CustomProgressBar = ({ value }) => {
  const progressBarStyle = css`
    width: 100%;
    background-color: #e0e0e0;
    border-radius: 4px;
    height: 8px;
  `;

  const progressFillStyle = css`
    width: ${value}%;
    background-color: #3b82f6; /* Tailwind's blue-600 */
    height: 100%;
    border-radius: 4px;
  `;

  return (
    <div css={progressBarStyle}>
      <div css={progressFillStyle} />
    </div>
  );
};
