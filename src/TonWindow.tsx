import React from 'react';

interface TonWindowProps {
  onClose: () => void;
}

const TonWindow: React.FC<TonWindowProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black text-white flex items-center justify-center">
      <div className="flex flex-col items-center">
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-full mb-4"
          onClick={() => alert('Connect your TON wallet clicked')}
        >
          Connect your TON wallet
        </button>
        <button
          className="absolute bottom-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full"
          onClick={onClose}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default TonWindow;
