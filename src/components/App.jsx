import { useReducer, useEffect } from 'react';
import { FeedBackOptions, Section, Notification, Statistics } from './Counter';

const feedbackReducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, [action.payload]: state[action.payload] + 1 };
    default:
      return state;
  }
};

export const App = () => {
  const storedState = JSON.parse(localStorage.getItem('feedbackCounts')) || {
    good: 0,
    neutral: 0,
    bad: 0,
  };

  const [feedbackCounts, dispatch] = useReducer(feedbackReducer, storedState);

  useEffect(() => {
    localStorage.setItem('feedbackCounts', JSON.stringify(feedbackCounts));
  }, [feedbackCounts]);

  const handleClick = option => {
    dispatch({ type: 'INCREMENT', payload: option });
  };

  const countTotalFeedback = () => {
    const { good, neutral, bad } = feedbackCounts;
    return good + neutral + bad;
  };

  const countPositiveFeedbackPercentage = () => {
    const total = countTotalFeedback();
    const percentage = total > 0 ? (feedbackCounts.good / total) * 100 : 0;
    return percentage.toFixed(2) + '%';
  };

  return (
    <>
      <Section title={'Пожалуйста, оставьте ваш отзыв'}>
        <FeedBackOptions
          options={Object.keys(feedbackCounts)}
          onLeaveFeedback={handleClick}
        />
      </Section>
      <Section title={'Статистика'}>
        {countTotalFeedback() === 0 ? (
          <Notification message="Нет отзывов" />
        ) : (
          <Statistics
            good={feedbackCounts.good}
            neutral={feedbackCounts.neutral}
            bad={feedbackCounts.bad}
            total={countTotalFeedback()}
            positivePercentage={countPositiveFeedbackPercentage()}
          />
        )}
      </Section>
    </>
  );
};
