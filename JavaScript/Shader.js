//Функция создания шейдера
var CreateShader = function(WebGL, Type, Source) {
	   //Создаем новый шейдер
	   var Shader = WebGL.createShader(Type);

	   //Устанавливаем шейдеру его программный код
	   WebGL.shaderSource(Shader, Source);

	   WebGL.compileShader(Shader);//Компилируем шейдер

    //Получаем статус компиляции(успех или неудача)
    if (!WebGL.getShaderParameter(Shader, WebGL.COMPILE_STATUS)) {
        //Если произошла ошибка, возвращаем информацию о ней
        alert('Ошибка компиляции шейдера!');
        console.log('Информация о шейдере: ', WebGL.getShaderInfoLog(Shader));
        WebGL.deleteShader(Shader);//Удаляем наш шейдер
        return false;//Выходим из функции
    }

    //Успех ->
    //Возвращаем шейдер
    return Shader;
}

// Функция создания шейдерной программы
var CreateShaderProgram = function(WebGL, VertexShader, FragmentShader) {
	   //Создаем шейдерную программу
	   var ShaderProgram = WebGL.createProgram();

    //Прикрепляем оба шейдера к шейдерной программе
    WebGL.attachShader(ShaderProgram, VertexShader);
    WebGL.attachShader(ShaderProgram, FragmentShader);

    //Линкуем шейдерную программу
    WebGL.linkProgram(ShaderProgram);
    //Валидность -> проверка шейдера на соответствие требованиям
    //Проверяем валидность шейдерной программы
    WebGL.validateProgram(ShaderProgram);

    //Проверяем статус валидности
    if (!WebGL.getProgramParameter(ShaderProgram, WebGL.VALIDATE_STATUS)) {
        //Если программа невалидна, возвращаем информацию об ошибке
        console.log('Не удалось создать шейдерную программу!', WebGL.getProgramInfoLog(ShaderProgram));
        WebGL.deleteProgram(ShaderProgram);
        return false;//Выходим из функции
    }

    //Возвращаем шейдерную программу
    return ShaderProgram;
}