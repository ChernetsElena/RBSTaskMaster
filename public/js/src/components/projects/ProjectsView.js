
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
                    width:1400,
                    minWidth:1400,
                    maxWidth:1400,
                    borderless:false,
                    xCount: 3,
                    css: "movies",
                    select: "true",
                    type:{
                        width: 300,
                        height: 250,
                        template:
                        function(obj){
                            let redOne = obj.color_one.slice(1, 3).toLowerCase()
                            let greenOne = obj.color_one.slice(3, 5).toLowerCase()
                            let blueOne = obj.color_one.slice(5, 7).toLowerCase()
                            let redTwo = obj.color_two.slice(1, 3).toLowerCase()
                            let greenTwo = obj.color_two.slice(3, 5).toLowerCase()
                            let blueTwo = obj.color_two.slice(5, 7).toLowerCase()
                        
                            var bar = "0123456789abcdef";
                            var system = 16;

                            var redDecimalOne = 0;
                            var greenDecimalOne = 0;
                            var blueDecimalOne = 0;
                            var redDecimalTwo = 0;
                            var greenDecimalTwo = 0;
                            var blueDecimalTwo = 0;

                            for(let i = 0; i < redOne.length; i++) {
                                redDecimalOne += bar.indexOf(redOne[i]) * Math.pow(system, redOne.length - i - 1);
                            }
                            for(let i = 0; i < greenOne.length; i++) {
                                greenDecimalOne += bar.indexOf(greenOne[i]) * Math.pow(system, greenOne.length - i - 1);
                            }
                            for(let i = 0; i < blueOne.length; i++) {
                                blueDecimalOne += bar.indexOf(blueOne[i]) * Math.pow(system, blueOne.length - i - 1);
                            }
                            for(let i = 0; i < redTwo.length; i++) {
                                redDecimalTwo += bar.indexOf(redTwo[i]) * Math.pow(system, redTwo.length - i - 1);
                            }
                            for(let i = 0; i < greenTwo.length; i++) {
                                greenDecimalTwo += bar.indexOf(greenTwo[i]) * Math.pow(system, greenTwo.length - i - 1);
                            }
                            for(let i = 0; i < blueTwo.length; i++) {
                                blueDecimalTwo += bar.indexOf(blueTwo[i]) * Math.pow(system, blueTwo.length - i - 1);
                            }

                            let redLightOne = redDecimalOne * 0.2126;
                            let greenLightOne =  greenDecimalOne * 0.7152;
                            let blueLightOne = blueDecimalOne * 0.0722;
                            let redLightTwo = redDecimalTwo * 0.2126;
                            let greenLightTwo =  greenDecimalTwo * 0.7152;
                            let blueLightTwo = blueDecimalTwo * 0.0722;
                            
                            let perceivedLightnessOne = (redLightOne + greenLightOne + blueLightOne) / 255;
                            let perceivedLightnessTwo = (redLightTwo + greenLightTwo + blueLightTwo) / 255;

                            let threshold = 0.5;

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