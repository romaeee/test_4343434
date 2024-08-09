import React, { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import './App.css';
import Character from './icons/Hamster';
import { dollarCoin, mainCharacter } from './images';
import ShopWindow from './ShopWindow';
import TonWindow from './TonWindow';

const App: React.FC = () => {

  const [isShopWindowOpen, setIsShopWindowOpen] = useState(false);
  const [isTonWindowOpen, setIsTonWindowOpen] = useState(false);

  const levelNames = [
    "Bronze Poop", "Silver Poop", "Gold Poop", "Platinum Poop",
    "Diamond Poop", "Epic Poop", "Legendary Poop", "Master Poop",
    "GrandMaster Poop", "Lord Poop"
  ];

  const levelMinPoints = [
    0, 100, 200, 500, 1000, 2000, 10000, 50000, 100000, 1000000
  ];

  const [userData, setUserData] = useState<UserData | null>(null);
  const [levelIndex, setLevelIndex] = useState(1);
  const [points, setPoints] = useState(() => {
    return Number(localStorage.getItem('points')) || 1;
  });
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);
  const pointsToAdd = 1;
  const profitPerHour = 1;

  interface UserData {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code: string;
    is_premium?: boolean;
  }

  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as UserData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('points', points.toString());
  }, [points]);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    card.style.transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg)`;
    setTimeout(() => {
      card.style.transform = '';
    }, 100);

    setPoints(points + pointsToAdd);
    setClicks([...clicks, { id: Date.now(), x: e.pageX, y: e.pageY }]);
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter(click => click.id !== id));
  };

  const calculateProgress = () => {
    if (levelIndex >= levelNames.length - 1) {
      return 100;
    }
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    const progress = ((points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
    return Math.min(progress, 100);
  };

  useEffect(() => {
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    if (points >= nextLevelMin && levelIndex < levelNames.length - 1) {
      setLevelIndex(levelIndex + 1);
    } else if (points < currentLevelMin && levelIndex > 0) {
      setLevelIndex(levelIndex - 1);
    }
  }, [points, levelIndex, levelMinPoints, levelNames.length]);

  useEffect(() => {
    const pointsPerSecond = Math.floor(profitPerHour / 3600);
    const interval = setInterval(() => {
      setPoints(prevPoints => prevPoints + pointsPerSecond);
    }, 1000);
    return () => clearInterval(interval);
  }, [profitPerHour]);

  const resetProgress = () => {
    setPoints(0);
    setLevelIndex(1);
    localStorage.removeItem('points');
  };

  const openShop = () => setIsShopWindowOpen(true);
  const openTonWindow = () => setIsTonWindowOpen(true);

  const updatePoints = (newPoints: number) => {
    setPoints(newPoints);
    localStorage.setItem('points', newPoints.toString());
  };

  return (
    <>
      {isShopWindowOpen ? (
        <ShopWindow points={points} onClose={() => setIsShopWindowOpen(false)} onPointsChange={updatePoints} />
      ) : isTonWindowOpen ? (
        <TonWindow onClose={() => setIsTonWindowOpen(false)} />
      ) : (
        <div className="bg-black flex justify-center pb-20">
          <div className="w-full bg-black text-white h-[100vh] font-bold flex flex-col max-w-xl">
            <div className="px-4 z-10">
              <div className="flex items-center space-x-2 pt-4">
                <div className="p-1 rounded-lg bg-[#1d2025]">
                  <Character size={24} className="text-[#d4d4d4]" />
                </div>
                <div>
                  <p className="text-sm">{userData?.first_name || 'Player'}{' poop id: '}{userData?.id}</p>
                </div>
              </div>
              <div className="flex items-center justify-between space-x-4 mt-1">
                <div className="flex items-center w-1/3">
                  <div className="w-full">
                    <div className="flex justify-between">
                      <p className="text-sm">{levelNames[levelIndex]}</p>
                      <p className="text-sm">{levelIndex + 1} <span className="text-[#95908a]">/ {levelNames.length}</span></p>
                    </div>
                    <div className="flex items-center mt-1 border-2 border-[#43433b] rounded-full">
                      <div className="w-full h-2 bg-[#43433b]/[0.6] rounded-full">
                        <div className="progress-gradient h-2 rounded-full" style={{ width: `${calculateProgress()}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
              <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px]">
                <div className="px-4 mt-6 flex justify-between gap-2">
                </div>
                <div className="px-4 mt-4 flex justify-center">
                  <div className="px-4 py-2 flex items-center space-x-2">
                    <img src={dollarCoin} alt="Dollar Coin" className="w-10 h-10" />
                    <p className="text-4xl text-white">{points.toLocaleString()}</p>
                  </div>
                </div>

                <div className="px-4 mt-4 flex justify-center">
                  <div
                    className="w-80 h-80 p-4 rounded-full circle-outer"
                    onClick={handleCardClick}
                  >
                    <div className="w-full h-full rounded-full circle-inner">
                      <img src={mainCharacter} alt="Main Character Pic" className="w-full h-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 mt-4 flex justify-center">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-full items-end"
                onClick={resetProgress}
              >
                Reset Progress
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-full"
                onClick={openShop}
              >
                Shop
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-full"
                onClick={openTonWindow}
              >
                TON
              </button>
            </div>
          </div>

          {clicks.map((click) => (
            <div
              key={click.id}
              className="absolute text-5xl font-bold opacity-0 text-white pointer-events-none"
              style={{
                top: `${click.y - 42}px`,
                left: `${click.x - 28}px`,
                animation: `float 1s ease-out`
              }}
              onAnimationEnd={() => handleAnimationEnd(click.id)}
            >
              +{pointsToAdd}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default App;
