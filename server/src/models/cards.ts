export interface Card {
  id: number;
  type: 'chance' | 'community';
  text: string;
  action: 'money' | 'move' | 'jail' | 'jailFree' | 'repairs' | 'players';
  value?: number;
  position?: number;
}

export const CHANCE_CARDS: Card[] = [
  { id: 1, type: 'chance', text: 'Банк выплачивает вам дивиденды в размере $50', action: 'money', value: 50 },
  { id: 2, type: 'chance', text: 'Вернитесь на 3 клетки назад', action: 'move', value: -3 },
  { id: 3, type: 'chance', text: 'Идите в тюрьму. Идите прямо в тюрьму. Не проходите мимо "Вперед"', action: 'jail' },
  { id: 4, type: 'chance', text: 'Сделайте общий ремонт всей собственности. Заплатите $25 за каждый дом и $100 за каждый отель', action: 'repairs', value: 25 },
  { id: 5, type: 'chance', text: 'Штраф за превышение скорости $15', action: 'money', value: -15 },
  { id: 6, type: 'chance', text: 'Совершите поездку на железную дорогу. Если пройдете "Вперед", получите $200', action: 'move', position: 5 },
  { id: 7, type: 'chance', text: 'Вы избраны председателем правления. Заплатите каждому игроку $50', action: 'players', value: -50 },
  { id: 8, type: 'chance', text: 'Ваш строительный заем подлежит погашению. Получите $150', action: 'money', value: 150 },
  { id: 9, type: 'chance', text: 'Вы выиграли кроссворд. Получите $100', action: 'money', value: 100 },
  { id: 10, type: 'chance', text: 'Освобождение из тюрьмы. Эту карточку можно сохранить до тех пор, пока она не понадобится', action: 'jailFree' },
  { id: 11, type: 'chance', text: 'Пройдите на клетку "Вперед"', action: 'move', position: 0 },
  { id: 12, type: 'chance', text: 'Идите на Ленинградский проспект', action: 'move', position: 24 },
  { id: 13, type: 'chance', text: 'Идите на Кузнецкий мост', action: 'move', position: 11 },
  { id: 14, type: 'chance', text: 'Идите на Кремль', action: 'move', position: 39 },
  { id: 15, type: 'chance', text: 'Идите на ближайшую коммунальную компанию. Если она никому не принадлежит, можете купить её у банка', action: 'move', position: -1 },
  { id: 16, type: 'chance', text: 'Банк платит вам дивиденды $50', action: 'money', value: 50 },
];

export const COMMUNITY_CARDS: Card[] = [
  { id: 1, type: 'community', text: 'Идите в тюрьму. Идите прямо в тюрьму. Не проходите мимо "Вперед"', action: 'jail' },
  { id: 2, type: 'community', text: 'Ошибка банка в вашу пользу. Получите $200', action: 'money', value: 200 },
  { id: 3, type: 'community', text: 'Оплата услуг врача. Заплатите $50', action: 'money', value: -50 },
  { id: 4, type: 'community', text: 'Продажа акций. Получите $50', action: 'money', value: 50 },
  { id: 5, type: 'community', text: 'Освобождение из тюрьмы. Эту карточку можно сохранить до тех пор, пока она не понадобится', action: 'jailFree' },
  { id: 6, type: 'community', text: 'Пройдите на клетку "Вперед". Получите $200', action: 'move', position: 0 },
  { id: 7, type: 'community', text: 'Праздничный фонд. Получите $100', action: 'money', value: 100 },
  { id: 8, type: 'community', text: 'Подоходный налог. Заплатите $200', action: 'money', value: -200 },
  { id: 9, type: 'community', text: 'Сегодня ваш день рождения. Получите $10 от каждого игрока', action: 'players', value: 10 },
  { id: 10, type: 'community', text: 'Страхование жизни. Получите $100', action: 'money', value: 100 },
  { id: 11, type: 'community', text: 'Больничные сборы. Заплатите $100', action: 'money', value: -100 },
  { id: 12, type: 'community', text: 'Школьные сборы. Заплатите $50', action: 'money', value: -50 },
  { id: 13, type: 'community', text: 'Получите $25 консультационный гонорар', action: 'money', value: 25 },
  { id: 14, type: 'community', text: 'Вы заняли второе место в конкурсе красоты. Получите $10', action: 'money', value: 10 },
  { id: 15, type: 'community', text: 'Вы наследуете $100', action: 'money', value: 100 },
  { id: 16, type: 'community', text: 'Оплата за ремонт улицы. $40 за каждый дом, $115 за каждый отель', action: 'repairs', value: 40 },
];

export function shuffleCards(cards: Card[]): Card[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
