import { useState } from 'react';
import {
  TURNOVER_CATEGORIES,
  TURNOVER_CATEGORIES_NAME,
  TURNOVER_SUB_CATEGORIES,
  TURNOVER_SUB_CATEGORIES_NAME,
} from './constants';

const TurnoverCategoriesSelector: React.FC = () => {
  const [turnoverCategory, setTurnoverCategory] = useState(TURNOVER_CATEGORIES.DROP);
  const [turnoverSubCategory, setTurnoverSubCategory] = useState(TURNOVER_SUB_CATEGORIES.DIRECT_TRANSITION);
  const isSelectedPass = turnoverCategory !== TURNOVER_CATEGORIES.OTHERS;

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setTurnoverCategory(event.target.value);
  };

  const handleSubCheck = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setTurnoverSubCategory(event.target.value);
  };

  return (
    <section>
      {Object.values(TURNOVER_CATEGORIES).map((value: string, index: number) => (
        <>
          <input
            key={`turnover-catgories-${value}`}
            type="radio"
            name="turnoverCategory"
            id={`${value}-${index}`}
            value={value}
            onChange={handleCheck}
            checked={value === turnoverCategory}
          />
          <label htmlFor={`${value}-${index}`}>{Object.values(TURNOVER_CATEGORIES_NAME)[index]}</label>
        </>
      ))}
      <section>
        {isSelectedPass &&
          Object.values(TURNOVER_SUB_CATEGORIES).map((value: string, index: number) => (
            <>
              <input
                key={`turnover-sub-catgories-${turnoverCategory}-${value}`}
                type="radio"
                name="turnoverSubCategory"
                id={`${value}-${index}`}
                value={value}
                onChange={handleSubCheck}
                checked={value === turnoverSubCategory}
              />
              <label htmlFor={`${value}-${index}`}>{Object.values(TURNOVER_SUB_CATEGORIES_NAME)[index]}</label>
            </>
          ))}
      </section>
    </section>
  );
};

export default TurnoverCategoriesSelector;
