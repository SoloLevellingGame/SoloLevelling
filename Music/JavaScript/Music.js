'use strict';//Включаем строгий режим(strict mode). К синтаксису языка будет больше внимания.

//Количество семплов в одной секунде
//Сэмпл - относительно небольшой оцифрованный звуковой фрагмент.
const SAMPLE_FREQUENCY = 44100;//Частота дискретизации(повторение, различие волн)
//Максимальная амплитуда волны
const MAX_AMPLITUDE = 22000;
//Амплиту́да — максимальное значение смещения или изменения переменной величины от среднего значения при
//колебательном или волновом движении.
//Число Pi
const PI = Math.PI;
const PI_2 = PI*2;

//millisecond - длинна буффера в милиссекундах
//Int16Array - подготовленный буффер
function CreateBuffer(Millisecond) {//Создание буфера данных
    let WaveBytes = SAMPLE_FREQUENCY * 4 * Millisecond / 1000;
    return new Int16Array(new ArrayBuffer(WaveBytes));
}

//buffer - Буффер в который производится запись
//Audio - Объект 'Audio'
function CreateAudio(buffer) {//Создание объекта Audio с Wave Data переданным в buffer
    let bufferLen = buffer.length,
        audioData = [],
        fromCharCode = String.fromCharCode;
    
    for (let i = 0; i < bufferLen; i++) {
        let b = buffer[i] / MAX_AMPLITUDE * 0x7800;
        audioData.push(fromCharCode(b & 255, (b >> 8) & 255));
    }
    
    return new Audio('data:audio/wav;base64,' + 
        btoa(atob('UklGRti/UABXQVZFZm10IBAAAAABA' + 
                  'AIARKwAABCxAgAEABAAZGF0YbS/UAA') +
                    audioData.join('')));
}

//Int16Array} buffer Буффер Wave данных
//start - Место начала сигнага
//length - Длинна сигнала
//freq - Частота сигнала
//volume - Громкость сигнала (От 0 до 1)
//func - Функция - форма волны
//Возвращается Int16Array - буффер Wave данных
function SynthTone(buffer, start, length, freq, volume, func) {//Синтез тона
    start = start * SAMPLE_FREQUENCY * 2;
    length = length * SAMPLE_FREQUENCY * 2;
    freq = freq / SAMPLE_FREQUENCY;
    volume = volume * 32767;
    
    for (let i = 0; i < length; i++) {
        buffer[start + i] = func(start + i, freq) * volume;
    }
    
    return buffer;
}

//Форма волны

//index - Номер текущего фрейма
//frequency Частота сигнала
//Возвращаем значение сигнала в момент времени
function Sin(index, frequency) {//Синусоидальная функция волны
    return Math.sin(PI_2 * frequency * index);
}

//index - Номер текущего фрейма
//frequency - Частота сигнала
//Возвращается значение сигнала в момент времени
function Saw(index, frequency) {//Пилообразная функция волны
    return 2.0 * (index * frequency - 
                Math.floor(index * frequency )) - 1.0;
}

//index - Номер текущего фрейма
//frequency Частота сигнала
//return - значение сигнала в момент времени
function Triangle(index, frequency) {//Треугольная функция волны
    return 2.0 * Math.abs(2.0 * 
            (index * frequency -
            Math.floor(index * frequency + 0.5))) - 1.0;
}
 
//index - Номер текущего фрейма
//frequency - Частота сигнала
//Возвращаем значение сигнала в момент времени
function Flat(index, frequency) {//Прямоугольная функция волны
    return (Math.sin(frequency * index ) > 0) ? 1 : -1;
}

//Возвращается значение сигнала в момент времени
function Noise() {//Функция волны типа "Шум"
    return Math.random();
}
//Ноты

//key - Номер ноты
//octave - Номер октавы
//Частота сигнала
function NoteToFreq(key, octave) {//Опредиление частоты звучания ноты по ее номеру и октаве
    if (!key) return 0;
	   return 27.5 * Math.pow(2, (key + octave * 12.0) / 12.0);
}

//Опредиление частоты звучания ноты по ее строчной записи
//str - Строчная запись ноты
//Возвратное значение - частота сигнала
function GetNote(str) {//Опредиление частоты звучания ноты по ее строчной записи
    let symb = ['C-', 'C#', 'D-', 'D#', 'E-', 'F-', 
                'F#', 'G-', 'G#', 'A-', 'A#', 'B-'],
        note = symb.indexOf(str.substr(0, 2)),
        octave = parseInt(str.substr(2, 1), 10);
    
    return NoteToFreq(note + 1, octave);
}

//Синтезатор — электронный клавишный музыкальный инструмент.
function SynthAndPlay() {//Синтезируем тон и воспроизводим
    //Создаем буффер длинной в 10 сек
    let Buffer = CreateBuffer(10000), 
        //Получаем частоту ноты ДО 3-ей октавы
        Note = GetNote('C-3'),//Нота
        Volume = 0.1;//Грмкость

    //Синтез тона
    SynthTone(Buffer, 0, 1, Note, Volume, Sin);//Синусоидальная волна
    SynthTone(Buffer, 2, 1, Note, Volume, Saw);//Пилообразная волна
    SynthTone(Buffer, 4, 1, Note, Volume, Triangle);//Треугольная волна
    SynthTone(Buffer, 6, 1, Note, Volume, Flat);//Прямоугольная волна
    SynthTone(Buffer, 8, 1, Note, Volume, Noise);//Шум

    CreateAudio(Buffer).play();//Воспроизводим буффер
}

let PlayButton = document.createElement('button');//Создаем кнопку
PlayButton.innerText = 'Play';//Указываем текст кнопке
PlayButton.addEventListener('click', SynthAndPlay);//По нажатию на кнопку будет воспроизводится звук
document.body.appendChild(PlayButton);//Добавляем элемент на страницу