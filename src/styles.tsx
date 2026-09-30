import styled from 'styled-components';

export const StyledTable = styled.div`
  padding-bottom: 1rem;

  h3 {
    text-align: center;
    margin: 0.25rem;
  }

  p {
    text-align: left;
  }

  table {
    border-spacing: 0;
    border: 1px solid black;
    margin: auto;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      touch-action: manipulation;

      :last-child {
        border-right: 0;
      }

      input {
        font-size: 1rem;
        padding: 0;
        margin: 0;
        border: 0;
      }
    }
  }
`;

export const StyledCell = styled.div<{ $readOnly: boolean }>`
  font-weight: bold;
  user-select: none;
  text-align: center;
  padding: 4rem;
  background-color: ${(props): string => (props.$readOnly ? 'white' : '#ddddff')};

  @media (min-width: 600px) and (max-width: 900px) {
    padding: 2.5rem;
  }

  @media (min-width: 400px) and (max-width: 599px) {
    padding: 1.2rem;
  }

  @media (max-width: 399px) {
    padding: 0.75rem;
  }

  hr {
    width: 1rem;
  }
`;

export const StyledTitleCell = styled.div`
  text-align: center;
`;

export const TitleNameInput = styled.button`
  text-align: center;
  width: 50%;
`;

export const StyledDisplayCell = styled.div`
  text-align: center;
  padding: 2rem;

  @media (min-width: 600px) and (max-width: 900px) {
    padding: 1.5rem;
  }

  @media (max-width: 600px) {
    padding: 0.15rem;
  }
`;

export const StyledSubHeader = styled.ul`
  list-style-type: none;
  display: flex;
  padding: 0;
  margin: 0;

  li {
    font-size: 12px;
    width: 33%;
    padding: 4px 0;

    border-right: 1px solid black;

    :last-child {
      border: none;
    }

    @media (max-width: 1119px) {
      font-size: 8px;
    }
  }
`;
