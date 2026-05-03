// Утилиты для анимаций в игре Монополия

/**
 * Анимация движения фишки от одной клетки к другой
 */
export const animateTokenMove = (
  _fromPosition: number,
  _toPosition: number,
  duration: number = 500
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
};

/**
 * Анимация броска кубиков
 */
export const animateDiceRoll = (
  callback: () => void,
  duration: number = 600
): void => {
  setTimeout(() => {
    callback();
  }, duration);
};

/**
 * Анимация покупки недвижимости
 */
export const animatePropertyPurchase = (
  propertyId: number,
  callback?: () => void
): void => {
  const element = document.querySelector(`[data-property-id="${propertyId}"]`);
  if (element) {
    element.classList.add('animate-pulse-glow');
    setTimeout(() => {
      element.classList.remove('animate-pulse-glow');
      callback?.();
    }, 1000);
  } else {
    callback?.();
  }
};

/**
 * Анимация перевода денег между игроками
 */
export const animateMoneyTransfer = (
  _fromPlayerId: string,
  _toPlayerId: string,
  _amount: number,
  callback?: () => void
): void => {
  // Визуальная анимация перевода денег
  setTimeout(() => {
    callback?.();
  }, 500);
};

/**
 * Плавная прокрутка к элементу
 */
export const smoothScrollTo = (elementId: string): void => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

/**
 * Анимация появления уведомления
 */
export const showNotification = (
  message: string,
  type: 'success' | 'error' | 'info' = 'info'
): void => {
  // Эта функция будет использоваться с компонентом Toast
  console.log(`[${type.toUpperCase()}] ${message}`);
};

/**
 * Задержка выполнения
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Анимация тряски элемента (для ошибок)
 */
export const shakeElement = (elementId: string): void => {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.add('animate-shake');
    setTimeout(() => {
      element.classList.remove('animate-shake');
    }, 500);
  }
};
