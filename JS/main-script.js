
var canvas;
var ctx;
var enemies=[];
var explosions=[];
var ecount=0;
var output;
var my_ship;
var background_img;
var background;



function main() {
    canvas = document.getElementById('screen');
    ctx = canvas.getContext("2d");
    output=document.getElementById("output");

    my_ship= new Ship();
    my_ship.init(100,canvas.height-15,15,15);

    background_img= new Image();
    background_img.src="../images/space-v.png";
    background= new background(canvas,background_img);


    var generate_enimies=setInterval(function(){
        var x_cord=Math.floor((Math.random()*canvas.width));
        var speed= Math.ceil(Math.random()*6);
        if( ecount<3){
            var e=new Ship();
            e.init(x_cord,0,20,20,"blue");
            e.speed=speed;
            var img= new Image();
            img.src="../images/evil_ship.png";
            e.img=img;
            enemies.push(e);
            ecount++;

        }

        animate();
    },30);

}
function background(canvas,img){
    this.x=0
    this.y=img.height-canvas.height-100;
    this.w=img.width
    this.h=img.height
    this.render=function(){
        ctx.drawImage(img,this.x,this.y-=5,img.width,img.height/3,0,0,canvas.width,canvas.height);
        if (this.y<canvas.height){
            this.y=img.height-canvas.height-100;
        }
    }
}
function animate(){
    ctx.clearRect(0,0, canvas.width,canvas.height);
    background.render();
    render_enemies();
    render_explosions()
    my_ship.render();

   //output.innerHTML=ecount;

}

function Ship(){
    this.x=0; this.y=0; this.w=0; this.h=0;
    this.init=function(x,y,w,h){
        this.x=x ,this.y=y ,this.w= w ,this.h=h

    };
    this.img=new Image();
    this.img.src="../images/blue_ship.png";
    this.missles=[];
    this.render=function(){
        var missle_image= new Image();
        missle_image.src="../images/missle.png"
        ctx.drawImage(this.img,this.x,this.y,this.w,this.h);
        for (var i=0;i<this.missles.length;i++){
            var m=this.missles[i];

            ctx.drawImage(missle_image,m.x, m.y-=4, m.w, m.h)
            //ctx.fillRect(m.x, m.y-=4, m.w, m.h);
            this.hitDetect(this.missles[i],i);
            if(m.y<=0){
                this.missles.splice(i,1);
            }

        }
    };

    this.hitDetect=function(m,index){
        for( var i=0;i<enemies.length;i++){
            var e= enemies[i];
            if(m.x <= e.x+ e.w &&
                m.x+ m.w>=e.x&&
                m.y <= e.y+ e.h&&
                m.y >= e.y){
                this.missles.splice(index,1);
                enemies.splice(i,1);
                var ex= new Explosion(e.x, e.y);
                explosions.push(ex);
                ecount--;


            }

        }
    }



};

function render_enemies(){
    for(var i=0; i<enemies.length;i++) {
        var e= enemies[i];
        //ctx.fillStyle = enemies[i].color;
        //ctx.fillRect(enemies[i].x, enemies[i].y += enemies[i].speed, enemies[i].w, enemies[i].h);
        ctx.drawImage(e.img, e.x, e.y+= e.speed, e.w, e.h);
        if(enemies[i].y+enemies[i].h>canvas.height){
            enemies.splice(i,1);
            ecount--;
        }
    }
}
function Explosion(x,y){
    this.img= new Image();
    this.img.src="../images/Explosion1.png";
    this.sx=0
    this.sy=0
    this.sw=this.img.width/17
    this.sh=this.img.height
    this.frame=0;
    this.dx=x
    this.dy=y
    this.dw=30;
    this.dh=30
    this.render=function(){
       this.sx=(this.frame%17  )*this.sw;
       //output.innerHTML=this.sx;
        ctx.drawImage(this.img,
            this.sx,
            this.sy,
            this.sw,
            this.sh,
            this.dx,
            this.dy,
            this.dw,
            this.dh
        );


    }
}
function render_explosions(){
    for (var i =0;i<explosions.length;i++){

       explosions[i].render();
       explosions[i].frame++;
       if(explosions[i].frame>17){
           explosions.splice(i,1);
       }
    }


}
window.addEventListener("load",function(event){
    main();

});

window.addEventListener("keypress",function(event){
   switch (event.keyCode){
       case 32:

           my_ship.missles.push(
               {x:my_ship.x+(my_ship.w/2)-2,y: my_ship.y-1,w:4,h:10}
           );
           break;

       case  97:
           my_ship.x-=5;
           break;

       case 100:
           my_ship.x+=5;
           break;
   }
});

