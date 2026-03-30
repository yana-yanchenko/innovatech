'use client';

import React from 'react';

interface SproutAnimationProps {
  progress: number;
  color?: string;
}

export default function SproutAnimation({ progress, color = '#4CAF50' }: SproutAnimationProps) {
  // Линейный цвет для всех элементов
  const lineColor = color;

  // СТАДИИ РОСТА (технологичный стиль):
  // 0.0 - 0.2: Семя (технологичная структура)
  // 0.2 - 0.5: Рост стебля (многослойная структура)
  // 0.5 - 0.75: Листья (псевдо-3D)
  // 0.75 - 1.0: Цветок (сложная геометрия)

  // Вычисляем значения напрямую из progress
  const currentProgress = Math.max(0, Math.min(1, progress));

  // 1. Семя (0.0 - 0.2)
  const seedVisible = currentProgress < 0.25;
  const seedPulseScale = 1 + Math.sin(currentProgress * 20) * 0.03;

  // 2. Стебель (0.2 - 0.5)
  const stemLength = currentProgress < 0.2 ? 0 : currentProgress < 0.5 ? (currentProgress - 0.2) / 0.3 : 1;

  // 3. Листья (0.5 - 0.75)
  const leavesVisible = currentProgress < 0.5 ? 0 : currentProgress < 0.75 ? (currentProgress - 0.5) / 0.25 : 1;

  // 4. Цветок (0.75 - 1.0)
  const flowerVisible = currentProgress < 0.75 ? 0 : (currentProgress - 0.75) / 0.25;

  // Технологичные элементы
  const scanLinePosition = 145 - (currentProgress * 115);
  const gridVisible = 0.15 + (Math.sin(currentProgress * Math.PI) * 0.2);
  const structureVisible = currentProgress > 0.25 ? Math.min(1, (currentProgress - 0.25) / 0.2) : 0;

  // Для 3D эффекта
  const perspective = 0.3; // Коэффициент перспективы

  return (
    <div className="w-full h-full flex items-center justify-center relative bg-muted/10 rounded-[2rem] overflow-hidden">
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Фоновая сетка - более плотная */}
        <g opacity={gridVisible}>
          {[20, 40, 60, 80, 100, 120, 140, 160, 180].map((x) => (
            <line
              key={`v-${x}`}
              x1={x}
              y1="0"
              x2={x}
              y2="200"
              stroke={lineColor}
              strokeWidth="0.15"
              opacity="0.08"
            />
          ))}
          {[20, 40, 60, 80, 100, 120, 140, 160].map((y) => (
            <line
              key={`h-${y}`}
              x1="0"
              y1={y}
              x2="200"
              y2={y}
              stroke={lineColor}
              strokeWidth="0.15"
              opacity="0.08"
            />
          ))}
        </g>

        {/* Линия уровня земли с технологичными маркерами */}
        <line
          x1="0"
          y1="145"
          x2="200"
          y2="145"
          stroke={lineColor}
          strokeWidth="0.8"
          opacity="0.4"
          strokeDasharray="5 3"
        />
        {/* Маркеры на линии земли */}
        {[30, 60, 90, 120, 150, 170].map((x) => (
          <line
            key={`ground-${x}`}
            x1={x}
            y1="143"
            x2={x}
            y2="147"
            stroke={lineColor}
            strokeWidth="0.5"
            opacity="0.3"
          />
        ))}

        {/* Семя - технологичная структура */}
        {seedVisible && (
          <g opacity={1 - currentProgress * 4}>
            {/* Внешние кольца */}
            {[12, 10, 8, 6].map((r, i) => (
              <circle
                key={`seed-ring-${i}`}
                cx="100"
                cy="160"
                r={r * seedPulseScale}
                fill="none"
                stroke={lineColor}
                strokeWidth="0.4"
                opacity={0.3 - i * 0.05}
              />
            ))}
            {/* Внутренняя структура */}
            <circle cx="100" cy="160" r="3" fill="none" stroke={lineColor} strokeWidth="0.6" opacity="0.6" />
            {/* Лучи от центра */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
              const rad = (angle * Math.PI) / 180;
              const x = 100 + Math.cos(rad) * 5;
              const y = 160 + Math.sin(rad) * 5;
              return (
                <line
                  key={`seed-ray-${angle}`}
                  x1="100"
                  y1="160"
                  x2={x}
                  y2={y}
                  stroke={lineColor}
                  strokeWidth="0.3"
                  opacity="0.4"
                />
              );
            })}
          </g>
        )}

        {/* Стебель - многослойная структура */}
        {stemLength > 0 && (
          <g>
            {/* Центральная линия (толще) */}
            <path
              d="M 100 160 C 98 140, 102 120, 100 100 C 98 80, 102 60, 100 30"
              stroke={lineColor}
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
              strokeDasharray="130"
              strokeDashoffset={130 * (1 - stemLength)}
            />

            {/* Параллельные структурные линии (тоньше) */}
            {[-3, -1.5, 1.5, 3].map((offset, i) => (
              <path
                key={`stem-line-${i}`}
                d={`M ${100 + offset} 160 C ${98 + offset} 140, ${102 + offset} 120, ${100 + offset} 100 C ${98 + offset} 80, ${102 + offset} 60, ${100 + offset} 30`}
                stroke={lineColor}
                strokeWidth="0.3"
                strokeLinecap="round"
                fill="none"
                opacity={0.25}
                strokeDasharray="130"
                strokeDashoffset={130 * (1 - stemLength)}
              />
            ))}

            {/* Диагональные пересекающиеся линии для структуры */}
            {stemLength > 0.3 && (
              <>
                {[140, 120, 100, 80, 60, 40].map((y, i) => (
                  <g key={`cross-${i}`} opacity={structureVisible * 0.2}>
                    <line x1="97" y1={y} x2="103" y2={y - 5} stroke={lineColor} strokeWidth="0.2" />
                    <line x1="103" y1={y} x2="97" y2={y - 5} stroke={lineColor} strokeWidth="0.2" />
                  </g>
                ))}
              </>
            )}
          </g>
        )}

        {/* Структурные узлы на стебле - более детализированные */}
        {structureVisible > 0 && (
          <g opacity={structureVisible}>
            {[140, 120, 100, 80, 60, 40].map((y, i) => (
              <g key={`node-${i}`}>
                {/* Концентрические кольца */}
                <circle cx="100" cy={y} r="1.5" fill="none" stroke={lineColor} strokeWidth="0.5" opacity="0.5" />
                <circle cx="100" cy={y} r="3" fill="none" stroke={lineColor} strokeWidth="0.3" opacity="0.3" />
                <circle cx="100" cy={y} r="5" fill="none" stroke={lineColor} strokeWidth="0.2" opacity="0.2" />
                {/* Крестообразные маркеры */}
                <line x1="95" y1={y} x2="105" y2={y} stroke={lineColor} strokeWidth="0.3" opacity="0.3" />
                <line x1="100" y1={y - 5} x2="100" y2={y + 5} stroke={lineColor} strokeWidth="0.3" opacity="0.3" />
              </g>
            ))}
          </g>
        )}

        {/* Листья - псевдо-3D структура */}
        {leavesVisible > 0 && (
          <>
            {/* Нижний уровень листьев (y=95) */}
            {/* Левый лист с 3D эффектом */}
            <g opacity={leavesVisible} transform="translate(100, 95)">
              {/* Передний край листа (основной контур) */}
              <path
                d="M 0 0 C -18 -3, -32 -10, -35 -22 C -32 -15, -20 -8, 0 0"
                stroke={lineColor}
                strokeWidth="0.8"
                fill="none"
                opacity="0.7"
                strokeDasharray="60"
                strokeDashoffset={60 * (1 - leavesVisible)}
              />
              {/* Задний край (смещенный для 3D) */}
              <path
                d="M 0 0 C -16 -4, -28 -12, -30 -23 C -28 -17, -18 -10, 0 0"
                stroke={lineColor}
                strokeWidth="0.4"
                fill="none"
                opacity="0.3"
                strokeDasharray="55"
                strokeDashoffset={55 * (1 - leavesVisible)}
              />
              {/* Прожилки (множественные) */}
              {[0.3, 0.5, 0.7, 0.9].map((t, i) => {
                const x = -35 * t;
                const y = -22 * t;
                return (
                  <line
                    key={`left-vein-${i}`}
                    x1="0"
                    y1="0"
                    x2={x}
                    y2={y}
                    stroke={lineColor}
                    strokeWidth="0.2"
                    opacity="0.3"
                  />
                );
              })}
              {/* Края листа (дополнительные линии) */}
              <path
                d="M -10 -5 Q -15 -8, -18 -12"
                stroke={lineColor}
                strokeWidth="0.25"
                opacity="0.25"
              />
            </g>

            {/* Правый лист с 3D эффектом */}
            <g opacity={leavesVisible} transform="translate(100, 95)">
              {/* Передний край */}
              <path
                d="M 0 0 C 18 -3, 32 -10, 35 -22 C 32 -15, 20 -8, 0 0"
                stroke={lineColor}
                strokeWidth="0.8"
                fill="none"
                opacity="0.7"
                strokeDasharray="60"
                strokeDashoffset={60 * (1 - leavesVisible)}
              />
              {/* Задний край */}
              <path
                d="M 0 0 C 16 -4, 28 -12, 30 -23 C 28 -17, 18 -10, 0 0"
                stroke={lineColor}
                strokeWidth="0.4"
                fill="none"
                opacity="0.3"
                strokeDasharray="55"
                strokeDashoffset={55 * (1 - leavesVisible)}
              />
              {/* Прожилки */}
              {[0.3, 0.5, 0.7, 0.9].map((t, i) => {
                const x = 35 * t;
                const y = -22 * t;
                return (
                  <line
                    key={`right-vein-${i}`}
                    x1="0"
                    y1="0"
                    x2={x}
                    y2={y}
                    stroke={lineColor}
                    strokeWidth="0.2"
                    opacity="0.3"
                  />
                );
              })}
            </g>

            {/* Верхний уровень листьев (y=70) - меньше */}
            <g opacity={leavesVisible} transform="translate(100, 70)">
              {/* Левый */}
              <path
                d="M 0 0 C -14 -2, -25 -7, -28 -16 C -25 -11, -15 -6, 0 0"
                stroke={lineColor}
                strokeWidth="0.6"
                fill="none"
                opacity="0.6"
                strokeDasharray="45"
                strokeDashoffset={45 * (1 - leavesVisible)}
              />
              <path
                d="M 0 0 C -12 -3, -22 -9, -24 -17 C -22 -13, -13 -7, 0 0"
                stroke={lineColor}
                strokeWidth="0.3"
                fill="none"
                opacity="0.25"
              />
              {[0.4, 0.7].map((t, i) => {
                const x = -28 * t;
                const y = -16 * t;
                return (
                  <line
                    key={`upper-left-vein-${i}`}
                    x1="0"
                    y1="0"
                    x2={x}
                    y2={y}
                    stroke={lineColor}
                    strokeWidth="0.2"
                    opacity="0.25"
                  />
                );
              })}
            </g>

            <g opacity={leavesVisible} transform="translate(100, 70)">
              {/* Правый */}
              <path
                d="M 0 0 C 14 -2, 25 -7, 28 -16 C 25 -11, 15 -6, 0 0"
                stroke={lineColor}
                strokeWidth="0.6"
                fill="none"
                opacity="0.6"
                strokeDasharray="45"
                strokeDashoffset={45 * (1 - leavesVisible)}
              />
              <path
                d="M 0 0 C 12 -3, 22 -9, 24 -17 C 22 -13, 13 -7, 0 0"
                stroke={lineColor}
                strokeWidth="0.3"
                fill="none"
                opacity="0.25"
              />
              {[0.4, 0.7].map((t, i) => {
                const x = 28 * t;
                const y = -16 * t;
                return (
                  <line
                    key={`upper-right-vein-${i}`}
                    x1="0"
                    y1="0"
                    x2={x}
                    y2={y}
                    stroke={lineColor}
                    strokeWidth="0.2"
                    opacity="0.25"
                  />
                );
              })}
            </g>

            {/* Самый верхний уровень (y=50) - еще меньше */}
            <g opacity={leavesVisible * 0.8} transform="translate(100, 50)">
              <path
                d="M 0 0 C -10 -1, -18 -4, -20 -10"
                stroke={lineColor}
                strokeWidth="0.5"
                fill="none"
                opacity="0.5"
              />
              <path
                d="M 0 0 C 10 -1, 18 -4, 20 -10"
                stroke={lineColor}
                strokeWidth="0.5"
                fill="none"
                opacity="0.5"
              />
            </g>
          </>
        )}

        {/* Цветок - сложная 3D геометрия */}
        {flowerVisible > 0 && (
          <g opacity={flowerVisible} transform="translate(100, 30)">
            {/* 8 лепестков с псевдо-3D эффектом */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x1 = Math.cos(rad) * 6;
              const y1 = Math.sin(rad) * 6;
              const x2 = Math.cos(rad) * 16;
              const y2 = Math.sin(rad) * 16;

              // 3D смещение для заднего края
              const perspectiveShift = 0.3;
              const x1b = Math.cos(rad) * 5.5 + perspectiveShift;
              const y1b = Math.sin(rad) * 5.5 + perspectiveShift;
              const x2b = Math.cos(rad) * 15 + perspectiveShift;
              const y2b = Math.sin(rad) * 15 + perspectiveShift;

              return (
                <g key={`petal-${i}`}>
                  {/* Задний край лепестка (тоньше, прозрачнее) */}
                  <path
                    d={`M 0 0 Q ${x1b * 1.2} ${y1b * 1.2}, ${x2b} ${y2b}`}
                    stroke={lineColor}
                    strokeWidth="0.3"
                    fill="none"
                    opacity="0.2"
                  />

                  {/* Центральная линия лепестка (основная) */}
                  <line
                    x1="0"
                    y1="0"
                    x2={x2}
                    y2={y2}
                    stroke={lineColor}
                    strokeWidth="0.8"
                    opacity="0.6"
                  />

                  {/* Передний край лепестка (левый) */}
                  <path
                    d={`M ${x1} ${y1} Q ${x1 * 1.3 - y1 * 0.4} ${y1 * 1.3 + x1 * 0.4}, ${x2 - y2 * 0.2} ${y2 + x2 * 0.2}`}
                    stroke={lineColor}
                    strokeWidth="0.5"
                    fill="none"
                    opacity="0.5"
                  />

                  {/* Передний край лепестка (правый) */}
                  <path
                    d={`M ${x1} ${y1} Q ${x1 * 1.3 + y1 * 0.4} ${y1 * 1.3 - x1 * 0.4}, ${x2 + y2 * 0.2} ${y2 - x2 * 0.2}`}
                    stroke={lineColor}
                    strokeWidth="0.5"
                    fill="none"
                    opacity="0.5"
                  />

                  {/* Внутренние структурные линии */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2 * 0.6}
                    y2={y2 * 0.6}
                    stroke={lineColor}
                    strokeWidth="0.2"
                    opacity="0.3"
                  />
                </g>
              );
            })}

            {/* Внутренние слои цветка */}
            {[10, 8, 6].map((radius, i) => (
              <circle
                key={`inner-${i}`}
                cx="0"
                cy="0"
                r={radius}
                fill="none"
                stroke={lineColor}
                strokeWidth="0.4"
                opacity={0.4 - i * 0.1}
              />
            ))}

            {/* Центр цветка - сложная структура */}
            <g>
              {/* Концентрические кольца */}
              <circle cx="0" cy="0" r="5" fill="none" stroke={lineColor} strokeWidth="0.6" opacity="0.6" />
              <circle cx="0" cy="0" r="3.5" fill="none" stroke={lineColor} strokeWidth="0.4" opacity="0.5" />
              <circle cx="0" cy="0" r="2" fill="none" stroke={lineColor} strokeWidth="0.3" opacity="0.4" />

              {/* Радиальные линии в центре */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
                const rad = (angle * Math.PI) / 180;
                const x = Math.cos(rad) * 4;
                const y = Math.sin(rad) * 4;
                return (
                  <line
                    key={`center-ray-${angle}`}
                    x1="0"
                    y1="0"
                    x2={x}
                    y2={y}
                    stroke={lineColor}
                    strokeWidth="0.2"
                    opacity="0.3"
                  />
                );
              })}

              {/* Центральная точка */}
              <circle cx="0" cy="0" r="1" fill={lineColor} opacity="0.6" />
            </g>

            {/* Внешние технологичные маркеры вокруг цветка */}
            {[0, 90, 180, 270].map((angle) => {
              const rad = (angle * Math.PI) / 180;
              const x = Math.cos(rad) * 20;
              const y = Math.sin(rad) * 20;
              return (
                <g key={`marker-${angle}`} opacity="0.2">
                  <circle cx={x} cy={y} r="2" fill="none" stroke={lineColor} strokeWidth="0.3" />
                  <line x1={x * 0.85} y1={y * 0.85} x2={x * 1.15} y2={y * 1.15} stroke={lineColor} strokeWidth="0.2" />
                </g>
              );
            })}
          </g>
        )}

        {/* Линия сканирования - более технологичная */}
        <g transform={`translate(0, ${scanLinePosition})`} opacity="0.6">
          {/* Основная линия */}
          <line
            x1="5"
            x2="195"
            y1="0"
            y2="0"
            stroke={lineColor}
            strokeWidth="0.6"
            opacity="0.5"
          />
          {/* Верхняя параллельная */}
          <line
            x1="5"
            x2="195"
            y1="-1.5"
            y2="-1.5"
            stroke={lineColor}
            strokeWidth="0.2"
            opacity="0.3"
          />
          {/* Нижняя параллельная */}
          <line
            x1="5"
            x2="195"
            y1="1.5"
            y2="1.5"
            stroke={lineColor}
            strokeWidth="0.2"
            opacity="0.3"
          />
          {/* Маркеры на линии сканирования */}
          {[20, 50, 100, 150, 180].map((x) => (
            <circle
              key={`scan-marker-${x}`}
              cx={x}
              cy="0"
              r="1.5"
              fill="none"
              stroke={lineColor}
              strokeWidth="0.3"
              opacity="0.4"
            />
          ))}
        </g>

        {/* Измерительные маркеры - более детализированные */}
        <g opacity={gridVisible}>
          {/* Левая шкала */}
          <line x1="8" y1="30" x2="8" y2="145" stroke={lineColor} strokeWidth="0.4" opacity="0.3" />
          {[30, 50, 70, 90, 110, 130, 145].map((y) => (
            <g key={`left-tick-${y}`}>
              <line x1="6" y1={y} x2="10" y2={y} stroke={lineColor} strokeWidth="0.4" opacity="0.3" />
              <line x1="10" y1={y} x2="13" y2={y} stroke={lineColor} strokeWidth="0.2" opacity="0.2" />
            </g>
          ))}

          {/* Правая шкала */}
          <line x1="192" y1="30" x2="192" y2="145" stroke={lineColor} strokeWidth="0.4" opacity="0.3" />
          {[30, 50, 70, 90, 110, 130, 145].map((y) => (
            <g key={`right-tick-${y}`}>
              <line x1="190" y1={y} x2="194" y2={y} stroke={lineColor} strokeWidth="0.4" opacity="0.3" />
              <line x1="187" y1={y} x2="190" y2={y} stroke={lineColor} strokeWidth="0.2" opacity="0.2" />
            </g>
          ))}

          {/* Угловые маркеры */}
          {[[8, 30], [8, 145], [192, 30], [192, 145]].map(([x, y], i) => (
            <circle
              key={`corner-${i}`}
              cx={x}
              cy={y}
              r="2"
              fill="none"
              stroke={lineColor}
              strokeWidth="0.3"
              opacity="0.3"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
