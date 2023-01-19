const TriangleVSS = `
      //a_ attribute
      //u_ uniform
      //Используем только x и y координаты
      attribute vec2 a_position;//Создаем атрибут который будет получать данные из буффера

      //Разрешение экрана Canvas x и y
      uniform vec2 u_resolution;//Создаем uniform-переменную

      //varying vec3 FragColor;//Создаем varying переменную

      //gl_Position - специальная переменная вершинного шейдера, которая отвечает за установку позиции

      void main() {//Главная функция
           //Преобразуем положение в пикселях к диапазону от 0.0 до 1.0
           //Нормализируем координаты
           vec2 ZeroToOne = a_position / u_resolution;
        
           //Преобразуем из 0->1 в 0->2
           vec2 ZeroToTwo = ZeroToOne * 2.0;
        
           //Преобразуем из 0->2 в -1->+1 (пространство отсечения)
           vec2 ClipSpace = ZeroToTwo - 1.0;

           //В пространстве отсечения нижний левый угол имеет координаты -1, -1
           //Для WebGL положительное значение Y направлено вверх, а отрицательное - вниз.
           //gl_Position принимает пространство отсечения
           gl_Position = vec4(ClipSpace * vec2(1, -1), 0, 1);
           //Передаем во фрагментный шейдер varying переменную 
           //FragColor = vec3(VertexPosition, 0.5);

           //Задаем позицию вершины
           //gl_Position = vec4(VertexPosition, 0, 1);

           //Задаем размер точки
           //gl_PointSize = 10.0;
      }
`;