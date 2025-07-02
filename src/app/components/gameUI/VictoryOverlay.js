import React from "react";
import { Trophy, Star, Target, Clock, Users } from "lucide-react";

export default function VictoryOverlay({ isVisible, onClose, gameStats = {} }) {
  if (!isVisible) return null;

  const {
    turnsPlayed = 0,
    totalPiecesBuilt = 0,
    settlementsBuilt = 0,
    resourcesGathered = 0,
    hostilesPieces = 0,
    hostileFortressesDestroyed = 1,
  } = gameStats;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-yellow-900 via-amber-800 to-yellow-700 rounded-2xl border-4 border-yellow-400 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-600 to-amber-600 p-6 rounded-t-xl border-b-4 border-yellow-400">
          <div className="text-center">
            <Trophy className="w-20 h-20 text-yellow-200 mx-auto mb-4 animate-bounce" />
            <h1 className="text-4xl font-bold text-yellow-100 mb-2">
              VICTORY ACHIEVED!
            </h1>
            <p className="text-xl text-yellow-200">
              You have successfully eliminated all hostile fortresses!
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Congratulations Message */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-yellow-100 mb-4">
              Congratulations, Commander!
            </h2>
            <p className="text-lg text-yellow-200 leading-relaxed">
              Your strategic leadership and tactical prowess have secured this
              hostile planet for humanity. The threat has been neutralized, and
              your colony can now thrive in peace.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-black bg-opacity-30 rounded-lg p-4 border-2 border-yellow-600">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6 text-yellow-300" />
                <span className="text-yellow-200 font-semibold">Turns</span>
              </div>
              <div className="text-2xl font-bold text-yellow-100">
                {turnsPlayed}
              </div>
            </div>

            <div className="bg-black bg-opacity-30 rounded-lg p-4 border-2 border-yellow-600">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6 text-yellow-300" />
                <span className="text-yellow-200 font-semibold">
                  Units Built
                </span>
              </div>
              <div className="text-2xl font-bold text-yellow-100">
                {totalPiecesBuilt}
              </div>
            </div>

            <div className="bg-black bg-opacity-30 rounded-lg p-4 border-2 border-yellow-600">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-6 h-6 text-yellow-300" />
                <span className="text-yellow-200 font-semibold">
                  Settlements
                </span>
              </div>
              <div className="text-2xl font-bold text-yellow-100">
                {settlementsBuilt}
              </div>
            </div>

            <div className="bg-black bg-opacity-30 rounded-lg p-4 border-2 border-yellow-600">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6 text-yellow-300" />
                <span className="text-yellow-200 font-semibold">
                  Fortresses Destroyed
                </span>
              </div>
              <div className="text-2xl font-bold text-yellow-100">
                {hostileFortressesDestroyed}
              </div>
            </div>

            <div className="bg-black bg-opacity-30 rounded-lg p-4 border-2 border-yellow-600 md:col-span-2">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-6 h-6 text-yellow-300" />
                <span className="text-yellow-200 font-semibold">
                  Resources Gathered
                </span>
              </div>
              <div className="text-2xl font-bold text-yellow-100">
                {resourcesGathered}
              </div>
            </div>
          </div>

          {/* Performance Rating */}
          <div className="bg-black bg-opacity-30 rounded-lg p-6 border-2 border-yellow-600 mb-8">
            <h3 className="text-xl font-bold text-yellow-100 mb-4 text-center">
              Mission Performance
            </h3>
            <div className="flex justify-center items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-8 h-8 ${
                    star <=
                    Math.min(5, Math.max(1, 6 - Math.floor(turnsPlayed / 10)))
                      ? "text-yellow-300 fill-yellow-300"
                      : "text-gray-500"
                  }`}
                />
              ))}
            </div>
            <p className="text-center text-yellow-200 mt-2">
              {turnsPlayed <= 20
                ? "Outstanding Leadership!"
                : turnsPlayed <= 40
                ? "Excellent Strategy!"
                : turnsPlayed <= 60
                ? "Good Command!"
                : "Mission Accomplished!"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => (window.location.href = "/menu")}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Return to Menu
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Play Again
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Continue Viewing
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
