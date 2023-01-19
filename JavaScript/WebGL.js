/*WebGL позволяет веб-контенту использовать API на основе OpenGL ES 2.0 для выполнения 2D- и 3D-рендеринга
в HTML канвасе в браузерах, которые его поддерживают*/
//Объявление глобальных переменных
var WebGL;
//Массив двухмерных точек
const VertexArray = [
 //Треугольник
 10, 20,
 80, 20,
 10, 30,
 //Перевернутый треугольник
 10, 30,
 80, 20,
 80, 30,];//Рисуем два треугольника(прямоугольник)

//Инициализация WebGL
var InitWebGL = function() {
    //Получение канвас страницы
    var Canvas = document.getElementById('Canvas');//или querySelector("#Canvas")
    //Получаем WebGL контекст(WebGLRenderingContext)
    WebGL = Canvas.getContext('webgl');

    //Проверка доступен ли WebGL для текущего бразуера
    if (!WebGL) {
        //Если webGL не доступен выдаем оповещение и завершаем функцию
        alert('Ваш браузер не поддерживает технологию WebGL');
        return;
    }

    //Задание размеров холста
    Canvas.height = WebGL.canvas.clientHeight;
    Canvas.width = WebGL.canvas.clientWidth;


    //Создание обработчика события на клик
    Canvas.addEventListener('mousedown', function(Event){
           OnMouseDown(Event, Canvas);
    })

    //Задаем размер вьюпорта (области отрисовки)
    WebGL.viewport(0, 0, WebGL.canvas.width, WebGL.canvas.height);
    
    return WebGL;//Возвращаем WebGL контекст
}

//Функция инициализации WebGL шейдеров
var InitShaders = function(WebGL, TriangleVSS, TriangleFSS) 
{
    //VSS -> Vertex Shader Source
    //FSS -> Fragment Shader Source
    //Создаем шейдеры
    var TriangleVS = CreateShader(WebGL, WebGL.VERTEX_SHADER, TriangleVSS);
    var TriangleFS = CreateShader(WebGL, WebGL.FRAGMENT_SHADER, TriangleFSS);

    //Создаем шейдерную программу на основе вершинного и фрагментного шейдера
    var TriangleSP = CreateShaderProgram(WebGL, TriangleVS, TriangleFS);
    return TriangleSP;
}

//Рисование
var Render = function(ShaderProgram) {
    //Необходимо снабдить видеокарту данными
    //Получаем позиции атрибутов шейдерной программы
    var PositionAttributeLocation = WebGL.getAttribLocation(ShaderProgram, "a_position");
    var ResolutionUniformLocation = WebGL.getUniformLocation(ShaderProgram, "u_resolution");
    var ColorUniformLocation = WebGL.getUniformLocation(ShaderProgram, "u_color");

    //Нужно создать буффер т.е атрибуты в шейдерах получает данных от буфферов
    var VertexBuffer = WebGL.createBuffer();

    //Задаем точку связывания (наш буфер будет содержать вершинные атрибуты)
    WebGL.bindBuffer(WebGL.ARRAY_BUFFER, VertexBuffer);

    //Помещаем в буфер массив данных
    //WebGL нужны строго типизированные данные Float32Array(массив с 32 битными данными с плавающей точкой)
    WebGL.bufferData(WebGL.ARRAY_BUFFER, new Float32Array(VertexArray), WebGL.STATIC_DRAW);
    //Мы также можем легко обновить данные буффера приписав это же функцию с новыми координатами
    //Все данные будет приклеплены к точке связи ARRAY_BUFFER
    //STATIC_DRAW -> эти данные не будут подлежать изменению(оптимизация)

    //Функция для того, чтобы количество пикселей Canvas совпадало с размером HTML страницы
    webglUtils.resizeCanvasToDisplaySize(WebGL.canvas);

    WebGL.viewport(0, 0, WebGL.canvas.width, WebGL.canvas.height);//Устанавливаем область видимости(координат)

    //Задаем цвет заднего фона(голубой)
    WebGL.clearColor(0.75, 0.9, 1.0, 1.0);
    //Очищаем буферы цвета и глубины
    WebGL.clear(WebGL.COLOR_BUFFER_BIT | WebGL.DEPTH_BUFFER_BIT);
    //Сообщаем браузеру что необходимо проверять глубину каждого пикселя
    WebGL.enable(WebGL.DEPTH_TEST);//Включаем тест грубины

    //Используем шейдерную программу
    WebGL.useProgram(ShaderProgram);

    WebGL.enableVertexAttribArray(PositionAttributeLocation);//Включаем вершинный атрибут
    //Теперь нужно сказать WebGL, как извлечь данные из буфера, который мы настроили ранее,
    //и передать их в атрибут шейдера.
    //Привязываем фершинный буффер
    WebGL.bindBuffer(WebGL.ARRAY_BUFFER, VertexBuffer);
 
    //Указываем атрибуту, как получать данные от VertexBuffer(ARRAY_BUFFER)
    var size = 2;          //Мы передаем только первые два параметры в шейдере -> потому и размер таков
    var type = WebGL.FLOAT;   //наши данные - 32-битные числа с плавающей точкой
    var normalize = false; //не нормализовать данные
    var stride = 0;        //0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего
//положения
    var offset = 0;        //начинать с начала буффера(смещение -> 0)
    //Добиваемся цели указав все определенные ранее параметры
    WebGL.vertexAttribPointer(PositionAttributeLocation, size, type, normalize, stride, offset);
    //мы теперь можем свободно привязать что-нибудь другое к точке связи ARRAY_BUFFER,
    //но атрибут останется привязанным к positionBuffer.
    //////////////////////////////////////////////////////////////////////////////////
    //Определяем uniform-переменную
    WebGL.uniform2f(ResolutionUniformLocation, WebGL.canvas.width, WebGL.canvas.height);
    //Math.random() -> генерирует случайное число в диапозоне от 0 до 1
    //randomInt(10) -> генерирует случайное число в диапозоне от 0 до указанного значения(10)
    //Устанавливаем кнопке цвет
    WebGL.uniform4f(ColorUniformLocation, Math.random(), Math.random(), Math.random(), 1);

    var PrimitiveType = WebGL.TRIANGLES;//Устанавливаем треугольник в качестве нужного нам примитива
    var offset = 0;//смещение ноль
    var VertexCount = 6;//Обрабатываем 6 вершин
    //Все вершины поочередно обрабатываются и превращаются из обычных в ClipSpace
    WebGL.drawArrays(PrimitiveType, offset, VertexCount);
    //Далее пространство отсечения преобразуется в экранные координаты
}

//Функция клика
function OnMouseDown(Event, Canvas) {
         console.log("clicked");
}