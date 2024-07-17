import s from './styles/loading-dots.module.css';

const LoadingDots = () => {
  return (
    <span className={s.root}>
      <span />
      <span />
      <span />
    </span>
  );
};

export default LoadingDots;
