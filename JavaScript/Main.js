function main()//Главная функция
{
         var WebGL = InitWebGL();//Инициализируем WebGL
         //Инициализаруем ресурсы при полной загрузке страницы
         var ShaderProgram = InitShaders(WebGL, TriangleVSS, TriangleFSS);
         Render(ShaderProgram);//Рисование
}
window.onload = main;//Вызывается при загрузке всех элементов