// возвращает webix конфигурации таба для работы с проектами
export default function ProjectsView(){
    return {
        rows:[
            { 
                view:"search",
                id: "projectsSearch",
                placeholder:"Поиск по названию проекта...", 
                align: 'center',
                width:600 
            },
            {
                cols:[
                    {},
                {
                    view:"dataview",
                    id: "projectsDataview",
                    width:"auto",
                    borderless:false,
                    xCount: 3,
                    css: "movies",
                    select: "true",
                    type:{
                        width: 300,
                        height: 250,
                        template:
                        function(obj){
                            // расчет яркости и цвета фона карточки проекта и последдующий выбор цвета шрифта (белый или черный)
                            // разделение цветов проекта в rgb на компоненты green, red и blue
                            let redOne = obj.color_one.slice(1, 3).toLowerCase()
                            let greenOne = obj.color_one.slice(3, 5).toLowerCase()
                            let blueOne = obj.color_one.slice(5, 7).toLowerCase()
                            let redTwo = obj.color_two.slice(1, 3).toLowerCase()
                            let greenTwo = obj.color_two.slice(3, 5).toLowerCase()
                            let blueTwo = obj.color_two.slice(5, 7).toLowerCase()
                            
                            // алфавит 16-ричной системы счисления
                            var bar = "0123456789abcdef";
                            var system = 16;

                            //переменные для компонентов green, red и blue в десятиричной системе счисления
                            var redDecimalOne = 0;
                            var greenDecimalOne = 0;
                            var blueDecimalOne = 0;
                            var redDecimalTwo = 0;
                            var greenDecimalTwo = 0;
                            var blueDecimalTwo = 0;

                            // перевод компонентов green, red и blue из 16-ричной системы счисления в 10-ричную систему счисления
                            for(let i = 0; i < redOne.length; i++) {
                                redDecimalOne += bar.indexOf(redOne[i]) * Math.pow(system, redOne.length - i - 1);
                                greenDecimalOne += bar.indexOf(greenOne[i]) * Math.pow(system, greenOne.length - i - 1);
                                blueDecimalOne += bar.indexOf(blueOne[i]) * Math.pow(system, blueOne.length - i - 1);
                                redDecimalTwo += bar.indexOf(redTwo[i]) * Math.pow(system, redTwo.length - i - 1);
                                greenDecimalTwo += bar.indexOf(greenTwo[i]) * Math.pow(system, greenTwo.length - i - 1);
                                blueDecimalTwo += bar.indexOf(blueTwo[i]) * Math.pow(system, blueTwo.length - i - 1);
                            }
                            
                            // расчет яркости компонентов green, red и blue путем умножения их 10-ричного представления на специальный коэффициент
                            let redLightOne = redDecimalOne * 0.2126;
                            let greenLightOne =  greenDecimalOne * 0.7152;
                            let blueLightOne = blueDecimalOne * 0.0722;
                            let redLightTwo = redDecimalTwo * 0.2126;
                            let greenLightTwo =  greenDecimalTwo * 0.7152;
                            let blueLightTwo = blueDecimalTwo * 0.0722;
                            
                            // расчет яркости цветов проекта
                            let perceivedLightnessOne = (redLightOne + greenLightOne + blueLightOne) / 255;
                            let perceivedLightnessTwo = (redLightTwo + greenLightTwo + blueLightTwo) / 255;

                            // граничное значение яркости для "светлых" цветов
                            let threshold = 0.5;

                            // параметр светлоты для представления цвета в модели hsl
                            let paramOne = (perceivedLightnessOne - threshold) * -10000000; 
                            let paramTwo = (perceivedLightnessTwo - threshold) * -10000000; 

                            return "<div class='overall' style='background: linear-gradient(-45deg, " + obj.color_one + "," + obj.color_two + ")'>" + 
                            "<div class='title' style='color: hsl(0, 0%," + paramTwo + "%)'> " + obj.name + "</div></br>" + 
                            "<div class='description' style='color: hsl(0, 0%," + paramTwo + "%)'> " + obj.description + "</div></br>" + 
                            "<div class='teamlead' style='color: hsl(0, 0%," + paramOne + "%)'>Teamlead: </br>" + obj.teamlead_last_name + " " + obj.teamlead_name + "</div></div>"
                        }  
                    },
                    data:[]
                },
                {}   
            ],
            }
        ]
}
}